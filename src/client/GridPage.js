/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import SearchBar from "./SearchBar";
import Card from "./Card";

export default function GridPage({ query, setQuery, data, setData }) {
    const { source } = useParams();
    const [logoSource, setLogoSource] = useState("");

    useEffect(() => {
        setLogoSource(`/public/${source}-logo.png`);
    }, [source]);

    return (
        <div className="container">
            <SearchBar
                source={source}
                query={query}
                setQuery={setQuery}
                data={data}
                setData={setData}
            />
            <Link to="/">
                <img src={logoSource} className="logo-grid" alt="Source logo" />
            </Link>

            <div className="grid-container">
                {Object.values(data)
                    .flat()
                    .filter((card) => card.source === source)
                    .map((card, index) => (
                        <Card card={card} source={card.source} key={index} />
                    ))}
            </div>
        </div>
    );
}


