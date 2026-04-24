import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const content = CONTENT[language];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw] max-w-xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-xl sm:text-2xl">{content.title}</DialogTitle>
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
          <DialogDescription className="text-sm sm:text-base">
            {content.description}
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
