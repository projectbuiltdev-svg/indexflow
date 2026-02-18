import { useLocation } from "wouter";
import { useEffect } from "react";

export default function DevAdmin() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    localStorage.setItem("indexflow_admin_session", JSON.stringify({ role: "super_admin", email: "admin@indexflow.io" }));
    setLocation("/admin");
  }, [setLocation]);
  return <div className="flex items-center justify-center min-h-screen"><div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" /></div>;
}
