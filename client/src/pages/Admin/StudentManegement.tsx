import AdminLayout from "@/layouts/AdminLayout";
import StudentsTable from "@/pages/Admin/blocks/StudentsTable";

export default function StudentManegement() {

  return (
    <>
      <AdminLayout>
        <StudentsTable />
      </AdminLayout>
    </>
  );
}
