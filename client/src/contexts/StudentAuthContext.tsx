import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Student } from "@/hooks/use-student";

interface StudentAuthContextType {
  student: Student | null;
  token: string | null;
  login: (studentData: Student, authToken: string) => void;
  logout: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(
  undefined
);

export const StudentAuthProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token + student data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("student_token");
    const storedStudent = localStorage.getItem("student");

    if (storedToken && storedStudent) {
      setToken(storedToken);
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  const login = (studentData: Student, authToken: string) => {
    setStudent(studentData);
    setToken(authToken);

    localStorage.setItem("student_token", authToken);
    localStorage.setItem("student", JSON.stringify(studentData));
  };

  const logout = () => {
    setStudent(null);
    setToken(null);

    localStorage.removeItem("student_token");
    localStorage.removeItem("student");
  };

  return (
    <StudentAuthContext.Provider value={{ student, token, login, logout }}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context)
    throw new Error("useStudentAuth must be used within StudentAuthProvider");
  return context;
};
