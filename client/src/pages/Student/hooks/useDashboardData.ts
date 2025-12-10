import { useState, useEffect } from "react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useScans } from "@/hooks/use-scans";
import type { Scan as ScanType } from "@/hooks/use-scans";
import { useStudent, type Student, type StudentWithRank } from "@/hooks/use-student";
import { toast } from "react-hot-toast";

export function useDashboardData() {
  const [scans, setScans] = useState<ScanType[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<StudentWithRank[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const { logout: authLogout, student: authStudent } = useStudentAuth();
  const { getAllScans } = useScans();
  const { getStudentRankings, getStudent } = useStudent();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current student from auth context
        if (authStudent) {
          setCurrentStudent(authStudent);
          try {
            if ("id" in authStudent && typeof authStudent.id === "string") {
              const studentProfile = await getStudent(authStudent.id);
              setCurrentStudent(studentProfile);
            }
          } catch (profileError) {
            console.warn("Could not fetch student profile, using auth data:", profileError);
          }
        }
        
        // Fetch scans from API
        let scansData: ScanType[] = [];
        try {
          scansData = await getAllScans();
        } catch (scanError) {
          console.error("Failed to fetch scans from API, using mock data:", scanError);
          toast.error("Could not load scans. Using demo data.");
        }
        setScans(scansData);
        
        // Fetch rankings from API
        let rankingsData: StudentWithRank[] = [];
        try {
          rankingsData = await getStudentRankings();
        } catch (rankError) {
          console.error("Failed to fetch rankings from API, using mock data:", rankError);
          toast.error("Could not load rankings. Using demo data.");
        }
        setRankings(rankingsData);
        
        // Find current student's rank
        if (currentStudent || authStudent) {
          const studentToUse = currentStudent || authStudent;
          const myRank = rankingsData.find((rankStudent) => {
            if ("studentId" in rankStudent && "studentId" in studentToUse!) {
              return rankStudent.studentId === studentToUse!.studentId;
            }
            if ("id" in rankStudent && "id" in studentToUse!) {
              return rankStudent.id === studentToUse!.id;
            }
            return false;
          });
          
          if (myRank) {
            setCurrentRank(myRank.rank);
            setTotalPoints(myRank.totalPoints);
          } else {
            const pointsFromScans = scansData.reduce(
              (sum: number, scan: any) => sum + scan.points_earned,
              0
            );
            setTotalPoints(pointsFromScans);
            const estimatedRank =
              rankingsData.filter((r) => r.totalPoints > pointsFromScans).length + 1;
            setCurrentRank(estimatedRank);
          }
        } else {
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

  return {
    scans,
    totalPoints,
    currentRank,
    isLoading,
    error,
    recentScans,
    rankings,
    currentStudent,
    authStudent,
    authLogout,
    setScans,
    setTotalPoints,
    setCurrentRank,
    setRankings,
  };
}