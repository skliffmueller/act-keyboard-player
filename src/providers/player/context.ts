import {createContext, MutableRefObject, RefObject, useContext} from "react";
import {
    MediaPlayer,
    Quality, TextMetadataCue,
} from 'amazon-ivs-player';
import {ActionCue} from "../../typings/actionCue";

interface PlayerContextStructControls {
    play: () => void;
    pause: () => void;
    mute: () => void;
    unmute: () => void;
    reset: () => void;
    setVolume: (volume: number) => void;
    seekTo: (time: number) => void;
    setQuality: (quality: Quality | null) => void;
    fakeMetadata: (metadata: TextMetadataCue) => void;
}

interface PlayerContextStructState {
    isMuted: boolean;
    isPaused: boolean;
    isLoading: boolean;
    volume: number;
    quality: Quality | null;
    qualities: Quality[];
    duration: number;
    bufferDuration: number;
    time: number;
    metadataCue: ActionCue<any> | null;
}

interface PlayerContextStruct {
    player: MediaPlayer | undefined;
    video: RefObject<HTMLVideoElement> | null;
    pid: string;
    destroy: () => void;
    load: (srcUrl: string) => void;
    controls: PlayerContextStructControls;
    state: PlayerContextStructState;
}

export const PlayerContext = createContext<PlayerContextStruct>({
    player: undefined,
    video: null,
    pid: "",
    destroy: () => {},
    load: () => {},
    controls: {
        play: () => {},
        pause: () => {},
        mute: () => {},
        unmute: () => {},
        reset: () => {},
        setVolume: () => {},
        seekTo: () => {},
        setQuality: () => {},
        fakeMetadata: () => {},
    },
    state: {
        isMuted: true,
        isPaused: false,
        isLoading: true,
        volume: 0,
        quality: null,
        qualities: [],
        duration: 0,
        bufferDuration: 0,
        time: 0,
        metadataCue: null,
    }
});

PlayerContext.displayName = "PlayerContext";

export function usePlayerContext() {
    const context = useContext(PlayerContext);
    return context;
}
