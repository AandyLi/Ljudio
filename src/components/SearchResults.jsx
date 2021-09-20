import React, { useContext, useState } from "react";
import { Context } from "../App";
import "./SearchResults.css";
import playingGif from "../img/sound.gif";

function SearchResults(props) {
    const [context, setContext] = useContext(Context);
    const [currentPlayingId, setCurrentPlayingId] = useState(0);
    const [artistSongs, setArtistSongs] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [songOverride, setSongOverride] = useState(false);

    function updateContext(updates) {
        setContext({
            ...context,
            ...updates,
        });
    }

    function PlayVideo(id) {
        console.log("playing video", id);
        window.player.loadVideoById(id);
        window.player.playVideo();
        window.player.setVolume(10);
        props.playState(true);
        setCurrentPlayingId(id);
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
                                currentPlayingId === song.videoId
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
        const data = await response.json();
        console.log(data);
        updateContext({
            results: [],
            artist: data,
        });
        //setSongOverride(true);
    };

    function ArtistSection({ artist }) {
        return (
            <div>
                <section>
                    <h2>{artist.name}</h2>
                    <h3>{artist.description}</h3>
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
        console.log("sec", props.result);
        var result = props.result;
        if (result.type === "song" || songOverride) {
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
        }
    }

    return (
        <div>
            {/* <h2>Search Results </h2> */}
            <div className="grid-container">
                {context.results.length > 0 ? (
                    context.results.map((searchResult) => (
                        <Section result={searchResult} />
                    ))
                ) : (
                    <ArtistSection artist={context.artist} />
                )}
            </div>
        </div>
    );
}

export default SearchResults;
