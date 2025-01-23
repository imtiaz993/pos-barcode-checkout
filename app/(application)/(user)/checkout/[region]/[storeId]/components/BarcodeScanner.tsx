import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ZXingScanner = ({ onScan, openCart }: any) => {
  const videoRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");
  const [cameraAccessError, setCameraAccessError] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .decodeFromVideoDevice("", videoRef.current, (result) => {
        if (result && !openCart) {
          onScan(result.getText(), beepSound);
        }
      })
      .catch((error) => {
        setCameraAccessError(true);
      });
  }, [onScan]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="h-44 w-3/4 mx-auto relative border-2 border-white">
      {cameraAccessError && (
        <div className="text-red-500 text-center">
          Camera access denied.{" "}
          <span className="text-blue-500 cursor-pointer" onClick={handleReload}>
            Reload page{" "}
          </span>
          or{" "}
          <a
            href="your-permission-settings-url"
            target="_blank"
            rel="noopener noreferrer"
          >
            check permissions.
          </a>
        </div>
      )}
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
