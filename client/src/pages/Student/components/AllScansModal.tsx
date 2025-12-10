import { X, Scan, Award, Package, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";

interface AllScansModalProps {
  isOpen: boolean;
  onClose: () => void;
  scans: any[];
  totalPoints: number;
}

export default function AllScansModal({
  isOpen,
  onClose,
  scans,
  totalPoints,
}: AllScansModalProps) {
  if (!isOpen) return null;

  const getProductName = (scan: any) => {
    if (scan.Item?.name) {
      return scan.Item.name;
    }
    return `Product (${scan.barcode})`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Scan className="w-6 h-6" />
              All Scans
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete history of your recycling activity
            </p>
          </div>
          <button
            onClick={onClose}
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
            <p className="text-2xl font-bold text-gray-900">{scans.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-sm">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalPoints}</p>
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
                    <p className="font-medium">{getProductName(scan)}</p>
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
            onClick={onClose}
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
