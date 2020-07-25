/* eslint-disable camelcase */
const express = require("express");
const GiphyApiClient = require("giphy-js-sdk-core");
const Twitter = require("twitter-lite");
const goodreads = require("goodreads-api-node");

const secrets = require("../../secrets.json");

const app = express();

app.use(express.static("dist"));

const goodReadsClient = goodreads({
    key: secrets.GOOD_READS_KEY,
    secret: secrets.GOOD_READS_SECRET,
});

async function searchGoodReads(q, limit) {
    const res = await goodReadsClient.searchBooks({
        q,
        page: 1,
        field: "all",
    });

    const books = res.search.results.work.map((book) => {
        const dateData = [book.original_publication_year._, book.original_publication_month._, book.original_publication_day._]

        let date = '';  
        
        dateData.forEach((time) => {
            if (time !== undefined && date === ''){
                date += `${time}`; 
            } else if (time !== undefined) {
                date += `-${time}`;
            }
        }); 

        const link = `https://www.goodreads.com/book/show/${book.best_book.id._}`;

        const result = {
            body: book.best_book.title,
            image: book.best_book.image_url,
            url: link,
            user_display_name: book.best_book.author.name,
            created_at: date,
            source: "goodreads",
        };
        return result;
    });

    return books.slice(0, limit);
}

const giphyClient = GiphyApiClient(secrets.GIPHY_API_KEY);

async function searchGiphy(q, limit) {
    const res = await giphyClient.search("gifs", {
        q,
        sort: "relevant",
        lang: "en",
        limit,
    });

    return res.data.map((gif) => {
        return {
            title: gif.title,
            image: gif.images.original.url,
            url: gif.url,
            user_name: gif.user?.username,
            user_display_name: gif.user?.display_name,
            user_url: gif.user?.profile_url,
            created_at: gif.create_datetime || gif.import_datetime,
            source: "giphy",
        };
    });
}

const twitterClient = new Twitter({
    bearer_token: secrets.TWITTER_BEARER_TOKEN,
});

function tweetImage(tweet) {
    const entities = [tweet.extended_entities, tweet.entities];

    for (let i = 0; i < entities.length; i += 1) {
        if (entities[i] && entities[i].media && entities[i].media.length > 0) {
            return entities[i].media[0].media_url_https;
        }
    }

    return "";
}

async function searchTwitter(q, limit) {
    const res = await twitterClient.get("search/tweets", {
        q,
        count: limit,
    });

    return res.statuses.map((tweet) => {
        return {
            body: tweet.text,
            url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
            user_name: tweet.user.screen_name,
            user_display_name: tweet.user.name,
            user_url: tweet.user.url,
            image: tweetImage(tweet),
            created_at: tweet.created_at,
            source: "twitter",
        };
    });
}

const searchers = {
    giphy: searchGiphy,
    twitter: searchTwitter,
    goodReads: searchGoodReads,
};

function uniqueSources(sources) {
    return Array.from(
        new Set(
            Object.keys(searchers)
                .concat(sources)
                .filter((s) => s)
        )
    ).sort((a, b) => a - b);
}

app.get("/api/search", async (req, res) => {
    const query = [].concat(req.query.q);
    const sources = uniqueSources(req.query.sources);

    const data = await Promise.all(
        sources.map((src) => {
            if (searchers[src]) {
                return searchers[src](query[0], 10);
            }
            return Promise.resolve([]);
        })
    );

    const results = {};
    sources.forEach((src, i) => {
        results[src] = data[i];
    });

    res.json(results);
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
