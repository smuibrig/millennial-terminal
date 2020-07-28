/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from "react";
import { useParams } from "react-router-dom";

import SearchBar from "./SearchBar";
import Card from "./Card";

export default function GridPage({ query, setQuery, data, setData }) {
    const { source } = useParams();
// TODO: Add source to search bar query filter
    return (
        <div className="container">
            <SearchBar
                query={query}
                setQuery={setQuery}
                data={data}
                setData={setData}
            />
            {Object.values(data)
                .flat()
                .filter((card) => card.source === source)
                .map((card, index) => (
                    <Card card={card} source={card.source} key={index} />
                ))}
        </div>
    );
}
