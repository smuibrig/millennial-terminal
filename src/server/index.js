const express = require("express");
const GiphyApiClient = require("giphy-js-sdk-core");
const secrets = require("../../secrets.json");

const app = express();

app.use(express.static("dist"));

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
            body: "",
            image: gif.images.original.url,
            url: gif.url,
            source: "giphy",
        };
    });
}

const searchers = {
    giphy: searchGiphy,
};

app.get("/api/search", async (req, res) => {
    const query = [].concat(req.query.q);
    const sources = Array.from(new Set([].concat(req.query.src))).sort(
        (a, b) => a - b
    );

    const data = await Promise.all(
        sources.map((src) => {
            if (searchers[src]) {
                return searchers[src](query[0], 10);
            }
            return Promise.resolve([]);
        })
    ).catch((err) => {
        console.log(err);
    });

    const results = {};
    sources.forEach((src, i) => {
        results[src] = data[i];
    });

    res.json(results);
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
