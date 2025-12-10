import { Card } from "@/components/ui/card";
import { Award, Scan, Trophy } from "lucide-react";

interface StatsGridProps {
  totalPoints: number;
  scans: any[];
  recentScans: any[];
  isLoading: boolean;
}

export default function StatsGrid({
  totalPoints,
  scans,
  recentScans,
  isLoading,
}: StatsGridProps) {
  return (
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
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
      </Card>
    </div>
  );
}
