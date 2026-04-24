import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Play, Calendar, ChevronRight, User, Sparkles, Eye, Activity, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getRoutineRecords } from "@/lib/api";
import type { RoutineType } from "@/lib/store";

export default function Home() {
  const {
    t,
    startRoutine,
    userName,
    setUserName,
    routineType,
    setRoutineType,
    language,
    openOnboarding,
  } = useStore();
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

  const routineButtons: { type: RoutineType; label: string; icon: React.ReactNode }[] = [
    { type: 'morning', label: t.wipeDownRoutine, icon: <Sparkles className="h-6 w-6" /> },
    { type: 'eyeExercise', label: t.morningRoutine, icon: <Eye className="h-6 w-6" /> },
    { type: 'stretching', label: t.afternoonRoutine, icon: <Activity className="h-6 w-6" /> },
  ];

  return (
    <div className="flex flex-col gap-6 flex-1 h-full">
      <section className="flex-1 flex flex-col justify-center items-center text-center gap-8 py-6">
        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden shadow-2xl border-4 border-white">
           <img 
            src="/images/wellness-hero.png" 
            alt="Wellness" 
            className="w-full h-full object-cover"
          /> 
        </div>
        
        <div className="space-y-2 max-w-md">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground">
            {t.appTitle}
          </h2>
        </div>

        <div className="w-full max-w-md space-y-6">
          <Button
            type="button"
            variant="outline"
            className="h-14 w-full justify-center gap-2 rounded-xl text-base touch-manipulation"
            onClick={openOnboarding}
            data-testid="button-home-onboarding-guide"
          >
            <BookOpen className="h-5 w-5 shrink-0" aria-hidden />
            {language === "ja" ? "使い方ガイド" : "How to use"}
          </Button>

          <div className="space-y-3">
            <Label className="pl-1 text-muted-foreground text-lg">{t.selectRoutineType}</Label>
            <div className="grid grid-cols-3 gap-3">
              {routineButtons.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => setRoutineType(type)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-xl transition-all font-medium text-base ${
                    routineType === type
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white/60 text-foreground hover:bg-white/80 border border-white/60'
                  }`}
                  data-testid={`button-routine-type-${type}`}
                >
                  {icon}
                  <span className="text-sm leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-left">
            <Label htmlFor="username" className="pl-1 text-muted-foreground text-lg">{t.enterName}</Label>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input 
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="pl-12 h-14 text-lg rounded-xl bg-white/60 border-white focus:bg-white transition-all"
                data-testid="input-username"
              />
            </div>
          </div>

          <Button 
            onClick={handleStart} 
            disabled={!userName.trim()}
            size="lg" 
            className="rounded-full w-full h-16 text-xl font-medium shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
            data-testid="button-start-routine"
          >
            <Play className="mr-3 h-6 w-6 fill-current" />
            {t.startRoutine}
          </Button>
        </div>
      </section>

      <Card className="glass-card border-none shadow-sm">
        <CardContent className="p-6 md:p-8 flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-muted-foreground mb-1">{t.todayProgress}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary" data-testid="text-today-count">{todayCount}</span>
              <span className="text-base text-muted-foreground">{t.completedTimes}</span>
            </div>
          </div>
          
          <Link href="/history">
            <Button variant="outline" size="icon" className="rounded-full h-14 w-14 border-primary/20 text-primary hover:bg-primary/5" data-testid="link-history">
              <Calendar className="h-6 w-6" />
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Link href="/history">
         <div className="flex items-center justify-between p-5 rounded-xl bg-white/40 hover:bg-white/60 transition-colors cursor-pointer" data-testid="link-history-row">
            <span className="font-medium text-lg text-foreground flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              {t.history}
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
         </div>
      </Link>
    </div>
  );
}
