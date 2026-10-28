"use client"

import { spring, wrap } from "motion"
import { AnimateView } from "motion/react-animate-view"
import { startTransition, type SVGProps, useState, type JSX } from "react"


const images = Array.from(
    { length: 6 },
    (_, i) => `/assets/photos/memories${String(i + 1).padStart(2, "0")}.jpg`
)

function Slide({ index }: { index: number }) {
    return (
        <AnimateView
            key={index}
            name={`slide-${index}`}
            transition={{
                type: spring,
                visualDuration: 0.3,
                bounce: 0.2,
            }}
            exit={(types) => ({
                opacity: 0,
                transform: `translateX(${
                    types.includes("prev") ? 100 : -100
                }%)`,
            })}
            enter={(types) => ({
                opacity: 1,
                transform: [
                    `translateX(${types.includes("next") ? 100 : -100}%)`,
                    "translateX(0%)",
                ],
            })}
        >
            <div style={slideContainer}>
                <img
                    src={images[index]}
                    alt={`Prague ${index + 1}`}
                    style={imageStyle}
                />
            </div>
        </AnimateView>
    )
}

export default function TransitionTypes(): JSX.Element {
    const [index, setIndex] = useState(0)

    const navigate = (direction: "next" | "prev") => {
        startTransition(() => {
            const nextIndex = wrap(0, images.length, index + (direction === "next" ? 1 : -1));

            if (document.startViewTransition) {
                document.startViewTransition({
                    update: () => setIndex(nextIndex),
                    types: [direction] // Thay thế cho addTransitionType(direction)
                });
            } else {
                setIndex(nextIndex);
            }
        })
    }

    return (
        <div className="view-transition-types" style={container}>
            <button
                style={button}
                aria-label="Previous"
                onClick={() => navigate("prev")}
            >
                <ArrowLeft />
            </button>
            <Slide key={index} index={index} />
            <button
                style={button}
                aria-label="Next"
                onClick={() => navigate("next")}
            >
                <ArrowRight />
            </button>
            <span style={counter}>
                {index + 1} / {images.length}
            </span>
            <StyleSheet />
        </div>
    )
}

/**
 * ==============   Icons   ================
 */

const iconProps: SVGProps<SVGSVGElement> = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
}

function ArrowLeft() {
    return (
        <svg {...iconProps}>
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}

function ArrowRight() {
    return (
        <svg {...iconProps}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
    height: "100%",
}

const counter: React.CSSProperties = {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    color: "var(--feint-text)",
}

const slideContainer: React.CSSProperties = {
    width: 400,
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
}

const imageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
}

const button: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    outlineOffset: 2,
    border: "none",
    cursor: "pointer",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
}

/**
 * ==============   Stylesheet   ================
 */

function StyleSheet() {
    return (
        <style>{`
            .view-transition-types > button:hover {
                background-color: rgba(255, 255, 255, 0.25) !important;
            }
        `}</style>
    )
}
