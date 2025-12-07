import { useState, useEffect } from "react";
import { useStudent } from "@/hooks/use-student";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { Loader2 } from "lucide-react";

export default function StudentLogin() {
  const { loginStudent } = useStudent();
  const { login, token } = useStudentAuth();
  const [studentId, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/student/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleLogin = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginStudent({ studentId, password });
      toast.success("Login successful");
      login(result.student, result.token);
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex gap-2 items-center justify-start mb-6">
            <img src="/logo-cstr.png" alt="CSTR Logo" className="w-15" />
            <img
              src="/logo-badge.png"
              alt="Rekolekto Badge Logo"
              className="w-15 mt-2"
            />
          </div>
          <CardTitle className="text-2xl font-normal">Student Portal</CardTitle>
          <CardDescription>
            This is the student portal. Please enter your credentials to login.{" "}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Student ID"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm font-light underline-offset-4 hover:underline "
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <CardFooter className="mt-4 px-0">
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  );
}
