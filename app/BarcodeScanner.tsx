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
     <div className="absolute inset-0 pointer-events-none">
        {/* Top Left */}
        <div className="absolute top-2.5 left-2.5 border-t-2 border-l-2 border-red-500 w-12 h-12"></div>

        {/* Top Right */}
        <div className="absolute top-2.5 right-2.5 border-t-2 border-r-2 border-red-500 w-12 h-12"></div>

        {/* Bottom Left */}
        <div className="absolute bottom-2.5 left-5 border-b-2 border-l-2 border-red-500 w-12 h-12"></div>

        {/* Bottom Right */}
        <div className="absolute bottom-2.5 right-2.5 border-b-2 border-r-2 border-red-500 w-12 h-12"></div>
      </div>
    </div>
  );
};

export default ZXingScanner;
