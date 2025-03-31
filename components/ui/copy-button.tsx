"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton = ({ textToCopy }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme-specific content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // Determine SVG color based on theme
  const svgColor = mounted && theme === "dark" ? "#38BDF8" : "#0E418F";

  return (
    <div className="copy-button-container">
      <button className={`copy-button ${isCopied ? "copied" : ""}`} onClick={handleCopy}>
        <span className="copy-text">
          <svg
            width="10"
            height="10"
            fill={svgColor}
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 467 512.22"
          >
            <path
              fillRule="nonzero"
              d="M131.07 372.11c.37 1 .57 2.08.57 3.2 0 1.13-.2 2.21-.57 3.21v75.91c0 10.74 4.41 20.53 11.5 27.62s16.87 11.49 27.62 11.49h239.02c10.75 0 20.53-4.4 27.62-11.49s11.49-16.88 11.49-27.62V152.42c0-10.55-4.21-20.15-11.02-27.18l-.47-.43c-7.09-7.09-16.87-11.5-27.62-11.5H170.19c-10.75 0-20.53 4.41-27.62 11.5s-11.5 16.87-11.5 27.61v219.69zm-18.67 12.54H57.23c-15.82 0-30.1-6.58-40.45-17.11C6.41 356.97 0 342.4 0 326.52V57.79c0-15.86 6.5-30.3 16.97-40.78l.04-.04C27.51 6.49 41.94 0 57.79 0h243.63c15.87 0 30.3 6.51 40.77 16.98l.03.03c10.48 10.48 16.99 24.93 16.99 40.78v36.85h50c15.9 0 30.36 6.5 40.82 16.96l.54.58c10.15 10.44 16.43 24.66 16.43 40.24v302.01c0 15.9-6.5 30.36-16.96 40.82-10.47 10.47-24.93 16.97-40.83 16.97H170.19c-15.9 0-30.35-6.5-40.82-16.97-10.47-10.46-16.97-24.92-16.97-40.82v-69.78zM340.54 94.64V57.79c0-10.74-4.41-20.53-11.5-27.63-7.09-7.08-16.86-11.48-27.62-11.48H57.79c-10.78 0-20.56 4.38-27.62 11.45l-.04.04c-7.06 7.06-11.45 16.84-11.45 27.62v268.73c0 10.86 4.34 20.79 11.38 27.97 6.95 7.07 16.54 11.49 27.17 11.49h55.17V152.42c0-15.9 6.5-30.35 16.97-40.82 10.47-10.47 24.92-16.96 40.82-16.96h170.35z"
            ></path>
          </svg>
          <span>Copy link</span>
        </span>
        <span className="copied-text">Copied</span>
      </button>
      <style jsx>{`
        .copy-button-container {
          position: relative;
          display: inline-block;
        }

        .copy-button {
          background-color: ${mounted && theme === "dark" ? "#1E293B" : "#f2f7fa"};
          width: 100px;
          height: 34px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          overflow: hidden;
          transition-duration: 700ms;
          position: relative;
          box-sizing: border-box;
          box-shadow: ${mounted && theme === "dark" ? "0 2px 10px rgba(0, 0, 0, 0.5)" : "0 1px 2px rgba(0, 0, 0, 0.1)"};
        }

        .copy-button .copy-text {
          color: ${mounted && theme === "dark" ? "#38BDF8" : "#0e418f"};
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 3px;
          transition-duration: 500ms;
          width: 100%;
          justify-content: center;
          font-size: 13px;
        }

        .copy-button .copied-text {
          position: absolute;
          color: ${mounted && theme === "dark" ? "#7DD3FC" : "#b5ccf3"};
          opacity: 0;
          left: 50%;
          top: 50%;
          transform: translateY(100%) translateX(-50%);
          height: 13px;
          line-height: 13px;
          transition-duration: 500ms;
          width: 100%;
          text-align: center;
          font-size: 13px;
        }

        .copy-button.copied {
          background-color: ${mounted && theme === "dark" ? "#0284C7" : "#0e418f"};
          transition-delay: 100ms;
          transition-duration: 500ms;
        }

        .copy-button.copied .copy-text {
          color: ${mounted && theme === "dark" ? "#BAE6FD" : "#b5ccf3"};
          transform: translateX(-50%) translateY(-150%);
          opacity: 0;
          transition-duration: 500ms;
        }

        .copy-button.copied .copied-text {
          transform: translateX(-50%) translateY(-50%);
          opacity: 1;
          transition-delay: 300ms;
          transition-duration: 500ms;
        }
      `}</style>
    </div>
  );
};

export default CopyButton;
