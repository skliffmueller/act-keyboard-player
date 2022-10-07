
import React from 'react';
import Player from "./Player";

import PlayerProvider from "../providers/player";
import VideosProvider from "../providers/videos";
import Keyboard from "./Keyboard";
import VideoList from "./VideoList";
const srcUrl = 'https://9e7fd3f7e754.us-east-1.playback.live-video.net/api/video/v1/us-east-1.737419903277.channel.N6vgKWQrHNjZ.m3u8';

function Home() {
    return (
        <div className="text-gray-100">
            <VideosProvider>
                <PlayerProvider id="pid">
                    <div className="flex justify-center">
                        <div>
                            <Player srcUrl={srcUrl} />
                            <Keyboard />
                        </div>
                        <div>
                            <VideoList />
                        </div>
                    </div>
                </PlayerProvider>
            </VideosProvider>
        </div>
    );
}

export default Home;
