import React, { useState, useContext } from "react";
import SearchResults from "./SearchResults";
import PlayerControls from "./PlayerControls";
import { Context } from "../App";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
} from "react-router-dom";
function MainContent() {
    const history = useHistory();
    const [context, setContext] = useContext(Context);
    const [searchInput, setInput] = useState("");
    const [playState, setPlayState] = useState(false);
    const [dropDownValue, setDropDownValue] = useState("songs");

    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }
    const changeSearchInput = (value) => {
        setInput(value);
        console.log(value, searchInput);
    };

    const test = () => {
        console.log(searchValue);
    };
    function Search() {
        // router push
        updateContext({
            artistClicked: false,
        });
        history.push(`/search/${dropDownValue}/${searchInput}`);
    }

    return (
        <div>
            <div className="App">
                <div id="body">
                    <h3>Sök efter musik, artister, och album</h3>
                    <div className="field">
                        <input
                            value={searchInput}
                            onChange={(e) => changeSearchInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") Search();
                            }}
                        ></input>
                    </div>
                    <select onChange={(e) => setDropDownValue(e.target.value)}>
                        <option value="songs">Musik</option>
                        <option value="artists">Artist</option>
                        <option value="playlists">Playlists</option>
                    </select>
                    <button onClick={Search}>Sök!</button>
                    <button onClick={test}>test!</button>
                </div>
                <Switch>
                    <Route exact path="/search/:searchTerm/:searchValue">
                        <SearchResults playState={setPlayState} />
                    </Route>
                </Switch>
                <Switch>
                    <Route exact path="/artist/:artistId">
                        <SearchResults playState={setPlayState} artist={true} />
                    </Route>
                </Switch>

                {playState ? <PlayerControls /> : <></>}
            </div>
        </div>
    );
}

export default MainContent;