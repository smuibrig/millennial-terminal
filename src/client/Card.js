/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from "react";

export default function Card({ card, index, source }) {
    const [cardClassName, setCardClassName] = useState("card");
    const [twitter, setTwitter] = useState(false);

    useEffect(() => {
        setCardClassName(`card ${source}`);

        if (source === "twitter") {
            setTwitter(true);
        }
    }, [source, card]);

    return (
        (card && (
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
                            <p className="name">{card.user_display_name}</p>
                        </a>
                    </div>
                )}

                {!twitter && (
                    <a href={card.user_url}>
                        <p className="name">{card.user_display_name}</p>
                    </a>
                )}

                <a href={card.url} target="_blank" rel="noreferrer">
                    <p className="body">{card.body}</p>
                </a>

                <p className="created-at">{card.created_at}</p>
            </div>
        )) || (
            <div className={cardClassName} key={index}>
                Loading...
            </div>
        )
    );
}
