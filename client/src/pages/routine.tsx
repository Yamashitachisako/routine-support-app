import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  Clock,
  Smile,
  Meh,
  Frown,
  Star,
  Home,
  DoorOpen
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRoutineRecord } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import MiniGame from "@/components/mini-game";

// Video IDs map - only for afternoon routine
const AFTERNOON_STEP_VIDEOS: Record<string, string> = {
  step3: "dEsYUEG9yxA",
  step5: "XgENmGTreU8",
};

// Image paths for afternoon routine
const AFTERNOON_STEP_IMAGES: Record<string, string> = {
  step1: "/images/step1-wash.png",
  step2: "/images/step2-eye.png",
  step3: "/images/step3-water.png",
  step4: "/images/step4-stretch.png",
};

// Image paths for morning routine
const MORNING_STEP_IMAGES: Record<string, string> = {
  step1: "/images/morning-wakeup.png",
  step2: "/images/morning-wash.png",
  step3: "/images/morning-breakfast.png",
  step4: "/images/morning-dress.png",
  step5: "/images/morning-bag.png",
};

// Component for Action Steps
const ActionStep = ({ stepKey, onNext, routineType }: { stepKey: string, onNext: () => void, routineType: 'morning' | 'afternoon' }) => {
  const { t } = useStore();
  
  const steps = routineType === 'morning' ? t.morningSteps : t.afternoonSteps;
  // @ts-ignore - dynamic key access
  const stepData = steps[stepKey];
  
  const videoId = routineType === 'afternoon' ? AFTERNOON_STEP_VIDEOS[stepKey] : undefined;
  const imagePath = routineType === 'morning' ? MORNING_STEP_IMAGES[stepKey] : AFTERNOON_STEP_IMAGES[stepKey];
  
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setTimeLeft(20);
    setIsActive(false);
  }, [stepKey]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  return (
    <div className="flex flex-col h-full">
      {/* Visual Content: Video or Image */}
      <div className="w-full aspect-video bg-secondary/20 rounded-2xl mb-6 overflow-hidden shadow-sm relative flex items-center justify-center">
        {videoId ? (
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={stepData.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        ) : imagePath ? (
           <img 
             src={imagePath} 
             alt={stepData.title}
             className="w-full h-full object-cover"
             onError={(e) => {
               e.currentTarget.style.display = 'none';
             }}
           />
        ) : null}
        {!videoId && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="text-8xl font-bold text-primary/20">
              {parseInt(stepKey.replace('step', ''))}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4 flex-1">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary" data-testid={`text-step-title-${stepKey}`}>
          {stepData.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed" data-testid={`text-step-desc-${stepKey}`}>
          {stepData.description}
        </p>

        {/* Timer UI */}
        <div className="mt-4 p-5 bg-white/50 rounded-xl border border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Clock className="h-6 w-6 text-accent" />
             <span className="font-mono text-2xl font-medium text-foreground" data-testid="text-timer">
               00:{timeLeft.toString().padStart(2, '0')}
             </span>
          </div>
          <Button 
            size="lg" 
            variant={isActive ? "outline" : "default"}
            onClick={toggleTimer}
            className={`h-12 px-6 text-base ${isActive ? "" : "bg-accent hover:bg-accent/90 text-white"}`}
            data-testid="button-timer-toggle"
          >
            {isActive ? t.pause : t.startRoutine}
          </Button>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button 
          onClick={onNext} 
          className="w-full h-16 text-xl rounded-xl shadow-md"
          data-testid="button-next-step"
        >
          {t.next} <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

// Component for Feedback Step
const FeedbackStep = () => {
  const { t, userName, exitRoutine, routineType, language } = useStore();
  const [, setLocation] = useLocation();
  const [feeling, setFeeling] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [showMiniGame, setShowMiniGame] = useState(false);

  const createRecordMutation = useMutation({
    mutationFn: createRoutineRecord,
    onSuccess: () => {
      setShowMiniGame(true);
    },
  });

  const handleSubmit = () => {
    const submittedFeeling = feeling || 'good';
    
    createRecordMutation.mutate({
      userName,
      feeling: submittedFeeling,
      comment: comment || undefined,
      routineType,
    });
  };

  const handleCloseMiniGame = () => {
    setShowMiniGame(false);
    exitRoutine();
    setLocation("/");
  };

  if (showMiniGame) {
    return <MiniGame onClose={handleCloseMiniGame} language={language} />;
  }

  const feelings = [
    { value: 'veryBad', label: t.veryBad, icon: Frown, color: 'text-red-400' },
    { value: 'bad', label: t.bad, icon: Meh, color: 'text-orange-400' },
    { value: 'neutral', label: t.neutral, icon: Meh, color: 'text-yellow-400' },
    { value: 'good', label: t.good, icon: Smile, color: 'text-green-400' },
    { value: 'veryGood', label: t.veryGood, icon: Star, color: 'text-primary' },
  ];

  const finishLabel = routineType === 'morning' ? t.leaveHome : t.complete;

  return (
    <div className="flex flex-col h-full gap-6">
       <div className="text-center space-y-3">
         <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
           {t.greatJob}{userName}!
         </h2>
         <p className="text-lg text-muted-foreground">{t.howDoYouFeel}</p>
       </div>

       <div className="grid grid-cols-5 gap-3">
         {feelings.map((f) => {
           const Icon = f.icon;
           const isSelected = feeling === f.value;
           return (
             <button
               key={f.value}
               onClick={() => setFeeling(f.value)}
               className={`
                 flex flex-col items-center justify-center p-4 rounded-xl transition-all gap-2
                 ${isSelected ? 'bg-primary/10 scale-110 ring-2 ring-primary' : 'hover:bg-secondary/50'}
               `}
               data-testid={`button-feeling-${f.value}`}
             >
               <Icon className={`h-10 w-10 md:h-12 md:w-12 ${isSelected ? f.color : 'text-muted-foreground'}`} />
             </button>
           )
         })}
       </div>
       
       <div className="text-center font-medium text-primary text-lg h-7">
         {feeling ? feelings.find(f => f.value === feeling)?.label : ''}
       </div>

       <div className="space-y-3">
         <Label htmlFor="comment" className="text-lg">{t.optionalComment}</Label>
         <Textarea 
           id="comment" 
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           placeholder="..."
           className="bg-white/50 border-white/60 min-h-[120px] text-lg"
           data-testid="input-comment"
         />
       </div>

       <Button 
         onClick={handleSubmit} 
         disabled={createRecordMutation.isPending}
         className="w-full h-16 mt-auto rounded-xl text-xl"
         data-testid="button-complete"
       >
         {routineType === 'morning' && <DoorOpen className="mr-2 h-6 w-6" />}
         {createRecordMutation.isPending ? t.loading : finishLabel}
       </Button>
    </div>
  );
};

export default function Routine() {
  const { t, currentStepIndex, nextStep, exitRoutine, routineType } = useStore();
  const [, setLocation] = useLocation();

  const handleHome = () => {
    if (confirm(t.exitConfirmMessage)) {
       exitRoutine();
       setLocation("/");
    }
  }

  const stepKey = `step${currentStepIndex + 1}`;
  const isFeedback = currentStepIndex === 5;

  const progress = ((currentStepIndex + 1) / 6) * 100;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Bar with Progress */}
      <div className="flex items-center gap-4 py-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleHome} 
          className="shrink-0 text-muted-foreground hover:text-primary h-12 w-12"
          data-testid="button-home"
        >
          <Home className="h-6 w-6" />
        </Button>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>{routineType === 'morning' ? t.morningRoutine : t.afternoonRoutine} - {t.step} {currentStepIndex + 1}</span>
            <span>{t.of} 6</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="flex-1 glass-card border-white shadow-lg overflow-hidden flex flex-col">
        <CardContent className="flex-1 p-6 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${routineType}-${currentStepIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {isFeedback ? (
                <FeedbackStep />
              ) : (
                <ActionStep 
                  stepKey={stepKey} 
                  onNext={nextStep}
                  routineType={routineType}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
