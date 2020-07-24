import React, { useState, useEffect } from "react";
import "./app.css";
import axios from "axios";
import TwitterFeed from "./twitter-feed";
import GiphyFeed from "./giphy-feed";

export default function App(props) {
    const [query, setInput] = useState("");
    const [giphyData, setGiphyData] = useState("");
    const [twitterData, setTwitterData] = useState("");

    useEffect(() => {
        
        if (query) {
            let result;
            (async () => {
                try {
                    result = await axios.get(`/api/search?q=${query}`);
                } catch (err) {
                    console.log(err);
                }

                console.log("Giphy: ", result.data.giphy);
                console.log("Twitter: ", result.data.twitter);
                if (result) {
                    setGiphyData(result.data.giphy);
                    setTwitterData(result.data.twitter);
                }
            })();
        }
    }, [query]);

    return (
        <div className="app">
            <input
                type="text"
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search"
            />
            <div className="feed-container">
                <TwitterFeed data={twitterData} />
                <GiphyFeed data={giphyData} />
            </div>
        </div>
    );
}
