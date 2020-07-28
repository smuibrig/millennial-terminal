import React, { useState } from "react";
import { BrowserRouter, Route, useLocation, useEffect } from "react-router-dom";
import "./app.css";
import ColumnsPage from "./ColumnsPage";
import GridPage from "./GridPage";
import CardPage from "./CardPage";

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
                <Route
                    exact
                    path="/card/:source/:id"
                    render={() => <CardPage data={data} />}
                />
            </BrowserRouter>
        </div>
    );
}
