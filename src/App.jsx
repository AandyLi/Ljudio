import React, { useState, createContext } from "react";

import "./App.css";

import MainContent from "./components/MainContent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Player from "./components/Player";
import { BrowserRouter as Router } from "react-router-dom";

export const Context = createContext();

function App() {
    const [context, setContext] = useState({
        results: [],
        searchInput: "",
        artist: {},
        artistClicked: false,
        songs: [],
        player: {
            startPlaying: false,
            currentSong: {},
            currentSongIndex: 0,
            currentSongId: 0,
        },
    });
    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }

    return (
        <Context.Provider value={[context, updateContext]}>
            <Router>
                <Header />
                <MainContent />
                <Footer />
            </Router>
        </Context.Provider>
    );
}

export default App;
