import { useStudentAuth } from "../../contexts/StudentAuthContext";
import MyScans from "./Blocks/MyScans";
import Rankings from "./Blocks/Rankings";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { student } = useStudentAuth();
  const { logout } = useStudentAuth();

  return (
    <>
      <section className="w-full h-screen p-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-center justify-center h-full">
          {/* Dashboard Block */}
          <Card className="rounded-md h-full ">
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="leading-tight">
                  <h1 className="text-2xl ">
                    {student?.firstName} {student?.lastName}
                  </h1>
                  <p className="text-gray-600">
                    Grade: {student?.grade} - {student?.section}
                  </p>
                </div>

                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center">
                <h2 className="text-xl mb-2">Your Dashboard</h2>
                <p className="text-center text-gray-600">
                  Here you can view your points, recent scans, and rankings. Use
                  the navigation to explore more features.
                </p>
              </div>
            </div>
          </Card>

          {/* Right Side Block */}
          <div className="grid grid-cols-1 gap-4 h-full">
            <Rankings />
            <MyScans />
          </div>
        </div>
      </section>
    </>
  );
}
