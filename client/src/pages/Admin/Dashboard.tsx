import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminDashboard() {
  const { admin } = useAdminAuth();

  return (
    <>
      <AdminLayout>
        <h1>Welcome, {admin?.userName}</h1>
      </AdminLayout>
    </>
  );
}
