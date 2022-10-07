import "./Player.scss";
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import {
    Quality,
    TextCue,
    TextMetadataCue,
} from 'amazon-ivs-player';
import {
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    AdjustmentsHorizontalIcon,
    CheckIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    Cog8ToothIcon,

    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    PlayIcon,
    PauseIcon,
} from '@heroicons/react/24/solid'

import { usePlayerContext } from "../../providers/player";
import { useVideosContext } from "../../providers/videos";

import { secondsToTime } from "../../lib/transform";

import Dialog from "./Dialog";
import Slider from "./Slider";

interface PlayerProps {
    srcUrl: string;
}

function Player(props: PlayerProps) {
    const container = useRef<HTMLDivElement>(null);
    const [isDialogActive, setIsDialogActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFocus, setIsFocus] = useState(true);

    const defaultIconClassName = `w-8 h-8`;
    const buttonClassName = `p-2`;
    const { getVideo, state: videoState } = useVideosContext();
    const {
        player,
        video,
        pid,
        destroy,
        load,
        controls,
        state,
    } = usePlayerContext();

    useEffect(() => {
        if(videoState.single && video) {
            if(videoState.single.live) {
                load(props.srcUrl);
            } else {
                load(`https://${videoState.single.Bucket}.s3.amazonaws.com/${videoState.single.playlistKey}`);
            }
        }
    }, [video, videoState.single]);

    const playButtonOnClick = () => (state.isPaused ? controls.play() : controls.pause());
    const muteButtonOnClick = () => (state.isMuted ? controls.unmute() : controls.mute());

    /*
    On live stream duration will be Infinity,
    time will be the amount of seconds already played,
    bufferDuration is the number of seconds behind the stream you are
    (bar percent) = (time) / (time+bufferDuration)
     */

    /*
    On playback duration will be video length in seconds
    time will be the amount of seconds already played
    bufferDuration will be the amount of video loaded in seconds
    (bar percent) = time / duration
     */

    const timelinePercent = state.duration === Infinity
        ? (state.time / (state.time + state.bufferDuration))
        : (state.time / state.duration);
    const setTimelinePercent = (percent: number) => controls.seekTo(percent * state.duration);

    const onQualityChange = (quality: Quality | null) => {
        controls.setQuality(quality);
        setIsDialogActive(false);
    }

    const fullscreenOnClick = () => {
        if(!container.current) return;
        if(isFullscreen) {
            document.exitFullscreen();
        } else {
            container.current.requestFullscreen();
        }

    }

    useEffect(() => {
        if(!container.current) return;
        let timeout = null;
        const onMouseMove = () => {
            timeout && clearTimeout(timeout);
            setIsFocus(true);
            timeout = setTimeout(() => {
                setIsFocus(false);
            }, 3000);
        }
        const onMouseOut = () => {
            timeout && clearTimeout(timeout);
            setIsFocus(false);
        }
        container.current.addEventListener('mousemove', onMouseMove);
        container.current.addEventListener('mouseout', onMouseOut);
        container.current.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            if(timeout) {
                clearTimeout(timeout);
            }
            if(!container.current) return;
            container.current.removeEventListener('mousemove', onMouseMove);
            container.current.removeEventListener('mouseout', onMouseOut);
            container.current.removeEventListener('fullscreenchange', onFullscreenChange);
        }
    }, []);

    const onFullscreenChange = (event: Event) => {
        if(document.fullscreenElement) {
            setIsFullscreen(true);
        } else {
            setIsFullscreen(false);
        }
    }

    return (
        <div ref={container} className="Player relative">
            <video className={`${isFullscreen ? 'w-full' : ''}`} width={1280} height={720} volume={0.3} ref={video} />

            <div className={`absolute bottom-0 left-0 w-full bg-opaque-600 transition-opacity ${isFocus ? 'opacity-100' : 'opacity-0'}`}>
                <Slider className="w-full" percent={timelinePercent} onChange={setTimelinePercent} />
                {isDialogActive && <Dialog quality={state.quality} qualities={state.qualities} onChange={onQualityChange} />}
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <button className={buttonClassName} onClick={playButtonOnClick}>
                            {
                                state.isPaused
                                    ? <PlayIcon className={defaultIconClassName} />
                                    : <PauseIcon className={defaultIconClassName} />
                            }
                        </button>
                        <button className={buttonClassName} onClick={muteButtonOnClick}>
                            {
                                state.isMuted
                                    ? <SpeakerXMarkIcon className={defaultIconClassName} />
                                    : <SpeakerWaveIcon className={defaultIconClassName} />
                            }
                        </button>
                        <Slider className="w-32 mx-3 my-2 inline-block" percent={state.isMuted ? 0 : state.volume} onChange={controls.setVolume} />
                        <span>{state.duration === Infinity ? secondsToTime(state.bufferDuration) : secondsToTime(state.time)} / {state.duration === Infinity ? secondsToTime(state.time) : secondsToTime(state.duration)}</span>
                    </div>
                    <div className="flex">
                        <button className={buttonClassName} onClick={() => setIsDialogActive(!isDialogActive)}>
                            <div className="inline-block px-2">{state.quality ? state.quality.name : 'Auto'}</div>
                            <AdjustmentsHorizontalIcon className={`${defaultIconClassName} inline-block`} />
                        </button>
                        <button className={buttonClassName} onClick={() => fullscreenOnClick()}>
                            {
                                isFullscreen
                                    ? <ArrowsPointingInIcon className={defaultIconClassName} />
                                    : <ArrowsPointingOutIcon className={defaultIconClassName} />
                            }
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Player;
