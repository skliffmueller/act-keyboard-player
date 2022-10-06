export function secondsToTime(seconds: number) {
    const ms = seconds % 1;
    seconds -= ms;
    const s = seconds % 60;
    seconds -= s;
    const msecs = (seconds % 3600);
    const m = msecs / 60;
    seconds -= msecs;
    const h = seconds / 3600;

    return h
            ? `${h}:${doubleZero(m)}:${doubleZero(s)}`
            : `${m}:${doubleZero(s)}`;
}

export function doubleZero(value: number) {
    return value < 9
                ? `0${value}`
                : `${value}`;
}