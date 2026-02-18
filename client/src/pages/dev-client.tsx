import { useEffect } from "react";
import { useLocation } from "wouter";

export default function DevClient() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-login for dev access
    localStorage.setItem("indexflow_session", JSON.stringify({
      email: "client@demo.com",
      workspaces: [
        { id: "venue-golden-fork", name: "Apex Digital Agency" },
        { id: "venue-skyline-bar", name: "Jake Morrison SEO" },
      ]
    }));
    
    setLocation("/venue-golden-fork/today");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to client dashboard...</p>
    </div>
  );
}
