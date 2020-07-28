import React, { useEffect, useState } from "react";

export default function Grid ({ query, source }) {
    // Get source as props from App.js
    const [q, setQ] = useState("");
    const [data, setData] = useState({});
    const [channel, setChannel] = useState("");
    const [twitter, setTwitter] = useState(false); 

    useEffect(() => {
        if (source !== undefined) {
            setChannel(source);
        }

        if (query){
            setQ(query); 
        }

        if(source === "twitter") {
            setTwitter(true); 
        }



        const timer = setTimeout(() => {
            if (query) {
                let result;
                (async () => {
                    try {
                        result = await axios.get("/api/search", {
                            params: {
                                q,
                                sources: channel,
                            },
                        });
                    } catch (err) {
                        console.log(err);
                    }

                    if (result) {
                        setData(result.data);
                    }
                })();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div>
            {data &&
                data.map((card, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
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
                                <p className="name">{card.user_display_name}</p>
                            </a>
                        )}

                        <a href={card.url} target="_blank" rel="noreferrer">
                            <p className="body">{card.body}</p>
                        </a>

                        <p className="created-at">{card.created_at}</p>
                    </div>
                ))}
        </div>
    );
}
