import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ZXingScanner = ({ onScan, onError }:any) => {
  const videoRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice(
      '',
      videoRef.current,
      (result, error) => {
        if (result) {
          onScan(result.getText(), beepSound);
        }
        if (error) {
          onError && onError(error);
        }
      }
    );
  }, [onScan, onError]);

  return (
    <div className="border-2 border-white h-80">
      <video ref={videoRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ZXingScanner;
