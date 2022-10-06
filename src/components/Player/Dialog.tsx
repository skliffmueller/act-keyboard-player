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
    return (
        <div className="absolute bottom-24 right-16 bg-gray-800">
            <ul className="w-64">
                {qualities.map((qualityItem: Quality) => (
                    <li key={qualityItem.name} className="flex justify-between w-full py-2 px-4" onClick={() => onChange(qualityItem)}>
                        {qualityItem.name}
                    </li>
                ))}
                <li className="flex justify-between w-full py-2 px-4" onClick={() => onChange(null)}>
                    Auto
                </li>
            </ul>
        </div>
    );
}

export default Dialog;