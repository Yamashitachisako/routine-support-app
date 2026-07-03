import { useEffect, useMemo, useRef, useState } from "react";
import { getRoutineSessionUserName } from "@/lib/routineSessionUser";
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
  Pause,
  Play,
} from "lucide-react";
import { appendRoutineLog, createRoutineRecord, getRoutineTasks } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MiniGame from "@/components/mini-game";
import { useCustomRoutine, pickI18nText } from "@/hooks/useCustomRoutines";
import type { CustomRoutineWithSteps, RewardGameType, RoutineTask } from "@shared/schema";
import type { RoutineType } from "@/lib/store";
import type { Language, Translation } from "@/lib/translations";

const INTRO_COUNTS: Record<RoutineType, number> = {
  morning: 0,
  eyeExercise: 0,
  stretching: 0,
};

function getYoutubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace(/^\//, "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    return null;
  }
  return null;
}

function pickSheetText(
  task: RoutineTask,
  field: "title" | "description",
  language: Language
): string {
  if (language === "en") {
    return field === "title" ? task.title_en : task.description_en;
  }
  return field === "title" ? task.title_ja : task.description_ja;
}

// ---------- 表示用に正規化したステップデータ ----------

type RenderableStep = {
  title: string;
  description: string;
  /** 画像が無い場合は null。番号オーバーレイにフォールバックする */
  imagePath: string | null;
  /** ふきそうじルーティンと同じ aspect ratio で表示するか */
  isWipeDownLike: boolean;
  minutes?: number;
  youtubeUrl?: string;
  emoji?: string;
};

// Google Sheets (routine_tasks) からステップを解決
function resolveSheetStep(
  tasks: RoutineTask[],
  index: number,
  language: Language
): RenderableStep | null {
  const task = tasks[index];
  if (!task) return null;

  return {
    title: pickSheetText(task, "title", language),
    description: pickSheetText(task, "description", language),
    imagePath: null,
    isWipeDownLike: false,
    minutes: task.minutes,
    youtubeUrl: task.youtubeUrl,
    emoji: task.emoji,
  };
}

// 追加ルーティン用: DB の I18n から見出し/説明を解決
function resolveCustomStep(
  routine: CustomRoutineWithSteps,
  index: number,
  language: "ja" | "en" | "zh"
): RenderableStep | null {
  const step = routine.steps[index];
  if (!step) return null;

  return {
    title: pickI18nText(step.titleI18n, language),
    description: pickI18nText(step.descriptionI18n, language),
    imagePath: step.imageUrl ?? null,
    isWipeDownLike: false,
  };
}

// 追加ルーティンのご褒美ゲーム種別を、既存 MiniGame の routineType にマップする
function rewardGameToRoutineType(rg: RewardGameType): RoutineType {
  if (rg === "balloon") return "eyeExercise";
  if (rg === "chest") return "stretching";
  return "morning";
}

function getStandardRoutineLabel(routineType: RoutineType, t: Translation) {
  if (routineType === "morning") return t.wipeDownRoutine;
  if (routineType === "eyeExercise") return t.morningRoutine;
  return t.afternoonRoutine;
}

// =====================================================================
// Step UI components
// =====================================================================

