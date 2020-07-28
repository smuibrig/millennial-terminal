import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./app.css";
import ColumnsPage from "./ColumnsPage";
import GridPage from "./GridPage";

export default function App(props) {
    const [query, setQuery] = useState("");
    const [data, setData] = useState({});

    return (
        <div className="app">
            <BrowserRouter>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <ColumnsPage
                            query={query}
                            setQuery={setQuery}
                            data={data}
                            setData={setData}
                        />
                    )}
                />
                <Route
                    exact
                    path="/grid/:source"
                    render={() => (
                        <GridPage
                            query={query}
                            setQuery={setQuery}
                            data={data}
                            setData={setData}
                        />
                    )}
                />
            </BrowserRouter>
        </div>
    );
}
