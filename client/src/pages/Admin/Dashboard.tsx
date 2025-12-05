import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminDashboard() {
  const { admin } = useAuth();

  return (
    <>
      <AdminLayout>
        <h1>Welcome, {admin?.userName}</h1>
      </AdminLayout>
    </>
  );
}
