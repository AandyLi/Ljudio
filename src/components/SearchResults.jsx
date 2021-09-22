import React, { useContext, useState } from "react";
import { Context } from "../App";
import "./SearchResults.css";
import playingGif from "../img/sound.gif";

function SearchResults(props) {
    const [context, setContext] = useContext(Context);
    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }

    function PlayVideo(id) {
        const currentIndex = (element) => element.videoId === id;
        let player = {
            ...context.player,
        };

        player.currentSongIndex = context.results.findIndex(currentIndex);
        player.currentSongId = id;
        player.currentSong = {
            artist: context.results[player.currentSongIndex].artist.name,
            title: context.results[player.currentSongIndex].name,
        };
        updateContext({ player: player });
        console.log("playing video", id);
        window.player.loadVideoById(id);
        window.player.playVideo();
        window.player.setVolume(10);
        props.playState(true);
    }

    function MusicSection(props) {
        var song = props.song;
        return (
            <div className="songResult">
                <div
                    className="grid-item "
                    style={{
                        backgroundImage: `url(${song.thumbnails[1].url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                    }}
                ></div>
                <div
                    className="play-button far fa-play-circle fa-4x"
                    onClick={() => PlayVideo(song.videoId)}
                ></div>
                <div className="songInfo">
                    <section key={song.videoId}>
                        <h3>{song.name}</h3>
                        <h4>{song.artist.name}</h4>
                        <img
                            src={
                                context.player.currentSongId === song.videoId
                                    ? playingGif
                                    : ""
                            }
                            alt=""
                        />
                    </section>
                </div>
            </div>
        );
    }

    function AlbumSection(props) {
        var song = props.song;
        return (
            <div>
                <section>
                    <h2>Album: {song.name}</h2>
                    <h3>Artist: {song.artist}</h3>
                    <h3>Year: {song.year}</h3>
                </section>
            </div>
        );
    }

    const btnClick = async (artistId) => {
        console.log("artist clicked", artistId);
        const response = await fetch(
            `https://yt-music-api.herokuapp.com/api/yt/artist/${artistId}`
        );
        const artistInfo = await response.json();
        console.log(artistInfo); // handle error if no data..

        // Fetch artist songs
        let songsToAdd = [];

        await Promise.all(
            artistInfo.products.songs.content.map(async (song) => {
                await fetch(
                    `https://yt-music-api.herokuapp.com/api/yt/songs/${song.name}`
                ).then(async (songResponse) => {
                    const songData = await songResponse.json();
                    songsToAdd.push(songData.content[0]);
                    console.log("new song", songData.content[0]);
                });
            })
        );

        console.log("new song - setting songs", JSON.stringify(songsToAdd));
        updateContext({
            results: [],
            artist: artistInfo,
            songs: songsToAdd,
        });
    };

    function ArtistSection() {
        return (
            <div>
                <section className="artistSection">
                    {context.artist.thumbnails !== undefined ? (
                        <img src={context.artist.thumbnails[0].url} alt="" />
                    ) : (
                        <></>
                    )}
                    <h2>{context.artist.name}</h2>
                    <h3>{context.artist.description}</h3>

                    {context.songs.map((song) => (
                        <Section result={song} />
                    ))}
                </section>
            </div>
        );
    }

    function ArtistsSection(props) {
        var artist = props.song;
        return (
            <div
                className="songResult"
                onClick={() => btnClick(artist.browseId)}
                key={artist.browseId}
            >
                <div
                    className="grid-item "
                    style={{
                        backgroundImage: `url(${artist.thumbnails[1].url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                    }}
                ></div>

                <div className="songInfo">
                    <section key={artist.browseId}>
                        <h3>{artist.name}</h3>
                    </section>
                </div>
            </div>
        );
    }

    function PlaylistSection(props) {
        var song = props.song;
        return (
            <div>
                <section key={song.browseId}>
                    <h2>Title: {song.title}</h2>
                    <h2>Author: {song.author}</h2>
                </section>
            </div>
        );
    }

    function Section(props) {
        // console.log("sec", props.result);
        var result = props.result;
        if (result.type === "song") {
            return <MusicSection song={result} />;
        }
        if (result.type === "album") {
            return <AlbumSection song={result} />;
        }
        if (result.type === "artist") {
            return <ArtistsSection song={result} />;
        }
        if (result.type === "playlist") {
            return <PlaylistSection song={result} />;
        } else {
            return <></>;
        }
    }

    function Results() {
        if (context.results.length > 0) {
            return (
                <div className="grid-container">
                    {context.results.map((searchResult) => (
                        <Section result={searchResult} />
                    ))}
                </div>
            );
        }
        return (
            <ArtistSection artist={context.artist} key={context.artist.views} />
        );
    }

    return (
        <div>
            <Results />
            <button onClick={() => test()}> Test </button>
        </div>
    );
}

export default SearchResults;
