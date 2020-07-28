/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from "react";
import { useParams, Link } from "react-router-dom";
import Card from "./Card";

export default function CardPage({ data }) {
    const { source, id } = useParams();
    const logoSource = `/public/${source}-logo.png`;
    const card = data[source].find((c) => c.id === id);

    return (
        <div className="container">
            <Link to="/">
                <img src={logoSource} className="logo-card" alt="Source logo" />
            </Link>

            <div className="card-container">
                <Card card={card} source={source} />
            </div>
        </div>
    );
}
