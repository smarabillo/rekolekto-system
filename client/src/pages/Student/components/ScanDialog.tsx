import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {/* REAL CAMERA FEED */}
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div
                className={`absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded animate-pulse ${
                  scanActiveRef.current ? "text-green-500" : "text-red-500"
                }`}
              >
                Scanner: {scanActiveRef.current ? "ON" : "OFF"}
              </div>

              {/* Camera Controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchToManual}
                >
                  Enter Manually
                </Button>
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
              ? "Hold barcode steady in front of camera. Click 'Enter Manually' if camera isn't working."
              : "Click 'Camera' button to switch back to camera scanning."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}