import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Scan } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface RecentScansCardProps {
  recentScans: any[];
  scans: any[];
  isLoading: boolean;
  onViewAll: () => void;
}

export default function RecentScansCard({
  recentScans,
  scans,
  isLoading,
  onViewAll,
}: RecentScansCardProps) {
  const getProductName = (scan: any) => {
    if (scan.Item?.name) {
      return scan.Item.name;
    }
    return `Product (${scan.barcode})`;
  };

  return (
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
          <div className="text-center py-8 text-gray-500">Loading scans...</div>
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
                    <p className="font-medium">{getProductName(scan)}</p>
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
            onClick={onViewAll}
            className="w-full mt-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            View All {recentScans.length} Recent Scans
          </button>
        )}

        {scans.length > recentScans.length && (
          <button
            onClick={onViewAll}
            className="w-full mt-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            View All {scans.length} Total Scans
          </button>
        )}
      </div>
    </Card>
  );
}
