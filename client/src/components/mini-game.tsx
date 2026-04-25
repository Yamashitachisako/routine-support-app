import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { translations, type Language, type Translation } from "@/lib/translations";
import type { RoutineType } from "@/lib/store";

const REWARD_IDS = ["star", "balloon", "fruit", "fish", "present"] as const;
type RewardId = (typeof REWARD_IDS)[number];

const REWARD_EMOJI: Record<RewardId, string> = {
  star: "⭐",
  balloon: "🎈",
  fruit: "🍎",
  fish: "🐟",
  present: "🎁",
};

function rewardLabel(t: Translation, id: RewardId): string {
  const map: Record<RewardId, string> = {
    star: t.rewardStar,
    balloon: t.rewardBalloon,
    fruit: t.rewardFruit,
    fish: t.rewardFish,
    present: t.rewardPresent,
  };
  return map[id];
}

function pickRandomReward(): RewardId {
  return REWARD_IDS[Math.floor(Math.random() * REWARD_IDS.length)];
}

function resolveLang(language: Language): Language {
  if (language === "en" || language === "zh") return language;
  return "ja";
}

const CHEST_RING = [
  "ring-amber-400/80 border-amber-500/60 bg-amber-950/30",
  "ring-violet-400/80 border-violet-500/60 bg-violet-950/30",
  "ring-emerald-400/80 border-emerald-500/60 bg-emerald-950/30",
];

const STAR_COUNT = 6;
const BALLOON_COUNT = 6;
const BALLOON_POP_GOAL = 4;

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/3 text-2xl sm:text-3xl"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 300,
            y: 140 + Math.random() * 200,
            opacity: 0,
            scale: 1.3,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.6 + Math.random() * 0.7, ease: "easeOut" }}
        >
          {["⭐", "✨", "🎉", "🎊", "💫", "🌟", "👏", "💖"][i % 8]}
        </motion.span>
      ))}
    </div>
  );
}

function SuccessScreen({
  t,
  onClose,
  burst,
}: {
  t: Translation;
  onClose: () => void;
  burst: boolean;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative space-y-5"
    >
      <ConfettiBurst active={burst} />
      <motion.p
        className="text-3xl sm:text-5xl font-extrabold text-amber-100 drop-shadow-md"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {t.rewardYatta}
      </motion.p>
      <motion.div
        className="flex justify-center gap-2 text-5xl sm:text-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        aria-hidden
      >
        <span>👏</span>
        <span>⭐</span>
        <span>👏</span>
      </motion.div>
      <Button
        type="button"
        onClick={onClose}
        className="relative h-16 w-full rounded-xl text-lg sm:text-xl font-semibold bg-amber-400 text-amber-950 hover:bg-amber-300"
        data-testid="button-reward-home"
      >
        <Home className="mr-2 h-6 w-6" aria-hidden />
        {t.rewardBackToHome}
      </Button>
    </motion.div>
  );
}

