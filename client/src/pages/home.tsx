import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { t, startRoutine, history } = useStore();
  const [, setLocation] = useLocation();

  const handleStart = () => {
    startRoutine();
    setLocation("/routine");
  };

  const todayCount = history.filter(h => {
    const d = new Date(h.date);
    const today = new Date();
    return d.getDate() === today.getDate() && 
           d.getMonth() === today.getMonth() && 
           d.getFullYear() === today.getFullYear();
  }).length;

  return (
    <div className="flex flex-col gap-6 flex-1 h-full">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center gap-8 py-8">
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
           <img 
            src="/images/wellness-hero.png" 
            alt="Wellness" 
            className="w-full h-full object-cover"
          /> 
        </div>
        
        <div className="space-y-2 max-w-xs">
          <h2 className="text-3xl font-heading font-medium text-foreground">
            {t.appTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t.steps.step1.description.substring(0, 50)}...
          </p>
        </div>

        <Button 
          onClick={handleStart} 
          size="lg" 
          className="rounded-full w-full max-w-[200px] h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
          data-testid="button-start-routine"
        >
          <Play className="mr-2 h-5 w-5 fill-current" />
          {t.startRoutine}
        </Button>
      </section>

      {/* Progress Card */}
      <Card className="glass-card border-none shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{t.todayProgress}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary" data-testid="text-today-count">{todayCount}</span>
              <span className="text-sm text-muted-foreground">{t.completedTimes}</span>
            </div>
          </div>
          
          <Link href="/history">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-primary/20 text-primary hover:bg-primary/5" data-testid="link-history">
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      {/* Quick Links (Settings handled in header, but maybe history here implies more) */}
      <Link href="/history">
         <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-colors cursor-pointer" data-testid="link-history-row">
            <span className="font-medium text-foreground flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              {t.history}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
         </div>
      </Link>
    </div>
  );
}
