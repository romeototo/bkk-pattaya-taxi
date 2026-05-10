import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

const Legal = lazy(() => import("./pages/Legal"));

function AppRouter() {
  return (
    <Router base={import.meta.env.BASE_URL}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/legal"}>{() => <Suspense fallback={<div className="min-h-screen bg-background" />}><Legal /></Suspense>}</Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
