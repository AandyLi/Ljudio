import React, { useState, createContext } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";
import PlayerControls from "./components/PlayerControls";
import Player from "./components/Player";

export const Context = createContext();

function App() {
    const [context, setContext] = useState({
        results: [],
        artist: {},
        songs: [],
        player: {
            isPlaying: false,
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

    const [searchInput, setInput] = useState("");
    const [playState, setPlayState] = useState(false);
    const [dropDownValue, setDropDownValue] = useState("songs");

    const changeSearchInput = (value) => {
        setInput(value);
        console.log(value, searchInput);
    };

    const btnClick = async () => {
        console.log("search button clicked");
        const response = await fetch(
            `https://yt-music-api.herokuapp.com/api/yt/${dropDownValue}/${searchInput}`
        );
        const data = await response.json();

        updateContext({ results: data.content });
    };

    const test = () => {
        console.log(context);
    };

    return (
        <Context.Provider value={[context, updateContext]}>
            <div className="App">
                <Header></Header>
                <div id="body">
                    <h3>Sök efter musik, artister, och album</h3>
                    <div className="field">
                        <input
                            value={searchInput}
                            onChange={(e) => changeSearchInput(e.target.value)}
                        ></input>
                    </div>
                    <select onChange={(e) => setDropDownValue(e.target.value)}>
                        <option value="songs">Musik</option>
                        <option value="artists">Artist</option>
                        <option value="playlists">Playlists</option>
                    </select>
                    <button onClick={btnClick}>Sök!</button>
                    <button onClick={test}>test!</button>
                </div>
                <SearchResults playState={setPlayState}></SearchResults>
                {playState ? <PlayerControls /> : <></>}
                <Footer></Footer>
            </div>
        </Context.Provider>
    );
}

export default App;
