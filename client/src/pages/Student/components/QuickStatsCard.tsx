import { Card } from "@/components/ui/card";

interface QuickStatsCardProps {
  scans: any[];
  recentScans: any[];
  totalPoints: number;
}

export default function QuickStatsCard({
  scans,
  recentScans,
  totalPoints,
}: QuickStatsCardProps) {
  const getMostScannedMaterial = () => {
    const materialCounts: Record<string, number> = {};
    scans.forEach((scan) => {
      materialCounts[scan.material_detected] =
        (materialCounts[scan.material_detected] || 0) + 1;
    });
    const mostCommon = Object.entries(materialCounts).sort(
      ([, a], [, b]) => b - a
    )[0];
    return mostCommon ? mostCommon[0] : "N/A";
  };

  return (
    <Card className="rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Recent Points (30 days)</span>
          <span className="font-semibold">
            {recentScans.reduce((sum, scan) => sum + scan.points_earned, 0)} pts
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Items Scanned</span>
          <span className="font-semibold">{scans.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Most Scanned Material</span>
          <span className="font-semibold">{getMostScannedMaterial()}</span>
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
  );
}
