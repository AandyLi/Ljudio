import React, { useState } from "react";
import { Context } from "../App";

function Player() {
    const [context, updateContext] = useContext(Context);

    function PlayVideo(id) {
        console.log("playing video in video player", id);
        window.player.loadVideoById(id);
        window.player.playVideo();
        window.player.setVolume(10);
    }
}

export default Player;
