import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { translations, type Language, type Translation } from "@/lib/translations";

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

const CHEST_RING = [
  "ring-amber-400/80 border-amber-500/60 bg-amber-950/30",
  "ring-violet-400/80 border-violet-500/60 bg-violet-950/30",
  "ring-emerald-400/80 border-emerald-500/60 bg-emerald-950/30",
];

interface MiniGameProps {
  onClose: () => void;
  language: Language;
}

export default function MiniGame({ onClose, language }: MiniGameProps) {
  const lang: Language =
    language === "en" ? "en" : language === "zh" ? "zh" : "ja";
  const t = translations[lang];

  const [phase, setPhase] = useState<"guide" | "pick" | "reward">("guide");
  const [rewardId, setRewardId] = useState<RewardId | null>(null);
  const [showBurst, setShowBurst] = useState(false);

  const handleChestTap = useCallback(
    (_chestIndex: number) => {
      if (phase !== "pick") return;
      const id = pickRandomReward();
      setRewardId(id);
      setShowBurst(true);
      setPhase("reward");
      window.setTimeout(() => setShowBurst(false), 2400);
    },
    [phase]
  );

  const emoji = rewardId ? REWARD_EMOJI[rewardId] : "";
  const label = rewardId ? rewardLabel(t, rewardId) : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-3 sm:p-4 touch-manipulation"
      role="dialog"
      aria-modal="true"
      aria-label={phase === "guide" ? t.rewardGuideTitle : t.rewardGameTitle}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        className="w-full max-w-xl"
      >
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-900 via-amber-950 to-slate-900 shadow-2xl">
          <CardContent className="relative space-y-5 p-5 sm:p-7 text-center text-white">
            {showBurst && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/3 text-2xl sm:text-3xl"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 0.6,
                      rotate: 0,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 280,
                      y: 120 + Math.random() * 180,
                      opacity: 0,
                      scale: 1.2,
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 1.8 + Math.random() * 0.6, ease: "easeOut" }}
                  >
                    {["⭐", "✨", "🎉", "🎊", "💫", "🌟"][i % 6]}
                  </motion.span>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {phase === "guide" && (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5 text-left"
                >
                  <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-amber-100">
                    {t.rewardGuideTitle}
                  </h2>
                  <ul className="space-y-3 rounded-2xl border border-amber-400/30 bg-white/10 px-4 py-4 text-base sm:text-lg leading-relaxed text-amber-50">
                    <li className="flex gap-2">
                      <span aria-hidden>1.</span>
                      <span>{t.rewardGuideLine1}</span>
                    </li>
                    <li className="flex gap-2">
                      <span aria-hidden>2.</span>
                      <span>{t.rewardGuideLine2}</span>
                    </li>
                    <li className="flex gap-2">
                      <span aria-hidden>3.</span>
                      <span>{t.rewardGuideLine3}</span>
                    </li>
                  </ul>
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
                  key="chests"
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
                      <span className="text-6xl sm:text-7xl md:text-7xl drop-shadow-md" aria-hidden>
                        📦
                      </span>
                      <span className="mt-2 text-xs sm:text-sm font-semibold text-amber-50/90">
                        {i + 1}
                      </span>
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
                    className="h-14 w-full rounded-xl text-lg font-semibold bg-amber-400 text-amber-950 hover:bg-amber-300"
                    data-testid="button-reward-home"
                  >
                    <Home className="mr-2 h-6 w-6" aria-hidden />
                    {t.rewardBackToHome}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
