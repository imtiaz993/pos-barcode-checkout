import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ZXingScanner = ({ onScan, onError }: any) => {
  const videoRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice("", videoRef.current, (result, error) => {
      if (result) {
        onScan(result.getText(), beepSound);
      } else if (error) {
        onError && onError(error);
      }
    });
  }, [onScan, onError]);

  return (
    <div className="h-44 w-3/4 mx-auto relative border-2 border-white">
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%", // Adjust to position the line vertically
          left: "10px",
          width: "calc(100% - 20px)",
          height: "2px", // Thickness of the line
          backgroundColor: "red", // Line color
        }}
      ></div>
    </div>
  );
};

export default ZXingScanner;
