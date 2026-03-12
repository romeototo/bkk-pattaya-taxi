import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboardPro from "./pages/AdminDashboardPro";
import AdminLogin from "./pages/AdminLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { TrackBooking } from "./pages/TrackBooking";
function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/track"} component={TrackBooking} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={() => (
        <ProtectedAdminRoute>
          <AdminDashboardPro />
        </ProtectedAdminRoute>
      )} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
