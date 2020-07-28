/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from "react";
import { Link } from "react-router-dom";

export default function Card({ card, index, source }) {
    const cardClassName = `card ${source}`;
    const cardURL = `/card/${source}/${card.id}`;

    console.log(source); 

    return (
        (card && (
            <div className={cardClassName} id={source} key={index}>
                <a href={card.url} target="_blank" rel="noreferrer">
                    {card.image && <img src={card.image} alt="" />}
                </a>

                {source === "twitter" && (
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

                {source !== "twitter" && (
                    <a href={card.user_url}>
                        <p className="name">{card.user_display_name}</p>
                    </a>
                )}

                {source !== "giphy" && <a href={card.url} target="_blank" rel="noreferrer">
                    <p className="body">{card.body}</p>
                </a>}

                <Link to={cardURL}>
                    <p className="created-at">{card.created_at}</p>
                </Link>
            </div>
        )) || (
            <div className={cardClassName} key={index}>
                Loading...
            </div>
        )
    );
}
