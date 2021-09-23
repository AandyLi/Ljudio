import React, { useState, useContext, useEffect } from "react";
import SearchResults from "./SearchResults";
import PlayerControls from "./PlayerControls";
import { Context } from "../App";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    useLocation,
} from "react-router-dom";
function MainContent() {
    const history = useHistory();
    const oldUrl = useLocation();
    const [context, setContext] = useContext(Context);
    const [playState, setPlayState] = useState(false);
    const [dropDownValue, setDropDownValue] = useState("songs");
    const [retract, setRetract] = useState(false);

    useEffect(() => {
        if (oldUrl.pathname !== "/") {
            setRetract(true);
        } else {
            setRetract(false);
        }
    }, [oldUrl]);

    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }
    const changeSearchInput = (value) => {
        updateContext({ searchInput: value });
        console.log(value, context.searchInput);
    };
    function Search() {
        // router push
        updateContext({
            artistClicked: false,
        });

        history.push(
            `/search/${dropDownValue}/${context.searchInput}/undefined`
        );
        setRetract(true);
    }

    return (
        <div>
            <div className="App">
                <div className={retract ? "body" : "body-expand"}>
                    <h3>Sök efter musik, artister, och album</h3>
                    <div className="searchBar">
                        <div className="select">
                            <select
                                onChange={(e) =>
                                    setDropDownValue(e.target.value)
                                }
                            >
                                <option value="songs">Musik:</option>
                                <option value="artists">Artist:</option>
                            </select>
                        </div>
                        <div className="field">
                            <input
                                value={context.searchInput}
                                onChange={(e) =>
                                    changeSearchInput(e.target.value)
                                }
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") Search();
                                }}
                            ></input>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route
                        exact
                        path="/search/:searchTerm/:searchValue/:videoId"
                    >
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
