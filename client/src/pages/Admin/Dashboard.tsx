import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminDashboard() {
  const { admin } = useAuth();
  const { logout } = useAuth();

  return (
    <>
      <AdminLayout>
        <h1>Welcome, {admin?.userName}</h1>
        <Button variant="destructive" onClick={logout}> 
          Logout
        </Button>
      </AdminLayout>
    </>
  );
}
