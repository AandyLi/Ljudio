import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
function PlayerControls() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [playProgress, setPlayProgress] = useState(0);
    const [maxDuration, setMaxDuration] = useState(0);
    const [context, setContext] = useContext(Context);

    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }

    useEffect(() => {
        const id = setInterval(() => {
            if (isPlaying) {
                console.log("updating play progress");
                setPlayProgress(window.player.getCurrentTime());
                setMaxDuration(player.getDuration());
            }
        }, 1000);
        return () => clearInterval(id);
    });
    function Seek(value) {
        window.player.seekTo(value);
        setPlayProgress(value);
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
        player.currentSong = {
            artist: context.results[player.currentSongIndex].artist.name,
            title: context.results[player.currentSongIndex].name,
        };
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
        player.currentSong = {
            artist: context.results[player.currentSongIndex].artist.name,
            title: context.results[player.currentSongIndex].name,
        };
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
            <div className="tt">
                <div id="songInfo">
                    <h3>{context.player.currentSong.artist}</h3>
                    <h4>{context.player.currentSong.title}</h4>
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
            <input
                type="range"
                min="0"
                max={maxDuration}
                value={playProgress}
                className="progressRange"
                onChange={(e) => {
                    Seek(e.target.value);
                }}
            />
        </div>
    );
}

export default PlayerControls;
