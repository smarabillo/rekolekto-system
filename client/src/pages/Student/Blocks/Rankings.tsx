import { Card } from "@/components/ui/card";
import { columns, type Payment } from "@/pages/Student/Rankings/columns";
import { DataTable } from "@/pages/Student/Rankings/data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default async function Rankings() {
  const data = await getData();

  return (
    <>
      <Card className="border rounded-md p-4">
        <DataTable columns={columns} data={data} />
      </Card>
    </>
  );
}
