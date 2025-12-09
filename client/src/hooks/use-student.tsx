export interface Student {
  id: string;
  studentId: string;
  password: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
}

export interface CreateStudentData {
  studentId: string;
  password: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
}

export interface UpdateStudentData {
  studentId?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  grade?: string;
  section?: string;
}

export interface LoginCredentials {
  studentId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  student: Student;
}

export interface StudentWithRank {
  studentId: string;
  id: string;
  firstName: string;
  lastName: string;
  rank: number;
  totalPoints: number;
}

export function useStudent() {
  const base = `${import.meta.env.VITE_API_URL}/students`;

  // GET /api/students/rankings - Get students sorted by total points
  const getStudentRankings = async (): Promise<StudentWithRank[]> => {
    const res = await fetch(`${base}/rankings`);
    if (!res.ok) throw new Error("Failed to fetch rankings");
    return res.json();
  };

  // GET /api/students
  const getAllStudents = async (): Promise<Student[]> => {
    const res = await fetch(base);
    if (!res.ok) throw new Error("Failed to fetch students");
    return res.json();
  };

  // GET /api/students/:id
  const getStudent = async (id: string): Promise<Student> => {
    const res = await fetch(`${base}/${id}`);
    if (!res.ok) throw new Error("Student not found");
    return res.json();
  };

  // POST /api/students (create)
  const createStudent = async (data: CreateStudentData): Promise<Student> => {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create student");
    return res.json();
  };

  // PUT /api/students/:id
  const updateStudent = async (
    id: string,
    data: UpdateStudentData
  ): Promise<Student> => {
    const res = await fetch(`${base}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return res.json();
  };

  // DELETE /api/students/:id
  const deleteStudent = async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${base}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete student");
    return res.json();
  };

  // POST /api/students/login
  const loginStudent = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    const res = await fetch(`${base}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  };

  return {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    loginStudent,
    getStudentRankings,
  };
}
