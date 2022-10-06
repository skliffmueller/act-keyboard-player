import React, {useEffect, useRef, useState} from "react";

function percentValidation(percent: number): number {
    return percent < 0 ? 0 : (percent > 1 ? 1 : percent);
}

interface SliderProps {
    className: String;
    percent: number;
    onChange: (percent: number) => void;
}

function Slider(props: SliderProps) {
    const {
        className,
        percent,
        onChange,
    } = props;
    const sliderRef = useRef(null);
    const [boundingBox, setBoundingBox] = useState<{ left: number, width: number } | null>(null);

    const onMouseMove = (event: MouseEvent) => {
        if(boundingBox === null) {
            return;
        }
        const { left, width } = boundingBox;
        const newPercent = percentValidation(
            (event.clientX - left) / width
        );
        if(newPercent !== percent) {
            onChange(newPercent);
        }
    }

    const onMouseDown = (event: React.MouseEvent) => {
        if(sliderRef.current === null) {
            return;
        }
        const { left, width } = (sliderRef.current as HTMLElement).getBoundingClientRect();

        const newPercent = percentValidation(
            (event.clientX - left) / width
        );
        if(newPercent !== percent) {
            onChange(newPercent);
        }
        setBoundingBox({ left, width });
    }

    useEffect(() => {
        if(boundingBox === null) {
            return;
        }
        window.addEventListener('mousemove', onMouseMove);
    }, [boundingBox]);

    useEffect(() => {
        window.addEventListener("mouseup", (event) => {
            window.removeEventListener("mousemove", onMouseMove);
            setBoundingBox(null);
        });
    });

    const barStyles = {
        width: `${percent*100}%`
    }

    return (
        <div ref={sliderRef} className={`relative h-3 bg-gray-600 ${className}`} onMouseDown={onMouseDown}>
            <div className="absolute top-0 left-0 h-3 bg-violet-500" style={barStyles}>
                &nbsp;
            </div>
        </div>
    );
}

export default Slider;