/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "./Card";

export default function Column({ cardData, source, query }) {
    const [logoSource, setLogoSource] = useState("");
    const [gridLinkURL, setGridLinkURL] = useState("/grid");
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [cards, setCards] = useState(cardData);

    useEffect(() => {
        setLogoSource(`/public/${source}-logo.png`);
        setGridLinkURL(`/grid/${source}`);
    }, [source]);

    console.log(cards);

    function twitterParams() {
        return {
            twitter: {
                count: 9,
                max_id: cards
            },
        };
    }

    function getSource(s) {
        switch (s) {
            case "twitter":
                return twitterParams();
        }
    }

    function handleLoadMore() {
        setLoading(true);
        // API call to fetch the next page
        (async () => {
            let result;
            try {
                result = await axios.get("/api/search", {
                    params: {
                        q: query,
                        sources: getSource(source),
                    },
                });
            } catch (err) {
                console.log(err);
            }

            if (result) {
                setLoading(false);
                setHasNextPage(result.hasNextPage);
                setCards([...cards, result.data]);
            }
        })();
    }

    const infiniteRef = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: handleLoadMore,
        scrollContainer: "parent",
    });

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
            <div ref={infiniteRef} className="cards">
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
