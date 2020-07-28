import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./app.css";
import axios from "axios";
import Column from "./Column";
import Grid from "./Grid";

export default function App(props) {
    const [query, setInput] = useState("");
    const [data, setData] = useState({});
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
        <div className="app">
            <input
                id="keyWordInput"
                type="text"
                placeholder="Search"
                onChange={(e) => setInput(e.target.value)}
            />
            <div className="container">
                {Object.entries(data).map(([source, cards], index) => (
                    <Column cards={cards} source={source} key={index} />
                ))}
            </div>
            <BrowserRouter>
                <Route
                    exact
                    path="/grid"
                    render={() => (
                        <Grid
                            query={query}
                            source={data.source}
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
            </BrowserRouter>
        </div>
    );
}
