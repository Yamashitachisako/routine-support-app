import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  ChevronLeft,
  Smile,
  Meh,
  Frown,
  Star,
  Home,
} from "lucide-react";
import { createRoutineRecord } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MiniGame from "@/components/mini-game";

const STEP_COUNTS: Record<string, number> = {
  morning: 9,
  eyeExercise: 9,
  stretching: 16,
};

const INTRO_COUNTS: Record<string, number> = {
  morning: 0,
  eyeExercise: 0,
  stretching: 0,
};

function getStepData(routineType: string, stepKey: string, t: any) {
  if (routineType === 'morning') {
    return t.morningSteps[stepKey];
  } else if (routineType === 'eyeExercise') {
    return t.eyeExerciseSteps[stepKey];
  } else {
    return t.stretchingSteps[stepKey];
  }
}

function getIntroData(introKey: string, t: any) {
  return t.morningIntroSteps[introKey];
}

function getRoutineLabel(routineType: string, t: any) {
  if (routineType === 'morning') return t.wipeDownRoutine;
  if (routineType === 'eyeExercise') return t.morningRoutine;
  return t.afternoonRoutine;
}

const IntroStep = ({ introKey, onNext, onBack, showBack }: { 
  introKey: string; 
  onNext: () => void; 
  onBack: () => void;
  showBack: boolean;
}) => {
  const { t } = useStore();
  const introData = getIntroData(introKey, t);

  if (!introData) return null;

  const introIndex = parseInt(introKey.replace('intro', ''));
  const imagePath = `/images/morning-intro${introIndex}.png`;

  return (
    <div className="flex flex-col h-full">
      <div className="w-full aspect-video bg-secondary/20 rounded-2xl mb-6 overflow-hidden shadow-sm relative flex items-center justify-center">
        <img 
          src={imagePath} 
          alt={introData.title}
          className="w-full h-full object-cover absolute inset-0 z-10"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-8xl font-bold text-primary/20">
            {introIndex}
          </div>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="inline-block px-3 py-1 bg-accent/20 rounded-full text-sm font-medium text-accent mb-2" data-testid="badge-preparation">
          {t.preparation}
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary" data-testid={`text-intro-title-${introKey}`}>
          {introData.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed" data-testid={`text-intro-desc-${introKey}`}>
          {introData.description}
        </p>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        {showBack && (
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex-1 h-16 text-xl rounded-xl shadow-md"
            data-testid="button-back-intro"
          >
            <ChevronLeft className="mr-2 h-6 w-6" />
            {t.back}
          </Button>
        )}
        <Button 
          onClick={onNext} 
          className="flex-1 h-16 text-xl rounded-xl shadow-md"
          data-testid="button-next-intro"
        >
          {t.next} <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

const ActionStep = ({ stepKey, onNext, onBack, routineType, showBack }: { 
  stepKey: string; 
  onNext: () => void; 
  onBack: () => void;
  routineType: string;
  showBack: boolean;
}) => {
  const { t } = useStore();
  const stepData = getStepData(routineType, stepKey, t);

  if (!stepData) return null;

  const imagePath = `/images/${routineType}-${stepKey}.png`;
  const isWipeDown = routineType === 'morning';

  return (
    <div className="flex flex-col h-full">
      <div className={`w-full bg-secondary/20 rounded-2xl mb-6 overflow-hidden shadow-sm relative flex items-center justify-center ${
        isWipeDown ? 'aspect-[4/3] max-w-[280px] mx-auto' : 'aspect-[3/4] max-w-[300px] mx-auto'
      }`}>
        <img 
          src={imagePath} 
          alt={stepData.title}
          className="w-full h-full object-contain absolute inset-0 z-10 p-2"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-8xl font-bold text-primary/20">
            {parseInt(stepKey.replace('step', ''))}
          </div>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary" data-testid={`text-step-title-${stepKey}`}>
          {stepData.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line" data-testid={`text-step-desc-${stepKey}`}>
          {stepData.description}
        </p>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        {showBack && (
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex-1 h-16 text-xl rounded-xl shadow-md"
            data-testid="button-back-step"
          >
            <ChevronLeft className="mr-2 h-6 w-6" />
            {t.back}
          </Button>
        )}
        <Button 
          onClick={onNext} 
          className="flex-1 h-16 text-xl rounded-xl shadow-md"
          data-testid="button-next-step"
        >
          {t.next} <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

const FeedbackStep = ({ onShowMiniGame }: { onShowMiniGame: () => void }) => {
  const { t, userName, routineType } = useStore();
  const queryClient = useQueryClient();
  const [feeling, setFeeling] = useState<any>(null);
  const [hasPressedFinish, setHasPressedFinish] = useState(false);

  const createRecordMutation = useMutation({
    mutationFn: createRoutineRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["routine-records"] });
    },
  });

  const handleSubmit = () => {
    if (hasPressedFinish) return;
    setHasPressedFinish(true);
    const submittedFeeling = feeling || "good";
    createRecordMutation.mutate({
      userName,
      feeling: submittedFeeling,
      routineType,
    });
    onShowMiniGame();
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
       <div className="text-center space-y-3">
         <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
           {t.greatJob}{userName}!
         </h2>
         <p className="text-lg text-muted-foreground">{t.howDoYouFeel}</p>
       </div>

       <div className="grid grid-cols-5 gap-3">
         {feelings.map((f) => {
           const Icon = f.icon;
           return (
             <button
               key={f.value}
               onClick={() => setFeeling(f.value)}
               className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                 feeling === f.value
                   ? 'bg-primary/10 ring-2 ring-primary shadow-md scale-105'
                   : 'bg-white/50 hover:bg-white/70'
               }`}
               data-testid={`button-feeling-${f.value}`}
             >
               <Icon className={`h-10 w-10 ${f.color}`} />
               <span className="text-sm font-medium text-muted-foreground">{f.label}</span>
             </button>
           );
         })}
       </div>

      <div className="mt-auto">
        <Button
          onClick={handleSubmit}
          disabled={hasPressedFinish}
          className="w-full h-16 text-xl rounded-xl shadow-md"
          data-testid="button-finish"
        >
          {t.finish} <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default function Routine() {
  const { t, currentStepIndex, nextStep, prevStep, exitRoutine, routineType, language } = useStore();
  const [, setLocation] = useLocation();
  const [showMiniGame, setShowMiniGame] = useState(false);

  const totalSteps = STEP_COUNTS[routineType] || 9;
  const introCount = INTRO_COUNTS[routineType] || 0;
  const totalWithIntro = introCount + totalSteps;

  const handleHome = () => {
    if (confirm(t.exitConfirmMessage)) {
       exitRoutine();
       setLocation("/");
    }
  }

  const handleShowMiniGame = () => {
    setShowMiniGame(true);
  };

  const handleCloseMiniGame = () => {
    setShowMiniGame(false);
    exitRoutine();
    setLocation("/");
  };

  const isIntroPhase = currentStepIndex < introCount;
  const introKey = `intro${currentStepIndex + 1}`;
  const actualStepIndex = currentStepIndex - introCount;
  const stepKey = `step${actualStepIndex + 1}`;
  const isFeedback = currentStepIndex >= totalWithIntro;
  const progress = ((currentStepIndex + 1) / (totalWithIntro + 1)) * 100;

  const routineLabel = getRoutineLabel(routineType, t);

  return (
    <>
      {showMiniGame && (
        <MiniGame
          routineType={routineType}
          onClose={handleCloseMiniGame}
          language={language}
        />
      )}

      <div className="flex flex-col h-full gap-4">
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
              <span>{routineLabel} - {isIntroPhase ? t.preparation : `${t.step} ${Math.min(actualStepIndex + 1, totalSteps)}`}</span>
              <span>{isIntroPhase ? `${currentStepIndex + 1} / ${introCount}` : `${t.of} ${totalSteps}`}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

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
                  <FeedbackStep onShowMiniGame={handleShowMiniGame} />
                ) : isIntroPhase ? (
                  <IntroStep
                    introKey={introKey}
                    onNext={nextStep}
                    onBack={prevStep}
                    showBack={currentStepIndex > 0}
                  />
                ) : (
                  <ActionStep 
                    stepKey={stepKey} 
                    onNext={nextStep}
                    onBack={prevStep}
                    routineType={routineType}
                    showBack={currentStepIndex > 0}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
