import React, { useState, useEffect } from "react";
import "./app.css";
import axios from "axios";
import Column from "./Column";

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
            <div className="tick-boxes">
                <div className="tick-box">
                    Twitter{" "}
                    <input
                        type="checkbox"
                        name="twitter"
                        value="twitter"
                        className="tick"
                        onChange={(e) => {
                            if (twitter === null) {
                                setTwitter(e.target.value);
                            } else {
                                setTwitter(null);
                            }
                        }}
                    />
                </div>
                <div className="tick-box">
                    Giphy{" "}
                    <input
                        type="checkbox"
                        name="giphy"
                        value="giphy"
                        className="tick"
                        onChange={(e) => {
                            if (giphy === null) {
                                setGiphy(e.target.value);
                            } else {
                                setGiphy(null);
                            }
                        }}
                    />
                </div>
                <div className="tick-box">
                    New York Times{" "}
                    <input
                        type="checkbox"
                        name="NYC"
                        value="NYC"
                        className="tick"
                        onChange={(e) => {
                            if (NYC === null) {
                                console.log("hello");
                                setNYC(e.target.value);
                            } else {
                                console.log(null);
                                setNYC(null);
                            }
                        }}
                    />
                </div>
                <div className="tick-box">
                    goodReads{" "}
                    <input
                        type="checkbox"
                        name="goodReads"
                        value="goodReads"
                        className="tick"
                        onChange={(e) => {
                            if (goodReads === null) {
                                setGoodreads(e.target.value);
                            } else {
                                setGoodreads(null);
                            }
                        }}
                    />
                </div>
                <div className="tick-box">
                    movieDB{" "}
                    <input
                        type="checkbox"
                        name="movieDB"
                        value="movieDB"
                        className="tick"
                        onChange={(e) => {
                            if (movieDB === null) {
                                setMovieDB(e.target.value);
                            } else {
                                setMovieDB(null);
                            }
                        }}
                    />
                </div>
            </div>
            <div className="container">
                {Object.entries(data).map(([source, cards], index) => (
                    <Column cards={cards} source={source} key={index} />
                ))}
            </div>
        </div>
    );
}
