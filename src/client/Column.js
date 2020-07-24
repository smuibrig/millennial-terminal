import React, { useState, useEffect } from "react";

export default function Column({ cards, source }) {
    const [logoSource, setLogoSource] = useState("");

    useEffect(() => {
        setLogoSource(`src/client/${source}-logo.png`);
    }, [source]);

    return (
        <div className="column">
            <img src={logoSource} className="logo-column" alt="Source logo" />
            {cards &&
                cards.map((card, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="card" key={index}>
                        <a href={card.url}>{card.body}</a>
                        {card.image && <img src={card.image} alt="" />}
                    </div>
                ))}
        </div>
    );
}
