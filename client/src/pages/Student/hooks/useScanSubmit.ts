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

  const getStudentId = (student: any): string | null => {
    if ("studentId" in student) return student.studentId;
    if ("id" in student) return student.id;
    return null;
  };

  const createScanObject = (
    apiResponse: ScanApiResponse,
    student: any
  ): any => ({
    id: apiResponse.scanId,
    user_id: student.id,
    barcode: barcodeInput.trim(),
    material_detected: apiResponse.material_type,
    size: apiResponse.size,
    points_earned: apiResponse.points,
    image_path: null,
    response_time_ms: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    Student: student,
    Item: {
      name: apiResponse.itemName,
      barcode: barcodeInput.trim(),
      material_type: apiResponse.material_type,
      size: apiResponse.size,
    },
  });

  const refreshRankings = async (studentId: string) => {
    try {
      const rankingsData = await getStudentRankings();
      setRankings(rankingsData);

      const myRank = rankingsData.find((rankStudent) => {
        const rankId = getStudentId(rankStudent);
        return rankId === studentId;
      });

      if (myRank) {
        setCurrentRank(myRank.rank);
        setTotalPoints(myRank.totalPoints);
      }
    } catch (err) {
      console.error("Failed to refresh rankings:", err);
    }
  };

  const handleScanSubmit = async (): Promise<boolean> => {
    // Validation
    const trimmedBarcode = barcodeInput.trim();
    if (!trimmedBarcode) {
      toast.error("Please enter a valid barcode.");
      return false;
    }

    const studentToUse = currentStudent || authStudent;
    if (!studentToUse) {
      toast.error("You must be logged in to scan items.");
      return false;
    }

    const studentId = getStudentId(studentToUse);
    if (!studentId) {
      toast.error("Student ID not found.");
      return false;
    }

    try {
      // API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId,
          barcode: trimmedBarcode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || "Failed to create scan";

        if (
          errorMsg.toLowerCase().includes("not found") ||
          errorMsg.toLowerCase().includes("does not exist")
        ) {
          // Return false for item not found (dialog will show message)
          return false;
        }

        toast.error(errorMsg);
        return false;
      }

      const apiResponse: ScanApiResponse = await response.json();

      // Update state
      const newScan = createScanObject(apiResponse, studentToUse);
      setScans([newScan, ...scans]);
      setTotalPoints((prev) => prev + apiResponse.points);
      setRecentScannedItems((prev) => [trimmedBarcode, ...prev.slice(0, 4)]);
      setBarcodeInput("");

      // ── camera restart REMOVED ──
      // if (useCamera && !useManualInput) {
      //   setTimeout(() => handleCameraScan(), 500);
      // }

      // Show success message
      toast.success(`Successfully scanned! +${apiResponse.points} points`);

      // Refresh rankings
      await refreshRankings(studentId);

      return true; // Success
    } catch (err) {
      console.error("Scan error:", err);

      // Network or other errors
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit scan. Please try again.";

      if (!errorMessage.toLowerCase().includes("not found")) {
        toast.error(errorMessage);
      }

      return false; // Failure
    }
  };

  return { handleScanSubmit };
}
