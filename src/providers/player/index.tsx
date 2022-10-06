import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import {
    create as createMediaPlayer,
    ErrorType,
    isPlayerSupported,
    MediaPlayer,
    PlayerError,
    PlayerEventType,
    PlayerState,
    Quality,
    TextCue,
    TextMetadataCue,
    LogLevel,
} from 'amazon-ivs-player';

import wasmBinaryPath from 'file-loader?!amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm';
import wasmWorkerPath from 'file-loader?!amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';

import { v4 as uuid } from 'uuid';
import { PlayerContext } from "./context";
import {ActionCue} from "../../typings/actionCue";

export * from "./context";

interface PlayerProviderProps {
    id: string;
    children: React.ReactNode;
}

const PlayerProvider = (props: PlayerProviderProps) => {
    const { id, children } = props;
    const player = useRef<MediaPlayer>();
    const video = useRef<HTMLVideoElement>(null);
    const pid = useRef(`${id} (${uuid().slice(-3)})`);

    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [volume, setVolumeState] = useState(0);
    const [quality, setQualityState] = useState<Quality | null>(null);
    const [qualities, setQualitiesState] = useState<Quality[]>([]);

    const [duration, setDurationState] = useState(0);
    const [bufferDuration, setBufferDurationState] = useState(0);
    const [time, setTimeState] = useState(0);

    const [metadataCue, setMetadataCueState] = useState<ActionCue<any> | ActionCue<any>[] | null>(null);

    const play = useCallback(() => {
        if(!player.current) return;

        if(player.current.isPaused()) {
            player.current.play();
            setIsPaused(false);
        }
    }, [player, setIsPaused]);

    const pause = useCallback(() => {
        if(!player.current) return;

        if(!player.current.isPaused()) {
            player.current.pause();
            setIsPaused(true);
        }
    }, [player, setIsPaused]);

    const mute = useCallback(() => {
        if (!player.current) return;

        if(!player.current.isMuted()) {
            player.current.setMuted(true);
            setIsMuted(true);
        }
    }, [player, setIsMuted]);
    const unmute = useCallback(() => {
        if (!player.current) return;

        if(player.current.isMuted()) {
            player.current.setMuted(false);
            setIsMuted(false);
        }

        if(!player.current.getVolume()) {
            player.current.setVolume(0.3);
            setVolumeState(0.3);
        }
    }, [player, setIsMuted, setVolumeState]);
    const reset = useCallback(() => {
        setIsMuted(true);
        setIsPaused(false);
        setIsLoading(true);
        setQualitiesState([]);
    }, [setIsMuted, setIsPaused, setIsLoading, setQualitiesState]);

    const onStateChange = useCallback(() => {
        if(!player.current) return;
        const newState = player.current.getState();
        setIsLoading(newState !== PlayerState.PLAYING);
        if(newState === PlayerState.PLAYING && !qualities.length) {
            if(!qualities.length) {
                const newQualities = player.current.getQualities();
                setQualitiesState(newQualities);
                console.log(newQualities);
            }
            const newVolume = player.current.getVolume();
            setVolumeState(newVolume);
        }
        console.log(`Player ${pid.current} State - ${newState}`);
    }, [player, qualities, setIsLoading, setQualitiesState, setVolumeState]);

    const onError = useCallback((err: PlayerError) => {
        console.warn(`Player ${pid.current} Event - ERROR:`, err, player.current);
    }, []);

    // const onMetadataCue = useCallback((cue: TextMetadataCue) => {
    //     try {
    //         const obj = JSON.parse(cue.text);
    //         if(Array.isArray(obj)) {
    //             setMetadataCueState(obj.map(obj => ({...obj, startTime: cue.startTime})));
    //         } else {
    //             setMetadataCueState({...obj, startTime: cue.startTime});
    //         }
    //     } catch(e) {
    //
    //     }
    // }, [player, setMetadataCueState]);

    const onDurationChanged = useCallback((seconds: number) => {
        setDurationState(seconds);
    }, [setDurationState]);

    const onQualityChanged = useCallback((newQuality: Quality) => {
        if(!player.current) return;

        if(player.current.isAutoQualityMode()) {
            setQualityState(null);
        } else {
            setQualityState(newQuality);
        }
    }, [player, setQualityState]);

    const onTimeUpdate = useCallback((seconds: number) => {
        if(seconds !== time) {
            setTimeState(seconds);
        }
    }, [setTimeState]);

    const onBufferDurationChange = useCallback(() => {
        if(!player.current) return;
        const seconds = Math.floor(player.current.getBufferDuration());
        if(seconds !== bufferDuration) {
            setBufferDurationState(seconds);
        }
    }, [player, setBufferDurationState]);

    const destroy = useCallback(() => {
        if (!player.current) return;

        // remove event listeners
        player.current.removeEventListener(PlayerState.READY, onStateChange);
        player.current.removeEventListener(PlayerState.PLAYING, onStateChange);
        player.current.removeEventListener(PlayerState.BUFFERING, onStateChange);
        player.current.removeEventListener(PlayerState.ENDED, onStateChange);
        player.current.removeEventListener(PlayerEventType.ERROR, onError);

        player.current.removeEventListener(PlayerEventType.DURATION_CHANGED, onDurationChanged);
        player.current.removeEventListener(PlayerEventType.BUFFER_UPDATE, onBufferDurationChange);
        player.current.removeEventListener(PlayerEventType.QUALITY_CHANGED, onQualityChanged);
        player.current.removeEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdate);
        player.current.removeEventListener(PlayerEventType.TEXT_METADATA_CUE, onMetadataCue);

        // delete and nullify player
        player.current.pause();
        player.current.delete();
        if(video.current) {
            video.current.removeAttribute('src');
        }

        // reset player state controls to initial values
        reset();
    }, [
        player,
        onStateChange,
        onError,
        onBufferDurationChange,
        onDurationChanged,
        onQualityChanged,
        onTimeUpdate,
        //onMetadataCue
    ]);

    const create = useCallback(() => {
        if (!isPlayerSupported) return;

        // If a player instnace already exists, destroy it before creating a new one
        if (player.current) destroy();

        if(!video.current) return;

        player.current = createMediaPlayer({
            wasmWorker: wasmWorkerPath,
            wasmBinary: wasmBinaryPath,
        });

        video.current.crossOrigin = 'anonymous';
        player.current.attachHTMLVideoElement(video.current);
        player.current.setVolume(0.3);

        player.current.addEventListener(PlayerState.READY, onStateChange);
        player.current.addEventListener(PlayerState.PLAYING, onStateChange);
        player.current.addEventListener(PlayerState.BUFFERING, onStateChange);
        player.current.addEventListener(PlayerState.ENDED, onStateChange);
        player.current.addEventListener(PlayerEventType.ERROR, onError);

        player.current.addEventListener(PlayerEventType.DURATION_CHANGED, onDurationChanged);
        player.current.addEventListener(PlayerEventType.BUFFER_UPDATE, onBufferDurationChange);
        player.current.addEventListener(PlayerEventType.QUALITY_CHANGED, onQualityChanged);
        player.current.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdate);
        // player.current.addEventListener(PlayerEventType.TEXT_METADATA_CUE, onMetadataCue);

    }, [
        player,
        destroy,
        onStateChange,
        onError,
        onBufferDurationChange,
        onDurationChanged,
        onQualityChanged,
        onTimeUpdate,
        //onMetadataCue
    ]);






    const load = useCallback((playbackUrl: string) => {
            if(!player.current) create();
            if(!player.current) return;
            player.current.load(playbackUrl);
            play();
        },
        [player, create, play]
    );

    const setVolume = useCallback((percent: number) => {
        if (!player.current) return;

        if(!percent && !player.current.isMuted()) {
            mute();

        } else if(percent && player.current.isMuted()) {
            unmute();
        }

        player.current.setVolume(percent);
        setVolumeState(percent);
    }, [player, mute, unmute, setVolumeState]);

    const seekTo = useCallback((seconds: number) => {
        if(!player.current) return;

        player.current.seekTo(seconds);
    }, [player]);

    const setQuality = useCallback((quality: Quality | null) => {
        if(!player.current) return;

        if(!quality) {
            player.current.setAutoQualityMode(true);
        } else {
            player.current.setQuality(quality);
        }

    },[player])

    const fakeMetadata = useCallback((cue: ActionCue) => {
        setMetadataCueState(cue);
    }, [setMetadataCueState]);

    const value = {
        player: player.current,
        pid: pid.current,
        video,
        destroy,
        load,
        controls: {
            play,
            pause,
            mute,
            unmute,
            reset,
            setVolume,
            seekTo,
            setQuality,
            fakeMetadata,
        },
        state: {
            isMuted,
            isPaused,
            isLoading,
            volume,
            quality,
            qualities,
            duration,
            bufferDuration,
            time,
            metadataCue,
        }
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};
export default PlayerProvider;
