export enum ActionCueModules {
    GLOBAL="global",
    FPS="fps",
    KEYBOARD="keyboard",
}

interface SlimActionCue<T> {
    m: ActionCueModules;
    v: string;npm i
    a: string;
    t: number;
    d: number;
    startTime: number;
    p: T;
}

interface FullActionCue<T> {
    module: ActionCueModules;
    version: string;
    action: string;
    pts: number;
    delay: number;
    startTime: number;
    props: T;
}

export type ActionCue<T> = SlimActionCue<T> | FullActionCue<T>;