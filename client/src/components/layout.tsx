import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Settings, ArrowLeft, Cog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, isRoutineActive } = useStore();
  const [location] = useLocation();

  const isHome = location === "/";
  const isAdmin = location.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden relative">
      {/* Decorative Background Blobs */}
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center glass-card border-b-0 rounded-none bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {!isHome && !isRoutineActive && (
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 h-12 w-12" data-testid="button-back">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-primary" data-testid="text-app-title">
            {t.appTitle}
          </h1>
        </div>

        {!isRoutineActive && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isAdmin && (
              <Link href="/admin/routines">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-1.5 rounded-full bg-white/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-2.5 sm:px-3.5"
                  data-testid="button-admin-mode"
                  aria-label={t.adminTitle}
                  title={t.adminTitle}
                >
                  <Cog className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                  <span className="hidden sm:inline text-sm font-medium">
                    {t.adminShort}
                  </span>
                </Button>
              </Link>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-12 w-12" data-testid="button-settings">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="pt-24 px-4 pb-8 max-w-2xl mx-auto min-h-screen flex flex-col relative z-10">
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
