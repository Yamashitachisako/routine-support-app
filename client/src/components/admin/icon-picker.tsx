import { ICON_OPTIONS } from "@/lib/icon-options";
import { Check } from "lucide-react";

type IconPickerProps = {
  value: string;
  onChange: (key: string) => void;
  /** プレビュー色 (カテゴリ色などを渡せる) */
  accentClass?: string;
};

/**
 * 管理者がアイコンをグリッドから選べる UI。
 * 選択中はチェックマーク + リング表示。
 */
export function IconPicker({ value, onChange, accentClass = "" }: IconPickerProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {ICON_OPTIONS.map(({ key, Icon }) => {
        const selected = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border transition-all touch-manipulation ${
              selected
                ? `bg-primary text-white border-primary shadow-md ${accentClass}`
                : "bg-white/70 border-border hover:bg-white"
            }`}
            data-testid={`button-icon-${key}`}
            aria-pressed={selected}
            aria-label={key}
          >
            <Icon className="h-6 w-6" />
            <span className={`text-[10px] ${selected ? "text-white/90" : "text-muted-foreground"}`}>
              {key}
            </span>
            {selected && (
              <span className="absolute top-1 right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
