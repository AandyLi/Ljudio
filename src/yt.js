function onYouTubeIframeAPIReady() {
    // using global variable
    window.player = new YT.Player("yt-player", {
        height: "0",
        width: "0",
        events: {
            onStateChange: onPlayerStateChange,
        },
        playerVars: {
            origin: window.location.host,
        },
    });
}

// this function triggers when we change song in player
// can be used to update things, like counters
function onPlayerStateChange(event) {
    if (event.data != YT.PlayerState.PLAYING) return;
}
