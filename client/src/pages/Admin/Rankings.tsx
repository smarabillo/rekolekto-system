import AdminLayout from "@/layouts/AdminLayout";
import RankingsTable from "./blocks/RankingsTable";

export default function rankings() {
  return (
    <>
      <AdminLayout>
        <RankingsTable />
      </AdminLayout>
    </>
  );
}
