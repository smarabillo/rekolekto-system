import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
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
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const { loginAdmin } = useAdmin();
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginAdmin({ userName, password });
      console.log("Logged in:", result.admin);
      toast.success("Login successful");
      login(result.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome Back Admin</CardTitle>
          <CardDescription>
            Enter your username and password to access the admin panel.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="admin123"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
