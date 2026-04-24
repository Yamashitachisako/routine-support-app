import { Button } from "@/components/ui/button";
import { Language } from "@/lib/translations";

type OnboardingGuideProps = {
  isOpen: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onClose: () => void;
};

const CONTENT: Record<
  Language,
  {
    title: string;
    description: string;
    close: string;
    steps: string[];
  }
> = {
  ja: {
    title: "使い方ガイド",
    description: "最初にこの5ステップを確認すると、迷わず始められます。",
    close: "閉じる",
    steps: [
      "ルーティンを選ぶ",
      "名前を入力する",
      "Startを押す",
      "ステップを順番に進める",
      "終了後に記録が保存される",
    ],
  },
  en: {
    title: "Quick Start Guide",
    description: "Follow these 5 steps to start smoothly.",
    close: "Close",
    steps: [
      "Choose a routine",
      "Enter your name",
      "Press Start",
      "Follow each step in order",
      "Your result is saved after completion",
    ],
  },
};

export default function OnboardingGuide({
  isOpen,
  language,
  onLanguageChange,
  onClose,
}: OnboardingGuideProps) {
  if (!isOpen) return null;

  const content = CONTENT[language];

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label={language === "ja" ? "ガイドを閉じる" : "Close guide"}
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-4 shadow-xl sm:p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold sm:text-2xl">{content.title}</h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={language === "ja" ? "default" : "outline"}
                className="h-9 px-3"
                onClick={() => onLanguageChange("ja")}
                data-testid="button-onboarding-lang-ja"
              >
                日本語
              </Button>
              <Button
                type="button"
                size="sm"
                variant={language === "en" ? "default" : "outline"}
                className="h-9 px-3"
                onClick={() => onLanguageChange("en")}
                data-testid="button-onboarding-lang-en"
              >
                English
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{content.description}</p>
        </div>

        <ol className="mt-2 space-y-3">
          {content.steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3 sm:p-4"
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="text-base sm:text-lg leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4">
          <Button
            type="button"
            className="h-12 w-full text-base"
            onClick={onClose}
            data-testid="button-close-onboarding"
          >
            {content.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
