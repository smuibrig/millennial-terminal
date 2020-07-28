import React, { useState, useEffect } from "react";
import "./app.css";
import axios from "axios";

export default function SearchBar({ query, setQuery, data, setData }) {
    const [twitter, setTwitter] = useState(null);
    const [giphy, setGiphy] = useState(null);
    const [goodReads, setGoodreads] = useState(null);
    const [NYC, setNYC] = useState(null);
    const [movieDB, setMovieDB] = useState(null);

    useEffect(() => {
        const sources = [twitter, giphy, goodReads, NYC, movieDB].filter(
            (a) => a
        );

        const timer = setTimeout(() => {
            if (query) {
                let result;
                (async () => {
                    try {
                        result = await axios.get("/api/search", {
                            params: {
                                q: query,
                                sources,
                            },
                        });
                    } catch (err) {
                        console.log(err);
                    }

                    if (result) {
                        setData(result.data);
                    }
                })();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <input
            id="keyWordInput"
            type="text"
            placeholder="Search"
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
