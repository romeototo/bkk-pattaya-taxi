import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [, navigate] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const verifySession = trpc.admin.verifySession.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (verifySession.isLoading) return;

    if (verifySession.data?.authenticated) {
      setHasSession(true);
      setIsChecking(false);
      return;
    }

    setHasSession(false);
    setIsChecking(false);
    navigate("/admin/login");
  }, [navigate, verifySession.data?.authenticated, verifySession.isLoading]);

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
