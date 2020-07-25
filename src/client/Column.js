import React, { useState, useEffect } from "react";

export default function Column({ cards, source }) {
    const [logoSource, setLogoSource] = useState("");
    const [cardClassName, setCardClassName] = useState("card");

    useEffect(() => {
        setLogoSource(`src/client/${source}-logo.png`);
        setCardClassName(`card ${source}`);
    }, [source]);

    return (
        <div className="column">
            <img src={logoSource} className="logo-column" alt="Source logo" />
            {cards &&
                cards.map((card, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className={cardClassName} key={index}>
                        <a href={card.url} target="_blank" rel="noreferrer">
                            {card.image && <img src={card.image} alt="" />}
                            <p>{card.user_display_name}</p>
                            <p>{card.body}</p>
                            <p>{card.created_at}</p>
                        </a>
                    </div>
                ))}
        </div>
    );
}
