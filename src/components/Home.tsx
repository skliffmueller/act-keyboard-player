
import React from 'react';
import Player from "./Player";

import PlayerProvider from "../providers/player";
import Keyboard from "./Keyboard";
// const srcUrl = 'https://9e7fd3f7e754.us-east-1.playback.live-video.net/api/video/v1/us-east-1.737419903277.channel.N6vgKWQrHNjZ.m3u8';
const srcUrl = 'https://ivs-act-1.s3.amazonaws.com/ivs/v1/737419903277/N6vgKWQrHNjZ/2022/10/4/3/54/PhE8yTd7kVDl/media/hls/master.m3u8';
function Home() {
    return (
        <div className="text-gray-100">
            <PlayerProvider id="pid">
                <Player srcUrl={srcUrl} />
                <Keyboard />
            </PlayerProvider>
        </div>
    );
}

export default Home;
