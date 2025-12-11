import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, Camera, CheckCircle2, XCircle } from "lucide-react";

interface ScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barcodeInput: string;
  setBarcodeInput: (value: string) => void;
  isScanning: boolean;
  useCamera: boolean;
  setUseCamera: (value: boolean) => void;
  useManualInput: boolean;
  setUseManualInput: (value: boolean) => void;
  recentScannedItems: string[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  scannerRef: React.MutableRefObject<any>;
  scanActiveRef: React.MutableRefObject<boolean>;
  stopCamera: () => void;
  handleCameraScan: () => Promise<void>;
  handleScanSubmit: () => Promise<boolean>;
  switchToManual: () => void;
  closeScanDialog: () => void;
}

export default function ScanDialog({
  open,
  onOpenChange,
  barcodeInput,
  setBarcodeInput,
  useCamera,
  setUseCamera,
  videoRef,
  scanActiveRef,
  stopCamera,
  handleCameraScan,
  handleScanSubmit,
  switchToManual,
  closeScanDialog,
}: ScanDialogProps) {
  const [scanMessage, setScanMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const [currentBarcode, setCurrentBarcode] = useState<string>("");
  const isProcessingRef = useRef(false);
  const scanTimeoutRef = useRef<number | null>(null);
  const lastScannedRef = useRef<string>("");

  // When dialog opens, start camera automatically

  useEffect(() => {
    if (open && useCamera && !scanActiveRef.current) {
      const t = setTimeout(() => handleCameraScan(), 150);
      return () => clearTimeout(t);
    }
  }, [open, useCamera]);

  /* 2️⃣  React to every new barcodeInput */
  useEffect(() => {
    if (!open || !useCamera || !barcodeInput || isProcessingRef.current) return;

    (async () => {
      isProcessingRef.current = true;
      setCurrentBarcode(barcodeInput);

      const ok = await handleScanSubmit();

      setScanMessage({
        type: ok ? "success" : "error",
        text: ok
          ? "Barcode scanned – ready for next one!"
          : "Barcode not found – try again",
      });

      /* reset so the *same* code can be read again */
      setBarcodeInput("");
      setCurrentBarcode("");

      /* short cool-down before we allow the next scan */
      scanTimeoutRef.current = setTimeout(() => {
        isProcessingRef.current = false;
      }, 800);
    })();
  }, [barcodeInput, open, useCamera]);

  // Handle camera barcode detection automatically
  useEffect(() => {
    if (
      open &&
      useCamera &&
      barcodeInput &&
      barcodeInput !== lastScannedRef.current &&
      !isProcessingRef.current
    ) {
      lastScannedRef.current = barcodeInput;
      processCameraBarcode(barcodeInput);
    }
  }, [barcodeInput, open, useCamera]);

  const processCameraBarcode = async (barcode: string) => {
    if (!barcode.trim() || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setCurrentBarcode(barcode);

    try {
      const isSuccessful = await handleScanSubmit();

      if (isSuccessful) {
        setScanMessage({
          type: "success",
          text: "Barcode Successfully Scanned. Continue Scanning!",
        });
      } else {
        setScanMessage({
          type: "error",
          text: "Barcode not in Database. Please try again.",
        });
      }

      // Clear the input so camera can detect next barcode
      setBarcodeInput("");
      setCurrentBarcode("");
    } catch (error) {
      console.error("Error in scan submission:", error);
      setScanMessage({
        type: "error",
        text: "Scanning error. Please try again.",
      });
      setBarcodeInput("");
      setCurrentBarcode("");
    } finally {
      // Clear processing flag after delay
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      scanTimeoutRef.current = setTimeout(() => {
        isProcessingRef.current = false;
        lastScannedRef.current = ""; // Allow scanning same barcode again after delay
      }, 1000);
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (!scanMessage.type) return;
    const t = setTimeout(() => setScanMessage({ type: null, text: "" }), 2000);
    return () => clearTimeout(t);
  }, [scanMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    };
  }, []);

  // Handle manual scan submit
  const handleManualSubmit = async () => {
    const barcode = barcodeInput.trim();
    if (!barcode || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setCurrentBarcode(barcode);

    try {
      const isSuccessful = await handleScanSubmit();

      if (isSuccessful) {
        setScanMessage({
          type: "success",
          text: "Barcode Successfully Scanned. Continue Scanning!",
        });
        setBarcodeInput("");
        setCurrentBarcode("");
      } else {
        setScanMessage({
          type: "error",
          text: "Barcode not in Database. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in manual scan:", error);
      setScanMessage({
        type: "error",
        text: "Scanning error. Please try again.",
      });
    } finally {
      // Clear processing flag after delay
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      scanTimeoutRef.current = setTimeout(() => {
        isProcessingRef.current = false;
        setCurrentBarcode("");
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Scan Barcodes
          </DialogTitle>
          <DialogDescription>
            Scan multiple items continuously. The dialog will stay open for
            rapid scanning.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scan Status Message */}
          {scanMessage.type && (
            <div
              className={`animate-in slide-in-from-top-1 duration-200 rounded-lg p-3 ${
                scanMessage.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {scanMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span
                  className={`text-sm font-medium ${
                    scanMessage.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {scanMessage.text}
                </span>
              </div>
            </div>
          )}

          {/* Camera Mode */}
          {useCamera ? (
            <div className="space-y-3">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Scanner status */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isProcessingRef.current
                        ? "bg-yellow-500 animate-pulse"
                        : scanActiveRef.current
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {isProcessingRef.current
                      ? `Processing: ${currentBarcode || "..."}`
                      : scanActiveRef.current
                      ? "Scanning - Ready"
                      : "Starting..."}
                  </span>
                </div>

                {/* Camera Controls */}
                <div className="absolute top-3 right-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={switchToManual}
                    className="bg-white/90 hover:bg-white"
                    disabled={isProcessingRef.current}
                  >
                    Manual Entry
                  </Button>
                </div>

                {/* Centering Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-32 border-2 border-white/30 rounded-lg">
                    {!isProcessingRef.current && scanActiveRef.current && (
                      <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse opacity-30"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                {isProcessingRef.current
                  ? `Processing barcode ${currentBarcode}...`
                  : "Point camera at barcode. Scanning automatically."}
              </div>
            </div>
          ) : (
            /* Manual Input Mode */
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode and press Enter"
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                  }}
                  onKeyDown={async (e) => {
                    if (
                      e.key === "Enter" &&
                      !isProcessingRef.current &&
                      barcodeInput.trim()
                    ) {
                      e.preventDefault();
                      await handleManualSubmit();
                    }
                  }}
                  disabled={isProcessingRef.current}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setUseCamera(true);
                    if (!isProcessingRef.current) {
                      handleCameraScan();
                    }
                  }}
                  disabled={isProcessingRef.current}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </Button>
              </div>

              <Button
                onClick={handleManualSubmit}
                disabled={isProcessingRef.current || !barcodeInput.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessingRef.current ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing {currentBarcode}...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Scan Item
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              stopCamera();
              closeScanDialog();
            }}
            className="flex-1"
          >
            Done Scanning
          </Button>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          <p>
            💡 Tip:{" "}
            {useCamera
              ? isProcessingRef.current
                ? "Processing scanned item. Ready for next scan in a moment."
                : "Hold barcode steady in the frame. Scanner will detect automatically."
              : "Press Enter to submit or switch to camera scanning."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
