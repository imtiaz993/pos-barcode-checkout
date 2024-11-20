import React, { useEffect, useRef } from "react";
import {
  MultiFormatReader,
  BarcodeFormat,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

const ZXingScanner = ({ onScan, onError }:any) => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    const codeReader = new MultiFormatReader();
    let animationFrameId:any;
    let isScanning = true;

    // Define the barcode formats to scan for
    const formats = [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      // Add other barcode formats you need to support
    ];

    // Set up decoding hints
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    codeReader.setHints(hints);

    const captureFrame = () => {
      if (!videoRef.current || videoRef.current.readyState !== 4 || !isScanning) {
        animationFrameId = requestAnimationFrame(captureFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Array of angles to rotate (in degrees)
      const angles = [0, 90, 180, 270];

      (async () => {
        for (let angle of angles) {
          // Clear canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Save the context state
          context.save();

          // Move to the center of the canvas
          context.translate(canvas.width / 2, canvas.height / 2);
          // Rotate the canvas
          context.rotate((angle * Math.PI) / 180);
          // Draw the video frame onto the canvas
          context.drawImage(
            video,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );

          // Restore the context to its original state
          context.restore();

          // Get the image data from the canvas
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          // Create a luminance source and binary bitmap
          const luminanceSource = new RGBLuminanceSource(
            imageData.data,
            imageData.width,
            imageData.height
          );
          const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

          try {
            // Try to decode the barcode
            const result = codeReader.decode(binaryBitmap);
            if (result) {
              // Stop scanning to prevent multiple detections
              isScanning = false;
              onScan(result.getText(), beepSound);
              return; // Exit the loop after a successful scan
            }
          } catch (error) {
            if (error instanceof NotFoundException) {
              // Barcode not found in this rotation; continue to next angle
              continue;
            } else {
              // Handle other errors
              onError && onError(error);
              return;
            }
          }
        }

        // Request the next frame if no barcode was found
        if (isScanning) {
          animationFrameId = requestAnimationFrame(captureFrame);
        }
      })();
    };

    const startScanner = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const selectedDeviceId = videoInputDevices[0]?.deviceId || undefined;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedDeviceId },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true); // Required for iOS
        await videoRef.current.play();

        // Start capturing frames
        captureFrame();
      } catch (err) {
        onError && onError(err);
      }
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      isScanning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track:any) => track.stop());
      }
      codeReader.reset();
    };
  }, [onScan, onError]);

  return (
    <div className="h-80">
      <video ref={videoRef} style={{ width: "100%", height: "100%" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ZXingScanner;