const IntroStep = ({
  introKey,
  onNext,
  onBack,
  showBack,
}: {
  introKey: string;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
}) => {
  const { t } = useStore();
  const introData = t.morningIntroSteps[introKey];

  if (!introData) return null;

  const introIndex = parseInt(introKey.replace("intro", ""));
  const imagePath = `/images/morning-intro${introIndex}.png`;

  return (
    <div className="flex flex-col h-full">
      <div className="w-full aspect-video bg-secondary/20 rounded-2xl mb-6 overflow-hidden shadow-sm relative flex items-center justify-center">
        <img
          src={imagePath}
          alt={introData.title}
          className="w-full h-full object-cover absolute inset-0 z-10"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-8xl font-bold text-primary/20">{introIndex}</div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div
          className="inline-block px-3 py-1 bg-accent/20 rounded-full text-sm font-medium text-accent mb-2"
          data-testid="badge-preparation"
        >
          {t.preparation}
        </div>
        <h2
          className="text-2xl md:text-3xl font-heading font-bold text-primary"
          data-testid={`text-intro-title-${introKey}`}
        >
          {introData.title}
        </h2>
        <p
          className="text-lg text-muted-foreground leading-relaxed"
          data-testid={`text-intro-desc-${introKey}`}
        >
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

// 標準・追加で共用する 1 ステップの表示
const ActionStep = ({
  step,
  stepNumber,
  onNext,
  onBack,
  showBack,
  onTaskComplete,
}: {
  step: RenderableStep;
  stepNumber: number;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
  onTaskComplete?: (detail: {
    durationSeconds: number;
    stepNumber: number;
    taskTitle: string;
  }) => void | Promise<void>;
}) => {
  const { t } = useStore();
  const totalSeconds = Math.max(0, (step.minutes ?? 0) * 60);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const startedAtRef = useRef(Date.now());
  const youtubeEmbedUrl = step.youtubeUrl ? getYoutubeEmbedUrl(step.youtubeUrl) : null;

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsPaused(false);
    startedAtRef.current = Date.now();
  }, [stepNumber, totalSeconds]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0 || totalSeconds === 0) return;
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isPaused, secondsLeft, totalSeconds]);

  const minutesDisplay = Math.floor(secondsLeft / 60);
  const secondsDisplay = String(secondsLeft % 60).padStart(2, "0");

  const handleNext = async () => {
    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    );
    if (onTaskComplete) {
      await onTaskComplete({
        durationSeconds,
        stepNumber,
        taskTitle: step.title,
      });
    }
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className={`w-full bg-secondary/20 rounded-2xl mb-6 overflow-hidden shadow-sm relative flex items-center justify-center ${
          step.isWipeDownLike
            ? "aspect-[4/3] max-w-[280px] mx-auto"
            : youtubeEmbedUrl
            ? "aspect-video max-w-[480px] mx-auto"
            : "aspect-[3/4] max-w-[300px] mx-auto"
        }`}
      >
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={step.title}
            className="w-full h-full absolute inset-0 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : step.imagePath ? (
          <img
            src={step.imagePath}
            alt={step.title}
            className="w-full h-full object-contain absolute inset-0 z-10 p-2"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        {!youtubeEmbedUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="text-8xl font-bold text-primary/20">
              {step.emoji || stepNumber}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1">
        {totalSeconds > 0 && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-primary/5 px-4 py-3">
            <div>
              <p className="text-sm text-muted-foreground">{t.timeRemaining}</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-timer">
                {minutesDisplay}
                {t.minutesShort} {secondsDisplay}
                {t.secondsShort}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0"
              onClick={() => setIsPaused((prev) => !prev)}
              data-testid="button-timer-pause"
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
          </div>
        )}

        <h2
          className="text-2xl md:text-3xl font-heading font-bold text-primary"
          data-testid={`text-step-title-${stepNumber}`}
        >
          {step.emoji ? `${step.emoji} ` : ""}
          {step.title}
        </h2>
        <p
          className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line"
          data-testid={`text-step-desc-${stepNumber}`}
        >
          {step.description}
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
          onClick={handleNext}
          className="flex-1 h-16 text-xl rounded-xl shadow-md"
          data-testid="button-next-step"
        >
          {t.next} <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

