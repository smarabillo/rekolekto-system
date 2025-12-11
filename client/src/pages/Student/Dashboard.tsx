import { useState } from "react";

import { useDashboardData } from "./hooks/useDashboardData";
import { useBarcodeScanner } from "./hooks/useBarcodeScanner";
import { useScanSubmit } from "./hooks/useScanSubmit";

// Components
import HeaderCard from "./components/HeaderCard";
import StatsGrid from "./components/StatsGrid";
import RecentScansCard from "./components/RecentScansCard";
import RankingsCard from "./components/RankingsCard";
import QuickStatsCard from "./components/QuickStatsCard";
import AllScansModal from "./components/AllScansModal";
import ScanDialog from "./components/ScanDialog";

export default function Dashboard() {
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    scans,
    totalPoints,
    currentRank,
    isLoading,
    recentScans,
    rankings,
    currentStudent,
    authStudent,
    authLogout,
    setScans,
    setTotalPoints,
    setCurrentRank,
    setRankings,
  } = useDashboardData();

  const {
    barcodeInput,
    setBarcodeInput,
    isScanning,
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
    resumeScanning, 
    isProcessingScan, 
    setIsProcessingScan,
  } = useBarcodeScanner();

  const { handleScanSubmit } = useScanSubmit({
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
  });

  return (
    <>
      <section className="w-full min-h-screen p-4 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 max-w-7xl mx-auto">
          {/* Left Column - Main Dashboard */}
          <div className="space-y-6">
            {/* Header Card */}
            <HeaderCard
              currentStudent={currentStudent}
              authStudent={authStudent}
              currentRank={currentRank}
              isLoading={isLoading}
              onLogout={authLogout}
              onScan={() => setScanDialogOpen(true)}
            />

            {/* Stats Grid */}
            <StatsGrid
              totalPoints={totalPoints}
              scans={scans}
              recentScans={recentScans}
              isLoading={isLoading}
            />

            {/* Recent Scans Section */}
            <RecentScansCard
              recentScans={recentScans}
              scans={scans}
              isLoading={isLoading}
              onViewAll={() => setIsModalOpen(true)}
            />
          </div>

          {/* Right Column - Side Blocks */}
          <div className="space-y-6">
            {/* Rankings Card */}
            <RankingsCard
              rankings={rankings}
              currentRank={currentRank}
              totalPoints={totalPoints}
              currentStudent={currentStudent}
              authStudent={authStudent}
              isLoading={isLoading}
            />

            {/* Quick Stats Card */}
            <QuickStatsCard
              scans={scans}
              recentScans={recentScans}
              totalPoints={totalPoints}
            />
          </div>
        </div>
      </section>

      {/* All Scans Modal */}
      <AllScansModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scans={scans}
        totalPoints={totalPoints}
      />

      {/* Scan Dialog */}
      <ScanDialog
        open={scanDialogOpen}
        onOpenChange={setScanDialogOpen}
        barcodeInput={barcodeInput}
        setBarcodeInput={setBarcodeInput}
        isScanning={isScanning}
        useCamera={useCamera}
        setUseCamera={setUseCamera}
        useManualInput={useManualInput}
        setUseManualInput={setUseManualInput}
        recentScannedItems={recentScannedItems}
        videoRef={videoRef}
        scannerRef={scannerRef}
        scanActiveRef={scanActiveRef}
        stopCamera={stopCamera}
        handleCameraScan={handleCameraScan}
        handleScanSubmit={handleScanSubmit}
        resumeScanning={resumeScanning}
        isProcessingScan={isProcessingScan}
        setIsProcessingScan={setIsProcessingScan}
        switchToManual={() => {
          setUseCamera(false);
          setUseManualInput(true);
        }}
        closeScanDialog={() => {
          setScanDialogOpen(false);
          setBarcodeInput("");
          setRecentScannedItems([]);
          setUseCamera(true);
          setUseManualInput(false);
        }}
      />
    </>
  );
}
