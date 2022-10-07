import {createContext, RefObject, useContext} from "react";
import {MediaPlayer, Quality, TextMetadataCue} from "amazon-ivs-player";
import {ActionCue} from "../../typings/actionCue";

type VideoDataItem = {
    live: boolean;
    startAt: Date;
    Bucket: string;
    playlistKey: string;
    thumbnailsPath: string;
    endAt?: Date;
    duration?: number;
}

interface VideosContextStructState {
    list: VideoDataItem[];
    single: VideoDataItem | null;
}

interface VideosContextStruct {
    getVideo: (streamId: string) => void;
    getVideos: () => void;
    state: VideosContextStructState;
}

export const VideosContext = createContext<VideosContextStruct>({
    getVideo: (streamId: string) => {},
    getVideos: () => {},

    state: {
        list: [],
        single: null,
    }
});

VideosContext.displayName = "PlayerContext";

export function useVideosContext() {
    const context = useContext(VideosContext);
    return context;
}
