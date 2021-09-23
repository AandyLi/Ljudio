import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import "./SearchResults.css";
import playingGif from "../img/sound.gif";

import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
} from "react-router-dom";

function SearchResults(props) {
    let { searchTerm, searchValue, videoId } = useParams();
    let { artistId } = useParams();
    const history = useHistory();
    const [context, setContext] = useContext(Context);
    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }

    useEffect(async () => {
        const response = await fetch(
            `https://yt-music-api.herokuapp.com/api/yt/${searchTerm}/${searchValue}`
        );
        const data = await response.json();

        if (videoId !== undefined) {
            var player = {
                isPlaying: true,
            };
            updateContext({ results: data.content, player: player });
        } else {
            updateContext({ results: data.content });
        }
    }, [searchTerm, searchValue]);

    useEffect(async () => {
        setTimeout(() => {
            PlayVideo(videoId);
        }, 1000);
    }, [context.player.isPlaying]);

    useEffect(async () => {
        if (props.artist) {
            clickOnArtist(artistId);
        }
    }, [props.artist]);

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
                    onClick={() => {
                        //PlayVideo(song.videoId);
                        console.log(`/search/songs/${searchValue}/${videoId}`);
                        PlayVideo(song.videoId);
                        history.push(
                            `/search/songs/${searchValue}/${song.videoId}`
                        );
                    }}
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

    const clickOnArtist = async (artistId) => {
        if (!props.artist) {
            history.push(`/artist/${artistId}`);
        }

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
            results: songsToAdd,
            artistClicked: true,
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
                onClick={() => clickOnArtist(artist.browseId)}
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
        if (context.results.length > 0 && !context.artistClicked) {
            return (
                <div className="grid-container">
                    {context.results.map((searchResult) => (
                        <Section result={searchResult} />
                    ))}
                </div>
            );
        }
        return (
            <div>
                <h1>{searchValue}</h1>
                <ArtistSection
                    artist={context.artist}
                    key={context.artist.views}
                />
            </div>
        );
    }
    return (
        <div>
            <Results />
        </div>
    );
}

export default SearchResults;
