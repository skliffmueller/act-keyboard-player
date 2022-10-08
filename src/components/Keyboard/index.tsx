import React, {useEffect, useRef, useState} from "react";
import { Keyboard } from "./keyboard";
import { PlayerEventType } from "amazon-ivs-player";
import { usePlayerContext } from "../../providers/player";


function KeyboardComponent() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const {
        player
    } = usePlayerContext();

    useEffect(() => {
        if(!player || !canvas.current) {
            return;
        }

        const scene = new Keyboard({canvas:canvas.current});

        let pointer = Promise.resolve({
            cueLog: [],
            cue: null,
            time: 0,
            stringBuf: "",
        });
        const onMetadataCue = ({ cueLog, cue, time, stringBuf }) => {
            try {
                const obj = JSON.parse(cue.text);
                if(Array.isArray(obj)) {
                    cueLog.push({ startTime: cue.startTime + 10, data: obj })
                }
            } catch(e) {

            }
            return {
                cueLog,
                cue,
                time,
                stringBuf,
            };
        }
        const onTimeUpdate = async ({ cueLog, cue, time, stringBuf }) => {
            let nextCueTime = 0;
            cueLog = cueLog.filter((cue) => {
                if(cue.startTime < time) {
                    cue.data.forEach((c) => {
                        const timeoutDelay = c.d + ((time - cue.startTime) * 1000);
                        if(timeoutDelay > 0) {
                            setTimeout(() => {
                                scene.setKeyCodes(c.p);
                            }, timeoutDelay);
                        }
                    });
                    return false;
                }
                return true;
            });
            return {
                cueLog,
                cue,
                time,
                stringBuf,
            };
        }
        const addToPointer = (callback, key) => (data: any) => {
            pointer = pointer.then((res) => callback({...res, [key]:data}));
        }
        const onMetadataCuePointer = addToPointer(onMetadataCue, 'cue');
        const onTimeUpdatePointer = addToPointer(onTimeUpdate, 'time');

        player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, onMetadataCuePointer);
        player.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdatePointer);

        return () => {
            player.removeEventListener(PlayerEventType.TEXT_METADATA_CUE, onMetadataCuePointer);
            player.removeEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdatePointer);
        }
    }, [player, canvas]);


    return (
        <canvas width={1280} height={540} ref={canvas} />
    );
}

export default KeyboardComponent;