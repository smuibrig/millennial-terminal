/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const express = require("express");
const GiphyApiClient = require("giphy-js-sdk-core");
const Twitter = require("twitter-lite");
const goodreads = require("goodreads-api-node");
const MovieDB = require("node-themoviedb");
const axios = require("axios");

const secrets = require("../../secrets.json");

const app = express();
app.use(express.static("dist"));

async function searchNYT(q) {
    let result;

    try {
        result = await axios.get(
            `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${q}&api-key=${secrets.NYT_KEY}`
        );
    } catch (err) {
        console.log(err);
    }

    return result.data.response.docs.map((article) => {
        return {
            body: article?.abstract,
            image: `https://www.nytimes.com/${article?.multimedia[0]?.url}`,
            url: article?.web_url,
            user_display_name: article?.headline.main,
            user_url: article?.web_url,
            created_at: article?.pub_date,
            source: "NYT",
        };
    });
}

const mdbClient = new MovieDB(secrets.MOVIE_DB_KEY, {});

async function searchMovieDB(q, limit) {
    const {
        data: { results: movies },
    } = await mdbClient.search.movies({
        query: {
            query: q,
            page: 1,
        },
    });

    const result = movies.map((movie) => {
        return {
            body: movie.overview,
            image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            url: `https://www.themoviedb.org/movie/${movie.id}`,
            user_display_name: movie.title,
            user_url: `https://www.themoviedb.org/movie/${movie.id}`,
            created_at: movie.release_date,
            source: "movieDB",
        };
    });

    return result.slice(0, limit);
}

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
        const date = [
            book.original_publication_year._,
            book.original_publication_month._,
            book.original_publication_day._,
        ]
            .filter((a) => a)
            .join("-");

        return {
            body: book.best_book.title,
            image: book.best_book.image_url,
            url: `https://www.goodreads.com/book/show/${book.best_book.id._}`,
            user_display_name: book.best_book.author.name,
            user_url: `https://www.goodreads.com/author/show/${book.best_book.author.id._}`,
            created_at: date,
            source: "goodreads",
        };
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
    movieDB: searchMovieDB,
    NYT: searchNYT,
};

function dedup(sources) {
    return Array.from(new Set(sources.filter((s) => s)));
}

app.get("/api/search", async (req, res) => {
    const query = [].concat(req.query.q);

    let sources = Object.keys(searchers);
    if (req.query.sources && req.query.sources.length > 0) {
        sources = dedup(req.query.sources);
    }

    sources.sort();

    const data = await Promise.all(
        sources.map((src) => {
            if (searchers[src]) {
                return searchers[src](query[0], 10).catch((err) => {
                    console.log(err);
                });
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
