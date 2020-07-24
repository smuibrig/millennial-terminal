/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Loading from "./loading";

export default function GiphyFeed({ data }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!data) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    });

    if (loading === true) {
        return <img className="logo-feed" src="/src/client/GIPHY-logo.png"/>;
    }

    return (
        <div className="feed">
            <img className="logo-feed" src="/src/client/GIPHY-logo.png"/> 
            {data &&
                data.map((giph, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="tweet" key={index}>
                        <a href={giph.url}>{giph.body}</a>
                        <img src={giph.image} alt="this" />
                    </div>
                ))}
        </div>
    );
}
