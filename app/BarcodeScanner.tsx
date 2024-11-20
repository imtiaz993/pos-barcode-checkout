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
    <div className="h-80 relative border-2 border-white">
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "5%",
          width: "90%",
          height: "90%",
          border: "2px solid red",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default ZXingScanner;