function GameShell({
  gradientClass,
  children,
  ariaLabel,
}: {
  gradientClass: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-3 sm:p-4 touch-manipulation"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        className="w-full max-w-xl"
      >
        <Card
          className={`relative overflow-hidden border-none shadow-2xl bg-gradient-to-br ${gradientClass}`}
        >
          <CardContent className="relative space-y-5 p-5 sm:p-7 text-center text-white">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function MorningStarGame({ t, onClose }: { t: Translation; onClose: () => void }) {
  const [phase, setPhase] = useState<"guide" | "play" | "success">("guide");
  const [tapped, setTapped] = useState<Set<number>>(() => new Set());
  const [burst, setBurst] = useState(false);

  const tapStar = useCallback((id: number) => {
    setTapped((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      if (next.size >= STAR_COUNT) {
        window.setTimeout(() => {
          setBurst(true);
          setPhase("success");
          window.setTimeout(() => setBurst(false), 2200);
        }, 0);
      }
      return next;
    });
  }, []);

  const collected = tapped.size;
  const gradient = "from-sky-600 via-indigo-800 to-violet-950";

  return (
    <GameShell
      gradientClass={gradient}
      ariaLabel={phase === "guide" ? t.rewardGuideTitle : t.rewardPlayHeadingStars}
    >
      <AnimatePresence mode="wait">
        {phase === "guide" && (
          <motion.div
            key="g"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-sky-100">{t.rewardGuideTitle}</h2>
            <p className="rounded-2xl border border-white/25 bg-white/10 px-4 py-5 text-lg sm:text-2xl font-semibold leading-snug text-white">
              {t.rewardGuideTapStars}
            </p>
            <Button
              type="button"
              onClick={() => setPhase("play")}
              className="h-16 w-full rounded-xl text-lg sm:text-xl font-bold bg-amber-400 text-amber-950 hover:bg-amber-300"
              data-testid="button-reward-guide-start"
            >
              {t.rewardGuideStartButton}
            </Button>
          </motion.div>
        )}

        {phase === "play" && (
          <motion.div
            key="p"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-sky-100">{t.rewardPlayHeadingStars}</h3>
            <p className="text-base text-white/90">
              {collected} / {STAR_COUNT}
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {Array.from({ length: STAR_COUNT }, (_, id) => {
                const on = tapped.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => tapStar(id)}
                    disabled={on}
                    className={`flex h-28 w-[30%] min-w-[5.5rem] max-w-[7rem] items-center justify-center rounded-2xl border-4 text-5xl shadow-lg transition-transform active:scale-95 touch-manipulation ${
                      on
                        ? "border-emerald-400/60 bg-emerald-900/40 opacity-60"
                        : "border-amber-300/70 bg-white/15 ring-2 ring-amber-200/40"
                    }`}
                    data-testid={`button-star-${id}`}
                  >
                    {on ? "✨" : "⭐"}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "success" && <SuccessScreen t={t} onClose={onClose} burst={burst} />}
      </AnimatePresence>
    </GameShell>
  );
}

function EyeBalloonGame({ t, onClose }: { t: Translation; onClose: () => void }) {
  const [phase, setPhase] = useState<"guide" | "play" | "success">("guide");
  const [popped, setPopped] = useState<Set<number>>(() => new Set());
  const [burst, setBurst] = useState(false);

  const pop = useCallback(
    (id: number) => {
      setPopped((prev) => {
        if (phase !== "play" || prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        if (next.size >= BALLOON_POP_GOAL) {
          window.setTimeout(() => {
            setBurst(true);
            setPhase("success");
            window.setTimeout(() => setBurst(false), 2200);
          }, 0);
        }
        return next;
      });
    },
    [phase]
  );

  const gradient = "from-pink-500 via-fuchsia-700 to-purple-950";

  return (
    <GameShell
      gradientClass={gradient}
      ariaLabel={phase === "guide" ? t.rewardGuideTitle : t.rewardPlayHeadingBalloons}
    >
      <AnimatePresence mode="wait">
        {phase === "guide" && (
          <motion.div
            key="g"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-100">{t.rewardGuideTitle}</h2>
            <p className="rounded-2xl border border-white/25 bg-white/10 px-4 py-5 text-lg sm:text-2xl font-semibold leading-snug text-white">
              {t.rewardGuidePopBalloons}
            </p>
            <Button
              type="button"
              onClick={() => setPhase("play")}
              className="h-16 w-full rounded-xl text-lg sm:text-xl font-bold bg-amber-400 text-amber-950 hover:bg-amber-300"
              data-testid="button-reward-guide-start"
            >
              {t.rewardGuideStartButton}
            </Button>
          </motion.div>
        )}

        {phase === "play" && (
          <motion.div
            key="p"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-pink-100">{t.rewardPlayHeadingBalloons}</h3>
            <p className="text-base text-white/90">
              {popped.size} / {BALLOON_POP_GOAL}
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-4">
              {Array.from({ length: BALLOON_COUNT }, (_, id) => {
                const isPopped = popped.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pop(id)}
                    disabled={isPopped}
                    className={`flex min-h-[6.5rem] sm:min-h-[7.5rem] items-center justify-center rounded-2xl border-4 text-5xl sm:text-6xl shadow-lg transition-transform active:scale-95 touch-manipulation ${
                      isPopped
                        ? "border-white/20 bg-black/20 opacity-70"
                        : "border-pink-200/60 bg-white/15 ring-2 ring-pink-200/50"
                    }`}
                    data-testid={`button-balloon-${id}`}
                  >
                    {isPopped ? "💥" : "🎈"}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "success" && <SuccessScreen t={t} onClose={onClose} burst={burst} />}
      </AnimatePresence>
    </GameShell>
  );
}

function StretchChestGame({ t, onClose }: { t: Translation; onClose: () => void }) {
  const [phase, setPhase] = useState<"guide" | "pick" | "reward">("guide");
  const [rewardId, setRewardId] = useState<RewardId | null>(null);
  const [showBurst, setShowBurst] = useState(false);

  const handleChestTap = useCallback(
    (_idx: number) => {
      if (phase !== "pick") return;
      setRewardId(pickRandomReward());
      setShowBurst(true);
      setPhase("reward");
      window.setTimeout(() => setShowBurst(false), 2400);
    },
    [phase]
  );

  const emoji = rewardId ? REWARD_EMOJI[rewardId] : "";
  const label = rewardId ? rewardLabel(t, rewardId) : "";
  const gradient = "from-amber-900 via-amber-950 to-slate-900";

  return (
    <GameShell
      gradientClass={gradient}
      ariaLabel={phase === "guide" ? t.rewardGuideTitle : t.rewardGameTitle}
    >
      <ConfettiBurst active={showBurst} />

      <AnimatePresence mode="wait">
        {phase === "guide" && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-amber-100">{t.rewardGuideTitle}</h2>
            <p className="rounded-2xl border border-amber-400/35 bg-white/10 px-4 py-6 text-center text-lg sm:text-2xl font-semibold leading-relaxed text-amber-50">
              {t.rewardGuidePickChest}
            </p>
            <Button
              type="button"
              onClick={() => setPhase("pick")}
              className="h-16 w-full rounded-xl text-lg sm:text-xl font-semibold bg-amber-400 text-amber-950 hover:bg-amber-300"
              data-testid="button-reward-guide-start"
            >
              {t.rewardGuideStartButton}
            </Button>
          </motion.div>
        )}

        {phase === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="space-y-1 text-center">
              <h2
                id="reward-game-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-100"
              >
                {t.rewardGameTitle}
              </h2>
              <p className="text-base sm:text-lg text-amber-100/85">{t.rewardGameSubtitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChestTap(i)}
                  className={[
                    "flex min-h-[9rem] sm:min-h-[11rem] md:min-h-[12rem] flex-col items-center justify-center rounded-2xl border-4 bg-gradient-to-b p-3 sm:p-4 shadow-lg ring-4 transition-transform active:scale-95",
                    "touch-manipulation select-none",
                    CHEST_RING[i],
                  ].join(" ")}
                  data-testid={`button-chest-${i}`}
                  aria-label={`Chest ${i + 1}`}
                >
                  <span className="text-6xl sm:text-7xl drop-shadow-md" aria-hidden>
                    📦
                  </span>
                  <span className="mt-2 text-xs sm:text-sm font-semibold text-amber-50/90">{i + 1}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "reward" && rewardId !== null && (
          <motion.div
            key="reward"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            <motion.p
              className="text-3xl sm:text-5xl font-extrabold text-amber-200 drop-shadow-sm"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.12, 1], opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              {t.rewardYatta}
            </motion.p>

            <motion.div
              className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border-2 border-amber-300/50 bg-white/10 px-6 py-6 backdrop-blur-sm"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08 }}
            >
              <span className="text-7xl sm:text-8xl leading-none drop-shadow-lg" aria-hidden>
                {emoji}
              </span>
              <p className="text-lg sm:text-xl font-semibold text-amber-50">{label}</p>
            </motion.div>

            <Button
              type="button"
              onClick={onClose}
              className="h-16 w-full rounded-xl text-lg font-semibold bg-amber-400 text-amber-950 hover:bg-amber-300"
              data-testid="button-reward-home"
            >
              <Home className="mr-2 h-6 w-6" aria-hidden />
              {t.rewardBackToHome}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}

interface MiniGameProps {
  routineType: RoutineType;
  onClose: () => void;
  language: Language;
}

export default function MiniGame({ routineType, onClose, language }: MiniGameProps) {
  const lang = resolveLang(language);
  const t = translations[lang];

  if (routineType === "morning") {
    return <MorningStarGame t={t} onClose={onClose} />;
  }
  if (routineType === "eyeExercise") {
    return <EyeBalloonGame t={t} onClose={onClose} />;
  }
  return <StretchChestGame t={t} onClose={onClose} />;
}
