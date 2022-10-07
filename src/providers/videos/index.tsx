import React, {useCallback, useEffect, useState} from "react";
import {useVideosContext, VideosContext} from "./context";
import { useNavigate, useLocation } from "react-router-dom";
export * from "./context";

const VideosProvider = (props) => {
    const { children } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [videos, setVideos] = useState([]);
    const [video, setVideo] = useState(null);

    const getVideo = useCallback((streamId: string) => {
        if(!streamId) {
            setVideo(null);
            return;
        }
        const v = videos.find((a) => (a.streamId === streamId));
        if(v) {
            setVideo(v);
        }
    },[videos]);

    const getVideos = useCallback((streamId: string) => {
        fetch('/data/video/list.json')
            .then(response => response.json())
            .then(data =>
                setVideos(
                    data.map(
                        v => ({
                            ...v,
                            startAt: new Date(v.startAt),
                            endAt: v.endAt && new Date(v.endAt),
                        })
                    )
                )
            );
    },[]);

    useEffect(() => {
        getVideos();
    }, []);

    useEffect(() => {
        if(videos.length) {
            if(!location.hash || location.hash === "#") {
                navigate({ hash: videos[0].streamId }, { replace: true });
            } else {
                const streamId = location.hash.split('#').pop();
                getVideo(streamId);
            }
        }
    }, [videos, location]);

    const value = {
        getVideos,
        getVideo,
        state: {
            list: videos,
            single: video,
        }
    };

    return (
        <VideosContext.Provider value={value}>
            {children}
        </VideosContext.Provider>
    );
};
export default VideosProvider;
