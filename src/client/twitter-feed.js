/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Loading from "./loading";

export default function TwitterFeed({ data }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!data) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    });

    if (loading === true) {
        return <Loading />;
    }

    return (
        <div className="feed">
            <img src="/src/client/twitter-logo.png"/> 
            {data &&
                data.map((tweet, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="tweet" key={index}>
                        <a href={tweet.url}>{tweet.body}</a>
                        <img src={tweet.image} alt="this" />
                    </div>
                ))}
        </div>
    );
}
