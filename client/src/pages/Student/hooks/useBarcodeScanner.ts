import { useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export function useBarcodeScanner() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [useCamera, setUseCamera] = useState(true);
  const [useManualInput, setUseManualInput] = useState(false);
  const [recentScannedItems, setRecentScannedItems] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanActiveRef = useRef(false);

  const stopCamera = () => {
    scanActiveRef.current = false;

    if (scannerRef.current) {
      scannerRef.current.reset();
      scannerRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCameraScan = async () => {
    if (!videoRef.current) return;

    try {
      scannerRef.current = new BrowserMultiFormatReader();
      console.log("Scanner initialized");

      await scannerRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result) => {
          if (!scanActiveRef.current) return;

          if (result) {
            const code = result.getText();
            console.log("DETECTED:", code);
            setBarcodeInput(code);
            setRecentScannedItems((prev) => {
              if (prev.includes(code)) return prev;
              return [code, ...prev];
            });
          }
        }
      );

      scanActiveRef.current = true;
    } catch (e) {
      console.error("Scanner error:", e);
      scanActiveRef.current = false;
    }
  };

  return {
    barcodeInput,
    setBarcodeInput,
    isScanning,
    setIsScanning,
    useCamera,
    setUseCamera,
    useManualInput,
    setUseManualInput,
    recentScannedItems,
    setRecentScannedItems,
    videoRef,
    scannerRef,
    scanActiveRef,
    stopCamera,
    handleCameraScan,
  };
}
