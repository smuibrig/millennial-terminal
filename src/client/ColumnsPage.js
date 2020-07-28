/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from "react";
import Column from "./Column";
import SearchBar from "./SearchBar";

export default function ColumnsPage({ query, setQuery, data, setData }) {
    return (
        <div className="container">
            <SearchBar
                query={query}
                setQuery={setQuery}
                data={data}
                setData={setData}
            />
            {Object.entries(data).map(([source, cards], index) => (
                <Column cards={cards} source={source} key={index} />
            ))}
        </div>
    );
}
