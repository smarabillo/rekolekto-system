interface ScanApiResponse {
  message: string;
  scanId: number;
  material_type: "CAN" | "PET";
  size: "SMALL" | "LARGE" | null;
  points: number;
  studentName: string;
  itemName: string; 
}

export interface StudentInfo {
  id: number;
  studentId: string;
  password: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: number;
  user_id: number;
  barcode: string;
  material_detected: "CAN" | "PET";
  size: "SMALL" | "LARGE" | null;
  points_earned: number;
  image_path: string | null;
  response_time_ms: number | null;
  createdAt: string;
  updatedAt: string;
  Student: StudentInfo;
  Item?: {  
    name: string;
    barcode: string;
    material_type: string;
    size: string | null;
  };
}

export function useScans() {
  const base = `${import.meta.env.VITE_API_URL}/scans`;
  // GET /api/scans
  const getAllScans = async (): Promise<Scan[]> => {
    const res = await fetch(base);
    if (!res.ok) throw new Error("Failed to fetch scans");
    return res.json();
  };

  // GET /api/scans/:id
  const getScan = async (id: string): Promise<Scan> => {
    const res = await fetch(`${base}/${id}`);
    if (!res.ok) throw new Error("Scan not found");
    return res.json();
  };

  // POST /api/scans (create)
  const createScan = async (data: Partial<Scan>): Promise<Scan> => {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create scan");
    return res.json();
  };

  return {
    getAllScans,
    getScan,
    createScan,
  };
}
