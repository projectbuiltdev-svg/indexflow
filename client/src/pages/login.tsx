import { useState, useEffect } from "react";
import { ArrowLeft, LogIn, Eye, EyeOff } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import indexFlowLogo from "@assets/image_1771351451425.png";

export default function Login() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Client Login - indexFlow";
  }, []);

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem("indexflow_session", "active");
    } catch {}
    toast({
      title: "Signed in",
      description: "Redirecting to your dashboard...",
    });
    setTimeout(() => navigate("/select-workspace"), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost" className="gap-2" data-testid="button-back-home">
          <ArrowLeft className="w-4 h-4" />
          Homepage
        </Button>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={indexFlowLogo} alt="indexFlow" className="h-16" />
          </div>
          <CardTitle className="text-2xl">Client Login</CardTitle>
          <CardDescription>
            Sign in to manage your workspaces, content, and SEO tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            type="button"
            variant="outline"
            className="w-full gap-3"
            onClick={() => handleSignIn()}
            data-testid="button-google-login"
          >
            <SiGoogle className="w-4 h-4" />
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              variant="secondary"
              className="w-full gap-2" 
              data-testid="button-submit-login"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Forgotten password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
