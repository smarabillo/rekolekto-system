import { useState, useEffect } from "react";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scan, Trophy, Award, History, X, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Mock data - replace with actual API calls
const mockScans = [
  {
    id: 1,
    item: "Plastic Bottle",
    points: 10,
    timestamp: "2024-01-15 14:30",
    status: "success",
  },
  {
    id: 2,
    item: "Aluminum Can",
    points: 15,
    timestamp: "2024-01-15 10:15",
    status: "success",
  },
  {
    id: 3,
    item: "Paper",
    points: 5,
    timestamp: "2024-01-14 16:45",
    status: "success",
  },
  {
    id: 4,
    item: "Glass",
    points: 20,
    timestamp: "2024-01-14 09:20",
    status: "success",
  },
  {
    id: 5,
    item: "Cardboard",
    points: 8,
    timestamp: "2024-01-13 11:30",
    status: "success",
  },
];

const mockStudent = {
  firstName: "John",
  lastName: "Doe",
  grade: "10",
  section: "A"
};

export default function Dashboard() {
  const [scans, setScans] = useState(mockScans);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentRank] = useState(15);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [useCamera, setUseCamera] = useState(false);

  // Calculate total points from scans
  useEffect(() => {
    const points = scans.reduce((sum, scan) => sum + scan.points, 0);
    setTotalPoints(points);
  }, [scans]);

  // Handle barcode scan submission
  const handleScanSubmit = () => {
    if (!barcodeInput.trim()) {
      alert("Please enter a valid barcode");
      return;
    }

    setIsScanning(true);

    // Simulate API call
    setTimeout(() => {
      const newScan = {
        id: scans.length + 1,
        item: "Recycled Item",
        points: Math.floor(Math.random() * 20) + 5,
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "success",
      };

      setScans([newScan, ...scans]);
      setBarcodeInput("");
      setIsScanning(false);
      setScanDialogOpen(false);
      setUseCamera(false);

      alert(`You earned ${newScan.points} points for recycling!`);
    }, 2000);
  };

  // Handle camera scan
  const handleCameraScan = () => {
    setUseCamera(true);
    // In a real app, you would initialize the camera here
    setTimeout(() => {
      // Mock camera detection
      const detectedCode = "ITEM_" + Math.floor(Math.random() * 1000);
      setBarcodeInput(detectedCode);
      setUseCamera(false);
      handleScanSubmit();
    }, 2000);
  };

  const logout = () => {
    alert("Logged out!");
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
                    <h1 className="text-3xl font-bold text-gray-800">
                      {mockStudent.firstName} {mockStudent.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Grade {mockStudent.grade} - Section {mockStudent.section}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      <Trophy className="w-4 h-4 mr-2" />
                      Rank #{currentRank}
                    </Badge>
                    <Button variant="outline" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Points</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {totalPoints}
                        </p>
                      </div>
                      <Award className="w-10 h-10 text-blue-500" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Scans</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {scans.length}
                        </p>
                      </div>
                      <Scan className="w-10 h-10 text-green-500" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">School Rank</p>
                        <p className="text-3xl font-bold text-gray-800">
                          #{currentRank}
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
                    className="px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
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

                <div className="space-y-3">
                  {scans.slice(0, 5).map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            scan.status === "success"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <Scan className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{scan.item}</p>
                          <p className="text-sm text-gray-500">
                            {scan.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge className="px-3 py-1 bg-green-100 text-green-800 hover:bg-green-100">
                        +{scan.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
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
                {[
                  { name: "Alice Smith", points: 250, rank: 1 },
                  { name: "Bob Johnson", points: 230, rank: 2 },
                  { name: "Carol White", points: 210, rank: 3 },
                  { name: "David Brown", points: 190, rank: 4 },
                  { name: "You", points: totalPoints, rank: currentRank }
                ].map((student, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${student.rank <= 3 ? 'text-amber-500' : 'text-gray-500'}`}>
                        #{student.rank}
                      </span>
                      <span className={student.name === "You" ? "font-semibold" : ""}>
                        {student.name}
                      </span>
                    </div>
                    <span className="font-semibold text-green-600">{student.points} pts</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats Card */}
            <Card className="rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Average</span>
                  <span className="font-semibold">42 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Total</span>
                  <span className="font-semibold">168 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items Recycled</span>
                  <span className="font-semibold">{scans.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Item</span>
                  <span className="font-semibold">Glass (+20 pts)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Scan Dialog */}
      <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Scan Barcode
            </DialogTitle>
            <DialogDescription>
              Scan the barcode of your recyclable item to earn points.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {useCamera ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {/* Camera preview placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />
                    <p className="text-white">Scanning for barcode...</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setUseCamera(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter barcode manually"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScanSubmit()}
                    disabled={isScanning}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCameraScan}
                    disabled={isScanning}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setScanDialogOpen(false)}
                    disabled={isScanning}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleScanSubmit}
                    disabled={isScanning || !barcodeInput.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isScanning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Scanning...
                      </>
                    ) : (
                      "Submit Scan"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t">
            <p>
              Tip: Make sure the barcode is clean and visible for accurate
              scanning.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}