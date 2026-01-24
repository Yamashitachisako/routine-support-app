import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Settings, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, isRoutineActive } = useStore();
  const [location] = useLocation();

  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden relative">
      {/* Decorative Background Blobs */}
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center glass-card border-b-0 rounded-none bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {!isHome && !isRoutineActive && (
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-xl md:text-2xl font-heading font-semibold text-primary" data-testid="text-app-title">
            {t.appTitle}
          </h1>
        </div>

        {!isRoutineActive && (
          <Link href="/settings">
            <Button variant="ghost" size="icon" data-testid="button-settings">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        )}
      </header>

      <main className="pt-24 px-4 pb-8 max-w-md mx-auto min-h-screen flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
