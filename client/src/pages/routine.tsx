import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Check, 
  ChevronRight, 
  Pause, 
  Play, 
  X, 
  Clock,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  Star,
  Home
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Video IDs map
const STEP_VIDEOS: Record<string, string> = {
  step3: "dEsYUEG9yxA", // Relaxing water/music
  step5: "XgENmGTreU8", // Cool Down
};

// Component for Steps 1-4
const ActionStep = ({ stepKey, onNext }: { stepKey: string, onNext: () => void }) => {
  const { t } = useStore();
  // @ts-ignore - dynamic key access
  const stepData = t.steps[stepKey];
  const videoId = STEP_VIDEOS[stepKey];
  
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);

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
      {/* Embedded Video */}
      {videoId && (
        <div className="w-full aspect-video bg-black rounded-2xl mb-6 overflow-hidden shadow-md relative">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={stepData.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>
      )}
      
      <div className="space-y-4 flex-1">
        <h2 className="text-2xl font-heading font-bold text-primary" data-testid={`text-step-title-${stepKey}`}>
          {stepData.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-desc-${stepKey}`}>
          {stepData.description}
        </p>

        {/* Timer UI */}
        <div className="mt-4 p-4 bg-white/50 rounded-xl border border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Clock className="h-5 w-5 text-accent" />
             <span className="font-mono text-xl font-medium text-foreground" data-testid="text-timer">
               00:{timeLeft.toString().padStart(2, '0')}
             </span>
          </div>
          <Button 
            size="sm" 
            variant={isActive ? "outline" : "default"}
            onClick={toggleTimer}
            className={isActive ? "" : "bg-accent hover:bg-accent/90 text-white"}
            data-testid="button-timer-toggle"
          >
            {isActive ? t.pause : t.startRoutine}
          </Button>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button 
          onClick={onNext} 
          className="w-full h-12 text-lg rounded-xl shadow-md"
          data-testid="button-next-step"
        >
          {t.next} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Component for Step 5 (Feedback)
const FeedbackStep = () => {
  const { t, addHistory, userName } = useStore();
  const [, setLocation] = useLocation();
  const [feeling, setFeeling] = useState<any>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!feeling) return;
    addHistory({
      date: new Date().toISOString(),
      feeling,
      comment
    });
    setLocation("/history");
  };

  const feelings = [
    { value: 'veryBad', label: t.veryBad, icon: Frown, color: 'text-red-400' },
    { value: 'bad', label: t.bad, icon: Meh, color: 'text-orange-400' },
    { value: 'neutral', label: t.neutral, icon: Meh, color: 'text-yellow-400' },
    { value: 'good', label: t.good, icon: Smile, color: 'text-green-400' },
    { value: 'veryGood', label: t.veryGood, icon: Star, color: 'text-primary' },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
       <div className="text-center space-y-2">
         <h2 className="text-2xl font-heading font-bold text-foreground">
           {t.greatJob}{userName}!
         </h2>
         <p className="text-muted-foreground">{t.howDoYouFeel}</p>
       </div>

       <div className="grid grid-cols-5 gap-2">
         {feelings.map((f) => {
           const Icon = f.icon;
           const isSelected = feeling === f.value;
           return (
             <button
               key={f.value}
               onClick={() => setFeeling(f.value)}
               className={`
                 flex flex-col items-center justify-center p-2 rounded-xl transition-all gap-1
                 ${isSelected ? 'bg-primary/10 scale-110 ring-2 ring-primary' : 'hover:bg-secondary/50'}
               `}
               data-testid={`button-feeling-${f.value}`}
             >
               <Icon className={`h-8 w-8 ${isSelected ? f.color : 'text-muted-foreground'}`} />
             </button>
           )
         })}
       </div>
       
       <div className="text-center font-medium text-primary h-6">
         {feeling ? feelings.find(f => f.value === feeling)?.label : ''}
       </div>

       <div className="space-y-2">
         <Label htmlFor="comment">{t.optionalComment}</Label>
         <Textarea 
           id="comment" 
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           placeholder="..."
           className="bg-white/50 border-white/60 min-h-[100px]"
           data-testid="input-comment"
         />
       </div>

       <Button 
         onClick={handleSubmit} 
         disabled={!feeling}
         className="w-full h-12 mt-auto rounded-xl"
         data-testid="button-complete"
       >
         {t.complete}
       </Button>
    </div>
  );
};

export default function Routine() {
  const { t, currentStepIndex, nextStep, exitRoutine } = useStore();
  const [, setLocation] = useLocation();

  const handleExit = () => {
    if (confirm(t.exitConfirmMessage)) {
      exitRoutine();
      setLocation("/");
    }
  };

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
      <div className="flex items-center gap-4 py-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleHome} 
          className="shrink-0 text-muted-foreground hover:text-primary"
          data-testid="button-home"
        >
          <Home className="h-5 w-5" />
        </Button>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>{t.step} {currentStepIndex + 1}</span>
            <span>{t.of} 6</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="flex-1 glass-card border-white shadow-lg overflow-hidden flex flex-col">
        <CardContent className="flex-1 p-6 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
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
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
