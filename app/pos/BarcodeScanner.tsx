import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ZXingScanner = ({ onScan }: any) => {
  const videoRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice("", videoRef.current, (result, error) => {
      if (result) {
        onScan(result.getText(), beepSound);
      }
    });
  }, [onScan]);

  return (
    <div className="h-44 w-3/4 mx-auto relative border-2 border-white">
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          width: "calc(100% - 20px)",
          height: "2px",
          backgroundColor: "red",
        }}
      ></div>
    </div>
  );
};

export default ZXingScanner;
