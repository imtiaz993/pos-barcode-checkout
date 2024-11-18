import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ZXingScanner = ({ onScan, onError }: any) => {
  const videoRef = useRef<any>(null);
  // const beepSound = new Audio("/beep.mp3");
  const audioRef = useRef<any>(null);
  const beepSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error: any) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice("", videoRef.current, (result, error) => {
      if (result) {
        onScan(result.getText(), beepSound);
      }
      if (error) {
        onError && onError(error);
      }
    });
  }, [onScan, onError]);

  return (
    <div className="h-80">
      <audio ref={audioRef} src="/beep.mp3" preload="auto" />
      <video ref={videoRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ZXingScanner;
