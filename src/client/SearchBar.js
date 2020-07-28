import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./app.css";
import axios from "axios";

export default function SearchBar({ data, setData, query, setQuery }) {
    const [source, setSource] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (location) {
            const urlQuery = new URLSearchParams(location.search);
            setQuery(urlQuery.get("q"));
        }
    }, [location]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                let result;
                (async () => {
                    try {
                        result = await axios.get("/api/search", {
                            params: {
                                q: query,
                                sources: source,
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
