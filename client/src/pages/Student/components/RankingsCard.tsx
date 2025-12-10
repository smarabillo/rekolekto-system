import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface RankingsCardProps {
  rankings: any[];
  currentRank: number;
  totalPoints: number;
  currentStudent: any;
  authStudent: any;
  isLoading: boolean;
}

export default function RankingsCard({
  rankings,
  currentRank,
  totalPoints,
  currentStudent,
  authStudent,
  isLoading,
}: RankingsCardProps) {
  return (
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
                    <span className={isCurrentUser ? "font-semibold" : ""}>
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
                <div className="text-center py-2 text-gray-400">...</div>
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
  );
}