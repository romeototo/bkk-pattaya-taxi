import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [, navigate] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Add a small delay to allow cookie to be set after redirect
    const timer = setTimeout(() => {
      // Check if admin_session cookie exists
      const adminSession = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_session="));

      if (adminSession) {
        setHasSession(true);
      } else {
        // Redirect to login if no session
        navigate("/admin/login");
      }
      setIsChecking(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return null;
  }

  return <>{children}</>;
}
