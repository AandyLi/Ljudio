import React, { useContext, useState } from "react";
import { Context } from "../App";
function PlayerControls() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [context, setContext] = useContext(Context);

    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }

    function VolumeChange(value) {
        window.player.setVolume(value);
    }

    function Resume() {
        window.player.playVideo();
        setIsPlaying(true);
    }
    function Pause() {
        window.player.pauseVideo();
        setIsPlaying(false);
    }
    function Next() {
        var id = context.results[context.player.currentSongIndex + 1].videoId;

        window.player.loadVideoById(id);
        window.player.playVideo();
        window.player.setVolume(10);
        let player = {
            ...context.player,
        };
        player.currentSongIndex++;
        player.currentSongId = id;
        updateContext({ player: player });
    }
    function Previous() {
        var id = context.results[context.player.currentSongIndex - 1].videoId;

        window.player.loadVideoById(id);
        window.player.playVideo();
        window.player.setVolume(10);
        let player = {
            ...context.player,
        };
        player.currentSongIndex--;
        player.currentSongId = id;
        updateContext({ player: player });
    }

    function PlayPause() {
        if (isPlaying) {
            return <i onClick={Pause} className="fas fa-pause fa-3x"></i>;
        } else {
            return <i onClick={Resume} className="fas fa-play fa-3x"></i>;
        }
    }
    return (
        <div className="playerControls">
            <div>
                <h3>Artist name</h3>
                <h4>Song name</h4>
            </div>
            <div className="playPause">
                <i onClick={Previous} className="fas fa-backward fa-2x"></i>
                <PlayPause />
                <i onClick={Next} className="fas fa-forward fa-2x"></i>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                id="myRange"
                onChange={(e) => {
                    VolumeChange(e.target.value);
                }}
            ></input>
        </div>
    );
}

export default PlayerControls;
