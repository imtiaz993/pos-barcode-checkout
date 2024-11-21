import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ZXingScanner = ({ onScan, onError }: any) => {
  const videoRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice(
      "",
      videoRef.current,
      (result: any, error: any) => {
        if (result) {
          const visibleArea = document.getElementById("visible-box");
          if (visibleArea) {
            const rect = visibleArea.getBoundingClientRect();

            // Restrict scanning to the visible area (center box)
            if (
              rect.left < result.x &&
              rect.right > result.x &&
              rect.top < result.y &&
              rect.bottom > result.y
            ) {
              onScan(result.getText(), beepSound);
            }
          } else if (error) {
            onError && onError(error);
          }
        }
      }
    );
  }, [onScan, onError]);

  return (
    <div>
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 pointer-events-none">
        {/* Transparent Box */}
        <div
          id="visible-box"
          className="absolute bg-transparent border-4 border-red-500 pointer-events-none"
          style={{
            top: "calc(50% - 100px)",
            left: "calc(50% - 150px)",
            width: "300px",
            height: "200px",
          }}
        >
          {/* Optional scanning line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ZXingScanner;