const FeedbackStep = ({
  onShowMiniGame,
  routineRecordType,
}: {
  /** ご褒美ゲーム起動。createRoutineRecord の結果 id を渡す (失敗時は null) */
  onShowMiniGame: (recordId: string | null) => void;
  /** routine_records.routineType に書き込む値。標準なら 'morning' 等、追加なら 'custom:<id>' */
  routineRecordType: string;
}) => {
  const { t } = useStore();
  const queryClient = useQueryClient();
  const [feeling, setFeeling] = useState<any>(null);
  const [hasPressedFinish, setHasPressedFinish] = useState(false);

  const createRecordMutation = useMutation({
    mutationFn: createRoutineRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["routine-records"] });
    },
  });

  const handleSubmit = async () => {
    if (hasPressedFinish) return;
    setHasPressedFinish(true);
    const submittedFeeling = feeling || "good";
    const logUserName = getRoutineSessionUserName();
    // ゲーム開始前に record の生成を待つ。失敗してもゲームには進めるよう null を渡す。
    let recordId: string | null = null;
    try {
      const created = await createRecordMutation.mutateAsync({
        userName: logUserName,
        feeling: submittedFeeling,
        routineType: routineRecordType,
      });
      recordId = created?.id ?? null;
    } catch (err) {
      console.warn("[routine] createRoutineRecord failed:", err);
    }
    onShowMiniGame(recordId);
  };

  const feelings = [
    { value: "veryBad", label: t.veryBad, icon: Frown, color: "text-red-400" },
    { value: "bad", label: t.bad, icon: Meh, color: "text-orange-400" },
    { value: "neutral", label: t.neutral, icon: Meh, color: "text-yellow-400" },
    { value: "good", label: t.good, icon: Smile, color: "text-green-400" },
    { value: "veryGood", label: t.veryGood, icon: Star, color: "text-primary" },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          {t.greatJob}
          {getRoutineSessionUserName()}!
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
                  ? "bg-primary/10 ring-2 ring-primary shadow-md scale-105"
                  : "bg-white/50 hover:bg-white/70"
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

// =====================================================================
// Main Routine page
// =====================================================================

export default function Routine() {
  const {
    t,
    language,
    currentStepIndex,
    nextStep,
    prevStep,
    exitRoutine,
    routineType,
    activeCustomRoutineId,
    setStandardStepCount,
  } = useStore();
  const [, setLocation] = useLocation();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [lastRecordId, setLastRecordId] = useState<string | null>(null);

  const isCustom = !!activeCustomRoutineId;
  const customQuery = useCustomRoutine(activeCustomRoutineId);
  const customRoutine = customQuery.data;

  const routineTasksQuery = useQuery({
    queryKey: ["routine-tasks"],
    queryFn: getRoutineTasks,
    enabled: !isCustom,
    staleTime: 5 * 60 * 1000,
  });
  const routineTasks = routineTasksQuery.data ?? [];

  useEffect(() => {
    if (isCustom) {
      setStandardStepCount(null);
      return;
    }
    if (routineTasks.length > 0) {
      setStandardStepCount(routineTasks.length);
    }
  }, [isCustom, routineTasks.length, setStandardStepCount]);

  // ステップ数とラベルは標準/追加で別解決
  const totalSteps = isCustom
    ? customRoutine?.steps.length ?? 0
    : routineTasks.length;
  const introCount = isCustom ? 0 : INTRO_COUNTS[routineType] ?? 0;
  const totalWithIntro = introCount + totalSteps;

  const routineLabel = isCustom
    ? pickI18nText(customRoutine?.titleI18n, language)
    : getStandardRoutineLabel(routineType, t);

  // 現在のステップを正規化
  const isIntroPhase = !isCustom && currentStepIndex < introCount;
  const introKey = `intro${currentStepIndex + 1}`;
  const actualStepIndex = currentStepIndex - introCount;
  const isFeedback = !isIntroPhase && actualStepIndex >= totalSteps;

  const renderStep: RenderableStep | null = useMemo(() => {
    if (isIntroPhase || isFeedback) return null;
    if (isCustom) {
      if (!customRoutine) return null;
      return resolveCustomStep(customRoutine, actualStepIndex, language);
    }
    return resolveSheetStep(routineTasks, actualStepIndex, language);
  }, [
    isCustom,
    customRoutine,
    actualStepIndex,
    routineTasks,
    language,
    isIntroPhase,
    isFeedback,
  ]);

  const progress = totalWithIntro > 0
    ? ((currentStepIndex + 1) / (totalWithIntro + 1)) * 100
    : 0;

  // 完了時に routine_records.routineType に書き込む値
  const routineRecordType = isCustom ? `custom:${activeCustomRoutineId}` : routineType;

  // ご褒美ゲームに渡す routineType (追加の場合は ご褒美ゲーム種別 から逆引き)
  const customRewardGameType: RewardGameType = isCustom
    ? ((customRoutine?.rewardGameType as RewardGameType) ?? "star")
    : "star";
  const miniGameRoutineType: RoutineType = isCustom
    ? rewardGameToRoutineType(customRewardGameType)
    : routineType;

  // game_scores.gameType に書き込む値 (標準は routineType から逆引き)
  const miniGameType: RewardGameType = isCustom
    ? customRewardGameType
    : routineType === "morning"
    ? "star"
    : routineType === "eyeExercise"
    ? "balloon"
    : "chest";

  const handleHome = () => {
    if (confirm(t.exitConfirmMessage)) {
      exitRoutine();
      setLocation("/");
    }
  };

  const activeUserName = getRoutineSessionUserName();

  const handleTaskComplete = async ({
    durationSeconds,
    stepNumber,
    taskTitle,
  }: {
    durationSeconds: number;
    stepNumber: number;
    taskTitle: string;
  }) => {
    const userName = getRoutineSessionUserName();
    console.log("append user_name:", userName);
    if (!userName) {
      console.warn("[routine] appendRoutineLog skipped: no session user name");
      return;
    }

    const step = isCustom
      ? stepNumber
      : routineTasks[stepNumber - 1]?.step ?? stepNumber;

    const payload = {
      userName,
      step,
      taskTitle,
      completed: true as const,
      durationSeconds,
    };

    try {
      await appendRoutineLog(payload);
      console.log("[routine] appendRoutineLog success:", payload);
    } catch (err) {
      console.warn("[routine] appendRoutineLog failed:", err);
    }
  };

  const handleShowMiniGame = (recordId: string | null) => {
    setLastRecordId(recordId);
    setShowMiniGame(true);
  };

  const handleCloseMiniGame = () => {
    setShowMiniGame(false);
    setLastRecordId(null);
    exitRoutine();
    setLocation("/");
  };

  // カスタムルーティン読み込み中
  if (isCustom && customQuery.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="text-lg">{t.loading}</p>
      </div>
    );
  }

  // 標準ルーティン (Google Sheets) 読み込み中
  if (!isCustom && routineTasksQuery.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="text-lg">{t.loading}</p>
      </div>
    );
  }

  // カスタムルーティンが見つからない / ロード失敗
  if (isCustom && (customQuery.isError || (!customQuery.isLoading && !customRoutine))) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <p className="text-lg">{t.adminLoadError}</p>
        <Button
          onClick={() => {
            exitRoutine();
            setLocation("/");
          }}
        >
          <Home className="mr-2 h-5 w-5" />
          {t.adminBackToApp}
        </Button>
      </div>
    );
  }

  return (
    <>
      {showMiniGame && (
        <MiniGame
          routineType={miniGameRoutineType}
          onClose={handleCloseMiniGame}
          language={language}
          scoreContext={{
            userName: activeUserName,
            recordRoutineType: routineRecordType,
            routineRecordId: lastRecordId,
            gameType: miniGameType,
          }}
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
              <span>
                {routineLabel} -{" "}
                {isIntroPhase
                  ? t.preparation
                  : `${t.step} ${Math.min(actualStepIndex + 1, totalSteps)}`}
              </span>
              <span>
                {isIntroPhase
                  ? `${currentStepIndex + 1} / ${introCount}`
                  : `${t.of} ${totalSteps}`}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <Card className="flex-1 glass-card border-white shadow-lg overflow-hidden flex flex-col">
          <CardContent className="flex-1 p-6 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${isCustom ? `custom-${activeCustomRoutineId}` : routineType}-${currentStepIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {isFeedback ? (
                  <FeedbackStep
                    onShowMiniGame={handleShowMiniGame}
                    routineRecordType={routineRecordType}
                  />
                ) : isIntroPhase ? (
                  <IntroStep
                    introKey={introKey}
                    onNext={nextStep}
                    onBack={prevStep}
                    showBack={currentStepIndex > 0}
                  />
                ) : renderStep ? (
                  <ActionStep
                    step={renderStep}
                    stepNumber={actualStepIndex + 1}
                    onNext={nextStep}
                    onBack={prevStep}
                    showBack={currentStepIndex > 0}
                    onTaskComplete={handleTaskComplete}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
