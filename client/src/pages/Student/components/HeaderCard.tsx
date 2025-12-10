import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Scan } from "lucide-react";

interface HeaderCardProps {
  currentStudent: any;
  authStudent: any;
  currentRank: number;
  isLoading: boolean;
  onLogout: () => void;
  onScan: () => void;
}

export default function HeaderCard({
  currentStudent,
  authStudent,
  currentRank,
  isLoading,
  onLogout,
  onScan,
}: HeaderCardProps) {
  return (
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
                    currentStudent?.lastName || authStudent?.lastName || "Name"
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
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Scan Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-8 py-6 text-md font-light tracking-wide bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
            onClick={onScan}
          >
            <Scan className="w-5 h-5 mr-2" />
            Scan New Item
          </Button>
        </div>
      </div>
    </Card>
  );
}
