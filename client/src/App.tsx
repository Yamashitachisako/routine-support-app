import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import OnboardingGuide from "@/components/onboarding-guide";
import { useStore } from "@/lib/store";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Routine from "@/pages/routine";
import Settings from "@/pages/settings";
import History from "@/pages/history";
import AdminRoutines from "@/pages/admin/routines";
import AdminRoutineForm from "@/pages/admin/routine-form";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/routine" component={Routine} />
        <Route path="/settings" component={Settings} />
        <Route path="/history" component={History} />
        <Route path="/admin/routines" component={AdminRoutines} />
        <Route path="/admin/routines/new" component={AdminRoutineForm} />
        <Route path="/admin/routines/:id" component={AdminRoutineForm} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const {
    language,
    setLanguage,
    isOnboardingOpen,
    hasSeenOnboarding,
    openOnboarding,
    closeOnboarding,
  } = useStore();

  // 初回のみ自動表示。一度閉じたら再度自動では開かない (設定画面・ホームのボタンから手動再表示は可)
  useEffect(() => {
    if (!hasSeenOnboarding) {
      openOnboarding();
    }
  }, [hasSeenOnboarding, openOnboarding]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <OnboardingGuide
          isOpen={isOnboardingOpen}
          language={language}
          onLanguageChange={setLanguage}
          onClose={closeOnboarding}
        />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
