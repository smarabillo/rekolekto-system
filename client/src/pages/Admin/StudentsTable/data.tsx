import { useStudent } from "@/hooks/use-student";

useStudent();

type Students = {
  studentId: number;
  firstName: string;
  lastName: string;
  grade: number;
  section: string;
};

export const rankings: Students[] = [
  {
    studentId: 1,
    firstName: "John",
    lastName: "Doe",
    grade: 10,
    section: "A",
  },
];
