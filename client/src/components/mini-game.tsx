import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Gift, Sparkles, Heart, Trophy, Home } from "lucide-react";

const SYMBOLS = ['🌟', '🎉', '🌈', '🎁', '💎', '🍀'];
const WINNING_MESSAGES_JA = [
  '大当たり！素晴らしい！',
  'おめでとう！ラッキー！',
  'すごい！最高！',
];
const TRY_AGAIN_JA = 'もう一回！';
const SPIN_JA = 'スピン！';
const CLOSE_JA = '閉じる';

interface MiniGameProps {
  onClose: () => void;
  language: string;
}

export default function MiniGame({ onClose, language }: MiniGameProps) {
  const [slots, setSlots] = useState(['🌟', '🌟', '🌟']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);

  const getTranslation = () => {
    switch (language) {
      case 'ja':
        return {
          spin: SPIN_JA,
          close: CLOSE_JA,
          winMessages: WINNING_MESSAGES_JA,
          tryAgain: TRY_AGAIN_JA,
          title: 'ご褒美ゲーム',
          spinsLeft: '残り回数',
          greatJob: 'ルーティン完了！',
          howToPlay: 'スピンボタンを押して、3つ同じ絵柄が揃ったら大当たり！',
          backToHome: 'ホームに戻る',
        };
      case 'zh':
        return {
          spin: '转动！',
          close: '关闭',
          winMessages: ['大奖！太棒了！', '恭喜！好运！', '厉害！最棒！'],
          tryAgain: '再试一次！',
          title: '奖励游戏',
          spinsLeft: '剩余次数',
          greatJob: '日常完成！',
          howToPlay: '按下转动按钮，如果三个图案一样就中大奖！',
          backToHome: '返回主页',
        };
      default:
        return {
          spin: 'Spin!',
          close: 'Close',
          winMessages: ['Jackpot! Amazing!', 'Congratulations! Lucky!', 'Wow! Fantastic!'],
          tryAgain: 'Try again!',
          title: 'Reward Game',
          spinsLeft: 'Spins left',
          greatJob: 'Routine Complete!',
          howToPlay: 'Press Spin! Match 3 symbols to win!',
          backToHome: 'Back to Home',
        };
    }
  };

  const t = getTranslation();

  const spin = () => {
    if (isSpinning || spinsLeft <= 0) return;
    
    setIsSpinning(true);
    setHasWon(false);
    setSpinsLeft(s => s - 1);

    // Animate spinning
    let spins = 0;
    const spinInterval = setInterval(() => {
      setSlots([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      spins++;
      
      if (spins >= 15) {
        clearInterval(spinInterval);
        
        // Final result - higher chance of winning
        const isWin = Math.random() < 0.4; // 40% chance to win
        if (isWin) {
          const winSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          setSlots([winSymbol, winSymbol, winSymbol]);
          setHasWon(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          // Make sure not all same
          let finalSlots = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          ];
          if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
            finalSlots[2] = SYMBOLS[(SYMBOLS.indexOf(finalSlots[2]) + 1) % SYMBOLS.length];
          }
          setSlots(finalSlots);
        }
        
        setIsSpinning(false);
      }
    }, 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
      >
        <Card className="w-full max-w-md bg-gradient-to-br from-purple-500 to-pink-500 border-none shadow-2xl">
          <CardContent className="p-6 text-center text-white">
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: -20, 
                      x: Math.random() * 300 - 150,
                      rotate: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      y: 400, 
                      rotate: 360,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 2 + Math.random(),
                      delay: Math.random() * 0.5
                    }}
                    className="absolute text-2xl"
                    style={{ left: '50%' }}
                  >
                    {['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-yellow-300" />
              <h2 className="text-xl font-bold">{t.title}</h2>
              <Trophy className="h-6 w-6 text-yellow-300" />
            </div>

            <p className="text-white/90 mb-3 text-lg font-medium">{t.greatJob}</p>
            
            {/* Big visual instructions */}
            <div className="text-yellow-200 mb-5 text-xl font-bold bg-white/20 rounded-xl p-4 border-2 border-yellow-300/50">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">👆</span>
                <span>↓</span>
              </div>
              <p className="mb-2">💡 {t.howToPlay}</p>
              <div className="flex justify-center gap-2 text-2xl">
                <span>🌟</span><span>🌟</span><span>🌟</span>
                <span className="text-white">=</span>
                <span>🎉</span>
              </div>
            </div>

            {/* Slot Machine */}
            <div className="bg-white/20 rounded-2xl p-4 mb-4 backdrop-blur-sm">
              <div className="flex justify-center gap-3 mb-4">
                {slots.map((symbol, i) => (
                  <motion.div
                    key={i}
                    animate={isSpinning ? { y: [0, -10, 0] } : {}}
                    transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl flex items-center justify-center text-5xl md:text-6xl shadow-inner"
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>

              {/* Result Message */}
              <AnimatePresence>
                {hasWon && !isSpinning && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-yellow-300 font-bold text-lg mb-2"
                  >
                    🎉 {t.winMessages[Math.floor(Math.random() * t.winMessages.length)]} 🎉
                  </motion.div>
                )}
                {!hasWon && !isSpinning && spinsLeft < 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/70 text-sm mb-2"
                  >
                    {t.tryAgain}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-white/60 text-sm">
                {t.spinsLeft}: {spinsLeft}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={spin}
                disabled={isSpinning || spinsLeft <= 0}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold h-14 text-lg rounded-xl"
                data-testid="button-spin"
              >
                <Sparkles className="mr-2 h-6 w-6" />
                {t.spin}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 h-14 text-lg rounded-xl"
                data-testid="button-close-game"
              >
                <Home className="mr-2 h-5 w-5" />
                {t.backToHome}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
