import { useStore } from "@/lib/store";
import { Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Settings() {
  const { t, language, setLanguage, openOnboarding } = useStore();

  const languages: { code: Language; label: string }[] = [
    { code: 'ja', label: t.japanese },
    { code: 'en', label: t.english },
    { code: 'zh', label: t.chinese },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">{t.settings}</h2>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.language}</h3>
          
          <div className="grid gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                className={`
                  justify-between h-14 px-6 text-lg rounded-xl transition-all
                  ${language === lang.code ? 'bg-primary shadow-md' : 'bg-white/50 border-white hover:bg-white'}
                `}
                onClick={() => setLanguage(lang.code)}
                data-testid={`button-lang-${lang.code}`}
              >
                {lang.label}
                {language === lang.code && <Check className="h-5 w-5" />}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {t.settingsHelp}
          </h3>
          <Button
            variant="outline"
            className="h-14 w-full justify-center rounded-xl text-base"
            onClick={openOnboarding}
            data-testid="button-open-onboarding"
          >
            {t.showOnboardingGuide}
          </Button>
        </div>
      </div>

      <div className="pt-8 border-t border-border">
         <div className="flex justify-between items-center text-sm text-muted-foreground">
           <span>{t.version}</span>
           <span className="font-mono">1.0.0</span>
         </div>
      </div>
    </div>
  );
}
