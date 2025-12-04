import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { admin } = useAuth();
  return <h1>Welcome, {admin?.userName}</h1>;
}
