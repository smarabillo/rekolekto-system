import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Entry() {
  return (
    <section className="w-screen h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] h-full">
        {/* Left - Welcome */}
        <div className="flex flex-col justify-center items-center text-center px-6 py-10 md:py-0 gap-4">
          <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
            <img src="/logo-cstr.png" alt="" className="w-18 mb-2" />
            <img src="/logo-name.png" alt="" className="w-60" />
          </div>

          <div className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed space-y-8">
            <p>
              REKOLEKTO is a web-based recycling system designed for schools to
              promote proper waste disposal and reward students for
              participating. Instead of using dedicated hardware, the system
              operates entirely through any smartphone with a camera. Students
              access the web app, authenticate using their school ID
              credentials, and scan the barcodes of PET bottles or aluminum cans
              directly through their phone’s camera.
            </p>

            <p>
              Once an item is scanned, the system verifies the barcode,
              identifies the type of recyclable, and automatically credits the
              appropriate number of points to the student’s online account. All
              processes—authentication, barcode recognition, point calculation,
              and database updates—run through the central web platform,
              allowing data to sync in real time.
            </p>

            <p>
              Because REKOLEKTO is built as a web application, development
              follows an iterative approach where features are repeatedly
              prototyped, tested, and refined. This includes improving the
              scanning workflow, enhancing accuracy of barcode validation,
              strengthening user authentication, and ensuring smooth
              communication with the backend. Testing in real school settings
              helps identify usability issues, collect student feedback, and
              refine the interface for a better experience.
            </p>
          </div>
        </div>

        {/* Right - Portal Selector */}
        <div className="bg-primary flex flex-col justify-center items-center gap-6 px-6 py-10 md:py-0">
          <h1 className="font-medium text-2xl md:text-3xl text-white mb-6">
            Choose a portal
          </h1>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Link to="/admin/login">
              <Button variant="secondary" className="w-full">
                Sign in as Admin
              </Button>
            </Link>

            <Link to="/student/login">
              <Button className="w-full bg-black text-white hover:bg-black/70">
                Sign in as Student
              </Button>
            </Link>
          </div>

          <span className="text-white text-xs md:text-sm font-light tracking-wide mt-4">
            2025 Developed by{" "}
            <a
              href="https://shemreimarabillo.xyz"
              target="_blank"
              className="underline"
            >
              Shemrei Marabillo
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
