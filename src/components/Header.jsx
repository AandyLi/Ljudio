import React, { useContext } from "react";
import { Context } from "../App";
import "./Header.css";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
function Header() {
    const history = useHistory();
    const [context, setContext] = useContext(Context);
    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }
    function GoHome() {
        console.log("GoHome");
        updateContext({ searchInput: "" });
        history.push("/");
    }
    return (
        <header>
            <div className="header-content">
                <a onClick={() => GoHome()}>
                    <h1>Ljudio</h1>
                </a>
            </div>
        </header>
    );
}

export default Header;
