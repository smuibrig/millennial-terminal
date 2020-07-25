import React, { useState, useEffect } from "react";
import "./app.css";
import axios from "axios";
import Column from "./Column";

export default function App(props) {
    const [query, setInput] = useState("");
    const [data, setData] = useState({});

    useEffect(() => {
        if (query) {
            let result;
            (async () => {
                try {
                    result = await axios.get(`/api/search?q=${query}`);
                } catch (err) {
                    console.log(err);
                }

                if (result) {
                    setData(result.data);
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
            <div className="container">
                {Object.entries(data).map(([source, cards], index) => (
                    <Column cards={cards} source={source} key={index}/>
                ))}
            </div>
        </div>
    );
}
