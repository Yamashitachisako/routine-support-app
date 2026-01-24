import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Calendar, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getRoutineRecords } from "@/lib/api";

export default function Home() {
  const { t, startRoutine, userName, setUserName } = useStore();
  const [, setLocation] = useLocation();

  const { data: history = [] } = useQuery({
    queryKey: ['routine-records'],
    queryFn: getRoutineRecords,
  });

  const handleStart = () => {
    if (!userName.trim()) return;
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
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white">
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

        <div className="w-full max-w-xs space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="username" className="pl-1 text-muted-foreground">{t.enterName}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="pl-9 h-12 rounded-xl bg-white/60 border-white focus:bg-white transition-all"
                data-testid="input-username"
              />
            </div>
          </div>

          <Button 
            onClick={handleStart} 
            disabled={!userName.trim()}
            size="lg" 
            className="rounded-full w-full h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
            data-testid="button-start-routine"
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            {t.startRoutine}
          </Button>
        </div>
      </section>

      {/* Progress Card */}
      <Card className="glass-card border-none shadow-sm mt-auto">
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
      
      {/* Quick Links */}
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
