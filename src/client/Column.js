/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Column({ cards, source }) {
    const [logoSource, setLogoSource] = useState("");
    const [cardClassName, setCardClassName] = useState("card");
    const [twitter, setTwitter] = useState(false);

    useEffect(() => {
        setLogoSource(`src/client/${source}-logo.png`);
        setCardClassName(`card ${source}`);

        if (source === "twitter") {
            setTwitter(true);
        }
    }, [source]);

    return (
        <div className="column">
            <div className="header">
                <Link to="/get">
                    <img
                        src={logoSource}
                        className="logo-column"
                        alt="Source logo"
                    />
                </Link>
            </div>
            <div className="cards">
                {cards &&
                    cards.map((card, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div className={cardClassName} key={index}>
                            <a href={card.url} target="_blank" rel="noreferrer">
                                {card.image && <img src={card.image} alt="" />}
                            </a>

                            {twitter && (
                                <div>
                                    <a href={card.user_url}>
                                        <img
                                            id="twitter-profile-pic"
                                            src={card.user_image}
                                            alt=""
                                        />
                                        <p className="name">
                                            {card.user_display_name}
                                        </p>
                                    </a>
                                </div>
                            )}

                            {!twitter && (
                                <a href={card.user_url}>
                                    <p className="name">
                                        {card.user_display_name}
                                    </p>
                                </a>
                            )}

                            <a href={card.url} target="_blank" rel="noreferrer">
                                <p className="body">{card.body}</p>
                            </a>

                            <p className="created-at">{card.created_at}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
