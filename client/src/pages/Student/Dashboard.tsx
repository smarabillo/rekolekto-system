import { useState, useEffect, useRef } from "react";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Scan,
  Trophy,
  Award,
  History,
  X,
  Camera,
  Package,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useScans } from "@/hooks/use-scans";
import type { Scan as ScanType } from "@/hooks/use-scans";
import {
  useStudent,
  type Student,
  type StudentWithRank,
} from "@/hooks/use-student";

import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [scans, setScans] = useState<ScanType[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [useCamera, setUseCamera] = useState(true);
  const [useManualInput, setUseManualInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [recentScannedItems, setRecentScannedItems] = useState<string[]>([]);
  const [rankings, setRankings] = useState<StudentWithRank[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const { logout: authLogout, student: authStudent } = useStudentAuth();
  const { getAllScans, createScan } = useScans();
  const { getStudentRankings, getStudent } = useStudent();

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Fetch student profile, scans and rankings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current student from auth context
        if (authStudent) {
          setCurrentStudent(authStudent);

          // Try to fetch fresh student data from API
          try {
            // Assuming authStudent has an id property
            if ("id" in authStudent && typeof authStudent.id === "string") {
              const studentProfile = await getStudent(authStudent.id);
              setCurrentStudent(studentProfile);
            }
          } catch (profileError) {
            console.warn(
              "Could not fetch student profile, using auth data:",
              profileError
            );
          }
        }

        // Fetch scans from API
        let scansData: ScanType[] = [];
        try {
          scansData = await getAllScans();
        } catch (scanError) {
          console.error(
            "Failed to fetch scans from API, using mock data:",
            scanError
          );
          toast.error("Could not load scans. Using demo data.");
        }
        setScans(scansData);

        // Fetch rankings from API
        let rankingsData: StudentWithRank[] = [];
        try {
          rankingsData = await getStudentRankings();
        } catch (rankError) {
          console.error(
            "Failed to fetch rankings from API, using mock data:",
            rankError
          );
          rankingsData = rankings;
          toast.error("Could not load rankings. Using demo data.");
        }
        setRankings(rankingsData);

        // Find current student's rank
        if (currentStudent || authStudent) {
          const studentToUse = currentStudent || authStudent;
          const myRank = rankingsData.find((rankStudent) => {
            // Check by studentId
            if ("studentId" in rankStudent && "studentId" in studentToUse!) {
              return rankStudent.studentId === studentToUse!.studentId;
            }
            // Check by id
            if ("id" in rankStudent && "id" in studentToUse!) {
              return rankStudent.id === studentToUse!.id;
            }
            return false;
          });

          if (myRank) {
            setCurrentRank(myRank.rank);
            setTotalPoints(myRank.totalPoints);
          } else {
            // If not found in rankings, calculate from scans
            const pointsFromScans = scansData.reduce(
              (sum: number, scan: any) => sum + scan.points_earned,
              0
            );
            setTotalPoints(pointsFromScans);
            // Estimate rank based on points
            const estimatedRank =
              rankingsData.filter((r) => r.totalPoints > pointsFromScans)
                .length + 1;
            setCurrentRank(estimatedRank);
          }
        } else {
          // If no student found, calculate from scans
          const pointsFromScans = scansData.reduce(
            (sum: number, scan: any) => sum + scan.points_earned,
            0
          );
          setTotalPoints(pointsFromScans);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authStudent]);

  // Get recent scans (last 30 days)
  const getRecentScans = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return scans.filter((scan) => {
      const scanDate = new Date(scan.createdAt);
      return scanDate >= thirtyDaysAgo;
    });
  };

  const recentScans = getRecentScans();

  // Handle barcode scan submission
  const handleScanSubmit = async () => {
    if (!barcodeInput.trim()) {
      toast.error("Please enter a valid barcode.");
      return;
    }

    if (!currentStudent && !authStudent) {
      toast.error("You must be logged in to scan items.");
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Determine points based on material (simulate real logic)
      const material = Math.random() > 0.5 ? "CAN" : "PET";
      const points = material === "CAN" ? 5 : Math.random() > 0.5 ? 4 : 3;
      const size =
        material === "PET" ? (Math.random() > 0.5 ? "SMALL" : "LARGE") : null;

      // Create the scan via API
      const newScan = await createScan({
        studentId: currentStudent?.studentId || authStudent?.studentId || "1",
        barcode: barcodeInput,
        material_detected: material,
        size: size,
        points_earned: points,
      });

      // Add new scan to the beginning of the list
      setScans([newScan, ...scans]);

      // Update total points
      setTotalPoints((prev) => prev + newScan.points_earned);

      // Track recently scanned items
      setRecentScannedItems([barcodeInput, ...recentScannedItems.slice(0, 4)]);

      // Clear input for next scan
      setBarcodeInput("");

      // If using camera, restart camera for next scan
      if (useCamera && !useManualInput) {
        setTimeout(() => {
          handleCameraScan();
        }, 500);
      }

      toast.success(
        `✓ ${newScan.material_detected} scanned! +${newScan.points_earned} points`
      );

      // Refresh rankings after successful scan
      try {
        const rankingsData = await getStudentRankings();
        setRankings(rankingsData);

        // Update current rank and points
        const studentToUse = currentStudent || authStudent;
        if (studentToUse) {
          const myRank = rankingsData.find((rankStudent) => {
            if ("studentId" in rankStudent && "studentId" in studentToUse) {
              return rankStudent.studentId === studentToUse.studentId;
            }
            if ("id" in rankStudent && "id" in studentToUse) {
              return rankStudent.id === studentToUse.id;
            }
            return false;
          });
          if (myRank) {
            setCurrentRank(myRank.rank);
            setTotalPoints(myRank.totalPoints);
          }
        }
      } catch (err) {
        console.error("Failed to refresh rankings:", err);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit scan. Please try again.");
      toast.error("Failed to submit scan. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  // Handle camera scan
  const handleCameraScan = async () => {
    setUseCamera(true);
    setUseManualInput(false);
    await startCamera(); // this actually opens the device camera
  };

  // Switch to manual input mode
  const switchToManual = () => {
    setUseCamera(false);
    setUseManualInput(true);
  };

  // Close scan dialog and reset
  const closeScanDialog = () => {
    setScanDialogOpen(false);
    setBarcodeInput("");
    setRecentScannedItems([]);
    setUseCamera(true);
    setUseManualInput(false);
  };

  // When dialog opens, start camera automatically
  useEffect(() => {
    if (scanDialogOpen && useCamera && !useManualInput) {
      startCamera();
    }
  }, [scanDialogOpen, useCamera, useManualInput]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60)
        );
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
      } else if (diffInHours < 168) {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      return dateString;
    }
  };

  // Map barcode to product name
  const getProductName = (barcode: string) => {
    const productMap: Record<string, string> = {
      "8801234567890": "Coca-Cola",
      "8801234567891": "Sprite Bottle",
      "8801234567892": "Pepsi Can",
      "8801234567893": "Water Bottle",
      "8801234567894": "Mountain Dew",
      "8801234567895": "Fanta Bottle",
      "8801234567896": "Red Bull",
      "8801234567897": "Mineral Water",
      "8801234567898": "7-Up Can",
      "8801234567899": "Juice Bottle",
    };
    return productMap[barcode] || `Product (${barcode})`;
  };

  return (
    <>
      <section className="w-full min-h-screen p-4 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 max-w-7xl mx-auto">
          {/* Left Column - Main Dashboard */}
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="leading-tight">
                    <h1 className="text-2xl font-medium text-gray-800">
                      {isLoading
                        ? "Loading..."
                        : `${
                            currentStudent?.firstName ||
                            authStudent?.firstName ||
                            "Student"
                          } ${
                            currentStudent?.lastName ||
                            authStudent?.lastName ||
                            "Name"
                          }`}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {currentStudent || authStudent
                        ? `Grade ${
                            currentStudent?.grade || authStudent?.grade
                          } - Section ${
                            currentStudent?.section || authStudent?.section
                          }`
                        : "Loading student info..."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      <Trophy className="w-4 h-4 mr-2" />
                      {currentRank > 0
                        ? `Rank #${currentRank}`
                        : "Rank: Calculating..."}
                    </Badge>
                    <Button variant="outline" onClick={authLogout}>
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Points</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {isLoading ? "..." : totalPoints}
                        </p>
                      </div>
                      <Award className="w-10 h-10 text-blue-500" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-linear-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Scans</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {isLoading ? "..." : scans.length}
                        </p>
                      </div>
                      <Scan className="w-10 h-10 text-green-500" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-linear-to-br from-amber-50 to-amber-100 border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Recent Scans</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {recentScans.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last 30 days
                        </p>
                      </div>
                      <Trophy className="w-10 h-10 text-amber-500" />
                    </div>
                  </Card>
                </div>

                {/* Scan Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg font-regular bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                    onClick={() => setScanDialogOpen(true)}
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Scan New Item
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Scans Section */}
            <Card className="rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Scans
                  </h2>
                  <Badge variant="secondary">Last 30 days</Badge>
                </div>

                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading scans...
                  </div>
                ) : recentScans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No scans in the last 30 days. Start scanning to earn points!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentScans.slice(0, 3).map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <Scan className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {getProductName(scan.barcode)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500">
                                {formatDate(scan.createdAt)}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {scan.material_detected}
                              </Badge>
                              {scan.size && (
                                <Badge variant="outline" className="text-xs">
                                  {scan.size}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className="px-3 py-1 bg-green-100 text-green-800 hover:bg-green-100">
                          +{scan.points_earned} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {recentScans.length > 3 && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    View All {recentScans.length} Recent Scans
                  </button>
                )}

                {scans.length > recentScans.length && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    View All {scans.length} Total Scans
                  </button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Side Blocks */}
          <div className="space-y-6">
            {/* Rankings Card */}
            <Card className="rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Rankings
              </h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading rankings...
                  </div>
                ) : rankings.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No rankings available yet
                  </div>
                ) : (
                  <>
                    {rankings.slice(0, 5).map((student) => {
                      const isCurrentUser =
                        (student.studentId &&
                          currentStudent?.studentId &&
                          student.studentId === currentStudent.studentId) ||
                        (student.id &&
                          authStudent?.id &&
                          student.id === authStudent.id);
                      return (
                        <div
                          key={student.id || student.studentId}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isCurrentUser
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-bold ${
                                student.rank <= 3
                                  ? "text-amber-500"
                                  : "text-gray-500"
                              }`}
                            >
                              #{student.rank}
                            </span>
                            <span
                              className={isCurrentUser ? "font-semibold" : ""}
                            >
                              {isCurrentUser
                                ? "You"
                                : `${student.firstName} ${student.lastName}`}
                            </span>
                          </div>
                          <span className="font-semibold text-green-600">
                            {student.totalPoints} pts
                          </span>
                        </div>
                      );
                    })}

                    {/* Show current user if not in top 5 */}
                    {currentRank > 5 && currentRank <= rankings.length && (
                      <>
                        <div className="text-center py-2 text-gray-400">
                          ...
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-500">
                              #{currentRank}
                            </span>
                            <span className="font-semibold">You</span>
                          </div>
                          <span className="font-semibold text-green-600">
                            {totalPoints} pts
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Quick Stats Card */}
            <Card className="rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recent Points (30 days)</span>
                  <span className="font-semibold">
                    {recentScans.reduce(
                      (sum, scan) => sum + scan.points_earned,
                      0
                    )}{" "}
                    pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items Scanned</span>
                  <span className="font-semibold">{scans.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most Scanned Material</span>
                  <span className="font-semibold">
                    {(() => {
                      const materialCounts: Record<string, number> = {};
                      scans.forEach((scan) => {
                        materialCounts[scan.material_detected] =
                          (materialCounts[scan.material_detected] || 0) + 1;
                      });
                      const mostCommon = Object.entries(materialCounts).sort(
                        ([, a], [, b]) => b - a
                      )[0];
                      return mostCommon ? mostCommon[0] : "N/A";
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Points per Scan</span>
                  <span className="font-semibold">
                    {scans.length > 0
                      ? Math.round((totalPoints / scans.length) * 10) / 10
                      : "0.0"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* All Scans Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <History className="w-6 h-6" />
                  All Scans
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Complete history of your recycling activity
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4 p-6 border-b bg-gray-50">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Scan className="w-4 h-4" />
                  <span className="text-sm">Total Scans</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {scans.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Total Points</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {totalPoints}
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {getProductName(scan.barcode)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Barcode: {scan.barcode}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(scan.createdAt)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {scan.material_detected}
                          </Badge>
                          {scan.size && (
                            <Badge variant="outline" className="text-xs">
                              {scan.size}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className="px-3 py-1 bg-green-100 text-green-800 hover:bg-green-100">
                      +{scan.points_earned} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan Dialog - Enhanced for Multiple Scans */}
      <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
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
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

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
    </>
  );
}
