/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

export default function Column({ cards, source }) {
    const [logoSource, setLogoSource] = useState("");
    const [cardClassName, setCardClassName] = useState("card");
    const [twitter, setTwitter] = useState(false);
    const [gridLinkURL, setGridLinkURL] = useState("/grid");

    useEffect(() => {
        setLogoSource(`/public/${source}-logo.png`);
        setCardClassName(`card ${source}`);
        setGridLinkURL(`/grid/${source}`);

        if (source === "twitter") {
            setTwitter(true);
        }
    }, [source]);

    return (
        <div className="column">
            <div className="header">
                <Link to={gridLinkURL}>
                    <img
                        src={logoSource}
                        className="logo-column"
                        alt="Source logo"
                    />
                </Link>
            </div>
            <div className="cards">
                {cards &&
                    cards.length > 0 &&
                    cards.map((card, index) => (
                        <Card card={card} index={index} source={source} />
                    ))}

                {(!cards || cards.length == 0) && (
                    <p className="body">No results found in {source}.</p>
                )}
            </div>
        </div>
    );
}
