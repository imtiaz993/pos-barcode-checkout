import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";

const ZXingScanner = ({ onScan, onError }:any) => {
  const videoRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      // Include other formats if needed
    ]);

    const codeReader = new BrowserMultiFormatReader(hints);

    codeReader.decodeFromVideoDevice(
      '',
      videoRef.current,
      (result, error) => {
        if (result) {
          onScan(result.getText(), beepSound);
        } else if (error) {
          onError && onError(error);
        }
      }
    );
  }, [onScan, onError]);

  return (
    <div className="h-80">
      <video ref={videoRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ZXingScanner;
