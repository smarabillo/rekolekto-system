import { useState, useRef, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { toast } from "react-hot-toast";

export function useBarcodeScanner() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [useCamera, setUseCamera] = useState(true);
  const [useManualInput, setUseManualInput] = useState(false);
  const [recentScannedItems, setRecentScannedItems] = useState<string[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanActiveRef = useRef(false);
  const scanCallbackRef = useRef<((result: any, error?: any) => void) | null>(
    null
  );

  const stopCamera = useCallback(() => {
    // console.log("Stopping camera...");
    scanActiveRef.current = false;
    setIsCameraReady(false);
    setIsProcessingScan(false);
    scanCallbackRef.current = null;

    if (scannerRef.current) {
      try {
        scannerRef.current.reset();
      } catch (e) {
        // console.error("Error resetting scanner:", e);
      }
      scannerRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => {
        t.stop();
        // console.log("Stopped track:", t.kind);
      });
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleCameraScan = useCallback(async () => {
    if (!videoRef.current) {
      // console.error("Video ref not available");
      return;
    }

    // Stop any existing camera first
    stopCamera();

    try {
      // console.log("Initializing scanner...");
      scannerRef.current = new BrowserMultiFormatReader();

      // Get user media with constraints
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: "environment" },
        },
        audio: false,
      };

      // console.log("Requesting camera with constraints:", constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Check which device we actually got
      // console.log("Got camera:", videoTrack.label);

      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", "true");

      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current) {
          const onLoaded = () => {
            videoRef.current
              ?.play()
              .then(() => {
                console.log("Video playback started");
                resolve(true);
              })
              .catch((playError) => {
                console.warn("Video play failed:", playError);
                resolve(true);
              });
          };

          if (videoRef.current.readyState >= 3) {
            onLoaded();
          } else {
            videoRef.current.onloadedmetadata = onLoaded;
          }
        }
      });

      // console.log("Starting barcode decoder...");

      // Define the callback function
      const scanCallback = (result: any, error?: any) => {
        if (error) {
          // console.debug("Decoder error:", error);
          return;
        }

        if (!scanActiveRef.current || isProcessingScan) {
          return;
        }

        if (result) {
          const code = result.getText();
          // console.log("✅ Barcode detected:", code);
          // Set the barcode input
          setBarcodeInput(code);
          setRecentScannedItems((prev) => {
            if (prev.includes(code)) return prev;
            return [code, ...prev];
          });
          // Set processing flag to prevent multiple scans
          setIsProcessingScan(true);
          // Pause scanning briefly
          if (scannerRef.current) {
            try {
              scannerRef.current.reset();
            } catch (e) {
              // console.error("Error resetting scanner:", e);
            }
          }
        }
      };

      // Store the callback reference
      scanCallbackRef.current = scanCallback;
      // Start barcode scanning
      scannerRef.current.decodeFromVideoDevice(
        null, // Use current video stream
        videoRef.current,
        scanCallback
      );

      scanActiveRef.current = true;
      setIsCameraReady(true);
      // console.log("🎥 Camera scanner started successfully");
    } catch (e: any) {
      // console.error("❌ Scanner error:", e);
      scanActiveRef.current = false;
      setIsCameraReady(false);
      setIsProcessingScan(false);

      let errorMessage = "Failed to start camera scanner.";
      if (e.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera permissions.";
      } else if (e.name === "NotFoundError") {
        errorMessage =
          "No camera found. Please check your device has a camera.";
      }

      toast.error(errorMessage);

      // Fallback to manual input
      setUseCamera(false);
      setUseManualInput(true);
    }
  }, [stopCamera, isProcessingScan]);

  // Resume scanning after a scan is processed
  const resumeScanning = useCallback(() => {
    if (
      scanActiveRef.current &&
      scannerRef.current &&
      videoRef.current &&
      scanCallbackRef.current
    ) {
      // console.log("Resuming scanning...");
      setIsProcessingScan(false);

      try {
        scannerRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          scanCallbackRef.current
        );
      } catch (error) {
        // console.error("Error resuming scanner:", error);
        // If resume fails, restart the scanner
        handleCameraScan();
      }
    }
  }, [handleCameraScan]);

  const startCameraScan = useCallback(() => {
    if (useCamera && !useManualInput && videoRef.current) {
      // console.log("Starting camera scan...");
      handleCameraScan();
    }
  }, [useCamera, useManualInput, handleCameraScan]);

  const switchToManual = useCallback(() => {
    console.log("Switching to manual input");
    stopCamera();
    setUseCamera(false);
    setUseManualInput(true);
  }, [stopCamera]);

  const switchToCamera = useCallback(() => {
    console.log("Switching to camera mode");
    setUseCamera(true);
    setUseManualInput(false);
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    // console.log("Cleaning up scanner");
    stopCamera();
  }, [stopCamera]);

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
    isCameraReady,
    isProcessingScan,
    setIsProcessingScan,
    videoRef,
    scannerRef,
    scanActiveRef,
    stopCamera,
    handleCameraScan,
    resumeScanning,
    startCameraScan,
    switchToManual,
    switchToCamera,
    cleanup,
  };
}
