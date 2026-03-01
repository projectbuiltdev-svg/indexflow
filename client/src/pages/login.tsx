import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LogIn, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import indexFlowLogo from "@assets/image_1771351451425.webp";

interface Workspace {
  id: string;
  name: string;
}

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = (() => {
    try {
      return localStorage.getItem("indexflow_session") === "active";
    } catch {
      return false;
    }
  })();

  const { data: workspaces = [] } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces"],
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (isLoggedIn && workspaces.length > 0) {
      const savedId = localStorage.getItem("indexflow_workspace_id");
      const targetId = savedId || workspaces[0]?.id;
      if (targetId) {
        navigate(`/${targetId}/today`);
      }
    }
  }, [isLoggedIn, workspaces, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      localStorage.setItem("indexflow_session", "active");
      localStorage.setItem("indexflow_email", email);

      const res = await fetch("/api/workspaces");
      const ws: Workspace[] = await res.json();

      if (ws.length > 0) {
        const savedId = localStorage.getItem("indexflow_workspace_id");
        const targetId = savedId || ws[0].id;
        navigate(`/${targetId}/today`);
      } else {
        navigate("/select-workspace");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <header className="w-full border-b border-border/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" data-testid="login-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <img src={indexFlowLogo} alt="indexFlow" className="h-7 w-auto" />
            <span className="font-semibold text-lg tracking-tight">indexFlow</span>
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
            View Pricing
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-login-title">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your dashboard
            </p>
          </div>

          <Card className="border-border/50 shadow-lg shadow-black/5">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-login">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@agency.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                      autoFocus
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                      data-testid="link-forgot-password"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      autoComplete="current-password"
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-login"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/pricing" className="text-primary hover:text-primary/80 font-medium transition-colors" data-testid="link-signup">
                Start free trial
              </Link>
            </p>
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="link-admin">
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground bg-white/50 dark:bg-gray-900/50">
        © {new Date().getFullYear()} indexFlow. All rights reserved.
      </footer>
    </div>
  );
}
