import React from "react";
function PlayerControls() {
    function VolumeChange(value) {
        window.player.setVolume(value);
    }

    function Resume() {
        window.player.playVideo();
    }
    function Pause() {
        window.player.pauseVideo();
    }
    return (
        <div className="playerControls">
            <div>
                <h3>Artist name</h3>
                <h4>Song name</h4>
            </div>
            <div className="playPause">
                <i onClick={Resume} className="fas fa-play fa-3x"></i>
                <i onClick={Pause} className="fas fa-pause fa-3x"></i>
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
