import { toast } from "react-hot-toast";
import type { Scan as ScanType } from "@/hooks/use-scans";
import type { Student } from "@/hooks/use-student";
import { useStudent } from "@/hooks/use-student";

interface ScanApiResponse {
  scanId: string;
  material_type: string;
  size: string;
  points: number;
  itemName: string;
}

interface UseScanSubmitProps {
  barcodeInput: string;
  setBarcodeInput: (value: string) => void;
  isScanning: boolean;
  currentStudent: Student | null;
  authStudent: any;
  scans: ScanType[];
  setScans: (scans: ScanType[] | ((prev: ScanType[]) => ScanType[])) => void;
  setTotalPoints: (points: number | ((prev: number) => number)) => void;
  setRecentScannedItems: (
    items: string[] | ((prev: string[]) => string[])
  ) => void;
  setCurrentRank: (rank: number) => void;
  setRankings: (rankings: any[]) => void;
  useCamera: boolean;
  useManualInput: boolean;
  handleCameraScan: () => Promise<void>;
}

export function useScanSubmit({
  barcodeInput,
  setBarcodeInput,
  currentStudent,
  authStudent,
  scans,
  setScans,
  setTotalPoints,
  setRecentScannedItems,
  setCurrentRank,
  setRankings,
  useCamera,
  useManualInput,
  handleCameraScan,
}: UseScanSubmitProps) {
  const { getStudentRankings } = useStudent();

  const handleScanSubmit = async () => {
    if (!barcodeInput.trim()) {
      toast.error("Please enter a valid barcode.");
      return;
    }

    const studentToUse = currentStudent || authStudent;
    if (!studentToUse) {
      toast.error("You must be logged in to scan items.");
      return;
    }

    const studentId =
      "studentId" in studentToUse ? studentToUse.studentId : null;
    if (!studentId) {
      toast.error("Student ID not found.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId,
          barcode: barcodeInput.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create scan");
      }

      const apiResponse: ScanApiResponse = await response.json();

      // Map API response to Scan type
      const newScan: any = {
        id: apiResponse.scanId,
        user_id: studentToUse.id,
        barcode: barcodeInput.trim(),
        material_detected: apiResponse.material_type,
        size: apiResponse.size,
        points_earned: apiResponse.points,
        image_path: null,
        response_time_ms: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        Student: studentToUse,
        Item: {
          name: apiResponse.itemName,
          barcode: barcodeInput.trim(),
          material_type: apiResponse.material_type,
          size: apiResponse.size,
        },
      };

      // Update local state
      setScans([newScan, ...scans]);
      setTotalPoints((prev) => prev + apiResponse.points);
      setRecentScannedItems((prev) => [barcodeInput, ...prev.slice(0, 4)]);
      setBarcodeInput("");

      // Restart camera if using it
      if (useCamera && !useManualInput) {
        setTimeout(() => handleCameraScan(), 500);
      }

      toast.success(
        `✓ ${apiResponse.material_type} scanned! +${apiResponse.points} points`
      );

      // Refresh rankings
      try {
        const rankingsData = await getStudentRankings();
        setRankings(rankingsData);

        const myRank = rankingsData.find((rankStudent) => {
          const rankId =
            "studentId" in rankStudent && rankStudent.studentId
              ? rankStudent.studentId
              : "id" in rankStudent
              ? rankStudent.id
              : undefined;
          return rankId === studentId;
        });

        if (myRank) {
          setCurrentRank(myRank.rank);
          setTotalPoints(myRank.totalPoints);
        }
      } catch (err) {
        console.error("Failed to refresh rankings:", err);
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit scan. Please try again.";
      toast.error(errorMessage);
    }
  };

  return { handleScanSubmit };
}
