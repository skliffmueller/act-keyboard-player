import {Quality} from "amazon-ivs-player";
import React from "react";

interface DialogProps {
    quality: Quality | null;
    qualities: Quality[];
    onChange: (quality: Quality | null) => void;
}

function Dialog(props: DialogProps) {
    const {
        quality,
        qualities,
        onChange,
    } = props;
    const liClassName = 'w-full py-2 px-4 text-right cursor-pointer ';
    return (
        <div className="absolute bottom-16 right-16 bg-gray-800">
            <ul className="min-w-24">
                {qualities.map((qualityItem: Quality) => (
                    <li key={qualityItem.name} className={`${liClassName} ${qualityItem?.name === quality?.name && 'bg-slate-600'}`} onClick={() => onChange(qualityItem)}>
                        {qualityItem.name}
                    </li>
                ))}
                <li className={`${liClassName} ${!quality && 'bg-slate-600'}`} onClick={() => onChange(null)}>
                    Auto
                </li>
            </ul>
        </div>
    );
}

export default Dialog;