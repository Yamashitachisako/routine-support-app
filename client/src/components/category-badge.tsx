import { useStore } from "@/lib/store";
import { getCategoryStyle } from "@/lib/category-styles";

type CategoryBadgeProps = {
  category: string | undefined | null;
  size?: "sm" | "md";
  className?: string;
};

/** ホームと管理画面の両方で使うカテゴリ表示バッジ */
export function CategoryBadge({ category, size = "sm", className = "" }: CategoryBadgeProps) {
  const { t } = useStore();
  const style = getCategoryStyle(category);
  const label = t[style.labelKey];

  const sizeClass =
    size === "md"
      ? "text-sm px-3 py-1"
      : "text-xs px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${style.badge} ${className}`}
    >
      {label}
    </span>
  );
}
