"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { loginSuccess } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, initialized, user } = useAppSelector((state: any) => state.auth);

  // 🔹 Redirect if already logged in
  useEffect(() => {
    if (!initialized) return; // wait for Redux hydration

    if (isAuthenticated) {
      // toast.warning("You are already logged in!");
      if (user?.role === "ADMIN") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [initialized, isAuthenticated, user, router]);

  // Email/Password login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/users/google", { email, password });
      if (res.data?.success) {
        
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

   // Google login
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    setLoading(true);

    try {
      const res = await api.post("/users/google", {
        idToken: credentialResponse.credential,
      });

      if (res.data?.success) {
        const { token, user } = res.data;

        // 🔹 persist in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // 🔹 update redux
        dispatch(
          loginSuccess({
            token,
            user,
          })
        );

        toast.success("Google login successful!");

        // 🔹 Redirect based on role
        setTimeout(() => {
          if (user.role === "ADMIN") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }, 500); // 0.5s is enough
      }
    } catch (error: any) {
      console.error("login error", error.response?.data || error);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
          <p className="text-sm text-muted-foreground mt-2">Login to your account</p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              className="pl-10 h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full h-12 mt-2" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed")} />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-primary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
