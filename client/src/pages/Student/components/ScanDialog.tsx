import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, Camera, CheckCircle2 } from "lucide-react";

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
  handleScanSubmit: () => Promise<void>;
  switchToManual: () => void;
  closeScanDialog: () => void;
}

export default function ScanDialog({
  open,
  onOpenChange,
  barcodeInput,
  setBarcodeInput,
  isScanning,
  useCamera,
  setUseCamera,
  useManualInput,
  setUseManualInput,
  recentScannedItems,
  videoRef,
  scanActiveRef,
  stopCamera,
  handleCameraScan,
  handleScanSubmit,
  switchToManual,
  closeScanDialog,
}: ScanDialogProps) {
  // When dialog opens, start camera automatically
  useEffect(() => {
    if (open && useCamera && !useManualInput) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          handleCameraScan();
        }
      }, 100);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [open, useCamera, useManualInput]);

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
          {/* Recent Scanned Items in Session */}
          {recentScannedItems.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Scanned in this session: {recentScannedItems.length}
                </span>
              </div>
              <div className="space-y-1">
                {recentScannedItems.slice(0, 3).map((barcode, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-green-700 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {barcode}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Camera Mode (Default) */}
          {useCamera && !useManualInput ? (
            <div className="space-y-3">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {/* REAL CAMERA FEED */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Simple Scanner Status Indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      scanActiveRef.current
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {scanActiveRef.current ? "Scanning" : "Scanner Off"}
                  </span>
                </div>

                {/* Camera Controls */}
                <div className="absolute top-3 right-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={switchToManual}
                    className="bg-white/90 hover:bg-white"
                  >
                    Manual Entry
                  </Button>
                </div>

                {/* Simple Centering Guide - Just a subtle border */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-32 border-2 border-white/30 rounded-lg">
                    {/* Simple blinking dot in center */}
                  </div>
                </div>
              </div>

              {/* Simple Instructions */}
              <div className="text-center text-sm text-gray-600">
                {scanActiveRef.current
                  ? "Point barcode at camera. Keep it steady."
                  : "Scanner is off. Camera may be starting..."}
              </div>
            </div>
          ) : (
            /* Manual Input Mode (Optional) */
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode and press Enter"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleScanSubmit();
                    }
                  }}
                  disabled={isScanning}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setUseCamera(true);
                    setUseManualInput(false);
                    handleCameraScan();
                  }}
                  disabled={isScanning}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleScanSubmit}
                  disabled={isScanning || !barcodeInput.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan Item
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={closeScanDialog}
            className="flex-1"
          >
            Done Scanning
          </Button>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          <p>
            💡 Tip:{" "}
            {useCamera && !useManualInput
              ? "Hold barcode steady in the center of the frame. Green light means scanner is active."
              : "Press Enter to submit or switch to camera scanning."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
