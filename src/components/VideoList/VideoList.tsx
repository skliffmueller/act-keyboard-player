import React from "react";
import { useVideosContext } from "../../providers/videos";
import { Link } from "react-router-dom";
import { secondsToTime, toDateString } from "../../lib/transform";

function VideoItem(props) {
    const startAt = new Date(props.startAt);
    const liClassName = `py-2 px-4 cursor-pointer ${props.activeId === props.streamId ? 'bg-gray-700' : ''}`;
    const name = props.name ? props.name : toDateString(startAt);
    return (
        <Link to={{ hash: props.streamId }}>
            <li className={liClassName}>
                <div className="relative">
                    <img className={"brightness-50"} width={220} height={113} alt={`Video ${props.startAt}`} src={`https://ivs-act-1.s3.amazonaws.com/${props.thumbnailsPath}/thumb0.jpg`} />
                    {props.live && (<div className="absolute bottom-2 right-2 rounded px-2 py-1/2 bg-red-600">live</div>)}
                    {!props.live && (<div className="absolute bottom-2 right-2 rounded px-2 py-1/2 bg-opaque-900">{secondsToTime(props.duration/1000)}</div>)}
                </div>
                <div className="px-2 py-1">{name}</div>
            </li>
        </Link>
    );
}

function VideoList(props) {
    const { state } = useVideosContext();

    return (
        <div className="bg-gray-800 max-h-screen overflow-y-scroll">
            <ul className="min-w-24">
                {state.list.map((video) => (<VideoItem {...video} activeId={state.single?.streamId} key={video.streamId} />))}
            </ul>
        </div>
    );
}

export default VideoList;