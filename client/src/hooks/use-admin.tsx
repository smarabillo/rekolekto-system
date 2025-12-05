// src/hooks/useAdminApi.ts

export interface Admin {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdminData {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateAdminData {
  userName?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  admin: Admin;
}


export function useAdmin() {
  const base = `${import.meta.env.VITE_API_URL}/admins`;

  // GET /api/admin
  const getAllAdmins = async (): Promise<Admin[]> => {
    const res = await fetch(base);
    if (!res.ok) throw new Error("Failed to fetch admins");
    return res.json();
  };

  // GET /api/admin/:id
  const getAdmin = async (id: string): Promise<Admin> => {
    const res = await fetch(`${base}/${id}`);
    if (!res.ok) throw new Error("Admin not found");
    return res.json();
  };

  // POST /api/admin (create)
  const createAdmin = async (data: CreateAdminData): Promise<Admin> => {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create admin");
    return res.json();
  };

  // PUT /api/admin/:id
  const updateAdmin = async (
    id: string,
    data: UpdateAdminData
  ): Promise<Admin> => {
    const res = await fetch(`${base}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update admin");
    return res.json();
  };

  // DELETE /api/admin/:id
  const deleteAdmin = async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${base}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete admin");
    return res.json();
  };

  // POST /api/admin/login
  const loginAdmin = async (
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
    getAllAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
  };
}
