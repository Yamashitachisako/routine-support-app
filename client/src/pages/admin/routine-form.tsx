import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useStore } from "@/lib/store";
import {
  useCreateCustomRoutine,
  useCustomRoutine,
  useUpdateCustomRoutine,
  useDeleteCustomRoutine,
} from "@/hooks/useCustomRoutines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin-layout";
import { CategoryBadge } from "@/components/category-badge";
import { getCategoryStyle } from "@/lib/category-styles";
import { IconPicker } from "@/components/admin/icon-picker";
import { getIconByKey } from "@/lib/icon-options";
import {
  ROUTINE_CATEGORIES,
  REWARD_GAME_TYPES,
  type I18nText,
  type InsertCustomRoutine,
  type RoutineCategory,
  type RewardGameType,
} from "@shared/schema";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";

type StepDraft = {
  titleJa: string;
  titleEn: string;
  titleZh: string;
  descriptionJa: string;
  descriptionEn: string;
  descriptionZh: string;
  imageUrl: string;
};

const emptyStep = (): StepDraft => ({
  titleJa: "",
  titleEn: "",
  titleZh: "",
  descriptionJa: "",
  descriptionEn: "",
  descriptionZh: "",
  imageUrl: "",
});

function toI18n(ja: string, en: string, zh: string): I18nText | null {
  const text: I18nText = {};
  if (ja.trim()) text.ja = ja.trim();
  if (en.trim()) text.en = en.trim();
  if (zh.trim()) text.zh = zh.trim();
  if (!text.ja && !text.en && !text.zh) return null;
  return text;
}

export default function AdminRoutineFormPage() {
  const { t, language } = useStore();
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const editingId = params?.id && params.id !== "new" ? params.id : null;
  const isEditMode = !!editingId;

  const detailQuery = useCustomRoutine(editingId);
  const createMutation = useCreateCustomRoutine();
  const updateMutation = useUpdateCustomRoutine();
  const deleteMutation = useDeleteCustomRoutine();

  const [titleJa, setTitleJa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleZh, setTitleZh] = useState("");
  const [category, setCategory] = useState<RoutineCategory>("custom");
  const [iconKey, setIconKey] = useState("Sparkles");
  const [rewardGameType, setRewardGameType] = useState<RewardGameType>("star");
  const [isVisible, setIsVisible] = useState(true);
  const [steps, setSteps] = useState<StepDraft[]>([emptyStep()]);
  const [hydrated, setHydrated] = useState(!isEditMode);

  useEffect(() => {
    if (!isEditMode) return;
    const data = detailQuery.data;
    if (!data || hydrated) return;

    setTitleJa(data.titleI18n?.ja ?? "");
    setTitleEn(data.titleI18n?.en ?? "");
    setTitleZh(data.titleI18n?.zh ?? "");
    setCategory((data.category as RoutineCategory) ?? "custom");
    setIconKey(data.iconKey ?? "Sparkles");
    setRewardGameType((data.rewardGameType as RewardGameType) ?? "star");
    setIsVisible(data.isVisible);
    setSteps(
      data.steps.length > 0
        ? data.steps.map((s) => ({
            titleJa: s.titleI18n?.ja ?? "",
            titleEn: s.titleI18n?.en ?? "",
            titleZh: s.titleI18n?.zh ?? "",
            descriptionJa: s.descriptionI18n?.ja ?? "",
            descriptionEn: s.descriptionI18n?.en ?? "",
            descriptionZh: s.descriptionI18n?.zh ?? "",
            imageUrl: s.imageUrl ?? "",
          }))
        : [emptyStep()]
    );
    setHydrated(true);
  }, [isEditMode, detailQuery.data, hydrated]);

  const updateStep = (index: number, patch: Partial<StepDraft>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (index: number) =>
    setSteps((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  const moveStep = (index: number, dir: "up" | "down") => {
    setSteps((prev) => {
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const validationError = useMemo(() => {
    const titleI18n = toI18n(titleJa, titleEn, titleZh);
    if (!titleI18n) return t.adminTitleRequired;
    if (steps.length === 0) return t.adminAtLeastOneStep;
    for (const s of steps) {
      const tStep = toI18n(s.titleJa, s.titleEn, s.titleZh);
      const dStep = toI18n(s.descriptionJa, s.descriptionEn, s.descriptionZh);
      if (!tStep || !dStep) return t.adminTitleRequired;
    }
    return null;
  }, [titleJa, titleEn, titleZh, steps, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) {
      toast({ title: validationError, variant: "destructive" });
      return;
    }
    const titleI18n = toI18n(titleJa, titleEn, titleZh)!;

    const payload: InsertCustomRoutine = {
      category,
      titleI18n,
      iconKey: iconKey || "Sparkles",
      rewardGameType,
      order: 0,
      isVisible,
      steps: steps.map((s, idx) => ({
        order: idx,
        titleI18n: toI18n(s.titleJa, s.titleEn, s.titleZh)!,
        descriptionI18n: toI18n(s.descriptionJa, s.descriptionEn, s.descriptionZh)!,
        imageUrl: s.imageUrl.trim() || null,
      })),
    };

    if (isEditMode && editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast({ title: t.adminSavedToast });
            setLocation("/admin/routines");
          },
          onError: (err: any) => {
            toast({ title: err.message ?? t.adminLoadError, variant: "destructive" });
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast({ title: t.adminSavedToast });
          setLocation("/admin/routines");
        },
        onError: (err: any) => {
          toast({ title: err.message ?? t.adminLoadError, variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (!editingId) return;
    if (!confirm(t.adminConfirmDelete)) return;
    deleteMutation.mutate(editingId, {
      onSuccess: () => {
        toast({ title: t.adminDeletedToast });
        setLocation("/admin/routines");
      },
      onError: (err: any) => {
        toast({ title: err.message ?? t.adminLoadError, variant: "destructive" });
      },
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ----- preview values -----
  const catStyle = getCategoryStyle(category);
  const PreviewIcon = getIconByKey(iconKey);
  const previewTitle =
    (language === "ja" && titleJa) ||
    (language === "en" && titleEn) ||
    (language === "zh" && titleZh) ||
    titleJa ||
    titleEn ||
    titleZh ||
    "—";

  if (isEditMode && detailQuery.isLoading) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center text-muted-foreground py-12">
          <p>{t.loading}</p>
        </div>
      </AdminLayout>
    );
  }

  if (isEditMode && detailQuery.isError) {
    return (
      <AdminLayout>
        <Card className="bg-destructive/10 border-destructive/40">
          <CardContent className="p-6 text-destructive">{t.adminLoadError}</CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
            {isEditMode ? t.adminRoutineEdit : t.adminRoutineCreate}
          </h2>
        </div>

        {/* ---- Preview ---- */}
        <Card className={`${catStyle.card} border shadow-sm`}>
          <CardContent className="p-4 flex items-center gap-3">
            <span
              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 ${catStyle.text}`}
            >
              <PreviewIcon className="h-6 w-6" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.adminFieldTitle}
              </p>
              <p className="text-lg font-semibold text-foreground truncate">{previewTitle}</p>
            </div>
            <CategoryBadge category={category} size="md" />
          </CardContent>
        </Card>

        {/* ---- Basic fields ---- */}
        <Card className="bg-white/70 border-none">
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.adminFieldCategory}</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as RoutineCategory)}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROUTINE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {
                          ({
                            morning: t.adminCategoryMorning,
                            noon: t.adminCategoryNoon,
                            evening: t.adminCategoryEvening,
                            custom: t.adminCategoryCustom,
                          } as const)[c]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.adminFieldRewardGame}</Label>
                <Select
                  value={rewardGameType}
                  onValueChange={(v) => setRewardGameType(v as RewardGameType)}
                >
                  <SelectTrigger data-testid="select-reward-game">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REWARD_GAME_TYPES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {
                          ({
                            star: t.adminRewardStar,
                            balloon: t.adminRewardBalloon,
                            chest: t.adminRewardChest,
                          } as const)[g]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2 flex items-center justify-between rounded-lg bg-white/60 px-4 py-3 border border-border">
                <Label htmlFor="visible-switch">{t.adminFieldVisible}</Label>
                <Switch
                  id="visible-switch"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  data-testid="switch-visible"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.adminFieldIcon}</Label>
              <IconPicker value={iconKey} onChange={setIconKey} />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm uppercase tracking-wide text-muted-foreground">
                {t.adminFieldTitle}
              </Label>
              <I18nFieldset
                labels={t}
                ja={titleJa}
                en={titleEn}
                zh={titleZh}
                onChange={(lang, v) => {
                  if (lang === "ja") setTitleJa(v);
                  if (lang === "en") setTitleEn(v);
                  if (lang === "zh") setTitleZh(v);
                }}
                testIdPrefix="input-title"
              />
            </div>
          </CardContent>
        </Card>

        {/* ---- Steps ---- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.adminFieldSteps}</h3>
            <Button type="button" variant="outline" onClick={addStep} data-testid="button-add-step">
              <Plus className="mr-2 h-4 w-4" />
              {t.adminAddStep}
            </Button>
          </div>

          {steps.map((step, idx) => (
            <Card key={idx} className="bg-white/70 border-none">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    {t.adminStepNumber} {idx + 1}
                  </Label>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveStep(idx, "up")}
                      disabled={idx === 0}
                      aria-label={t.adminMoveUp}
                      data-testid={`button-step-up-${idx}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveStep(idx, "down")}
                      disabled={idx === steps.length - 1}
                      aria-label={t.adminMoveDown}
                      data-testid={`button-step-down-${idx}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(idx)}
                      disabled={steps.length <= 1}
                      aria-label={t.adminRemoveStep}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-step-remove-${idx}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{t.adminStepTitle}</Label>
                  <I18nFieldset
                    labels={t}
                    ja={step.titleJa}
                    en={step.titleEn}
                    zh={step.titleZh}
                    onChange={(lang, v) => {
                      if (lang === "ja") updateStep(idx, { titleJa: v });
                      if (lang === "en") updateStep(idx, { titleEn: v });
                      if (lang === "zh") updateStep(idx, { titleZh: v });
                    }}
                    testIdPrefix={`input-step-${idx}-title`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{t.adminStepDescription}</Label>
                  <I18nFieldset
                    labels={t}
                    ja={step.descriptionJa}
                    en={step.descriptionEn}
                    zh={step.descriptionZh}
                    multiline
                    onChange={(lang, v) => {
                      if (lang === "ja") updateStep(idx, { descriptionJa: v });
                      if (lang === "en") updateStep(idx, { descriptionEn: v });
                      if (lang === "zh") updateStep(idx, { descriptionZh: v });
                    }}
                    testIdPrefix={`input-step-${idx}-desc`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{t.adminStepImageUrl}</Label>
                  <Input
                    value={step.imageUrl}
                    onChange={(e) => updateStep(idx, { imageUrl: e.target.value })}
                    placeholder="https://..."
                    data-testid={`input-step-${idx}-image`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---- Actions ---- */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4 -mx-4 px-4 flex flex-wrap gap-3 z-10">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 min-w-[150px]"
            data-testid="button-form-save"
          >
            <Save className="mr-2 h-5 w-5" />
            {t.adminSave}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/admin/routines")}
            data-testid="button-form-cancel"
          >
            {t.adminCancel}
          </Button>
          {isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-destructive hover:text-destructive"
              data-testid="button-form-delete"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t.adminDelete}
            </Button>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}

function I18nFieldset({
  labels,
  ja,
  en,
  zh,
  multiline,
  onChange,
  testIdPrefix,
}: {
  labels: ReturnType<typeof useStore>["t"];
  ja: string;
  en: string;
  zh: string;
  multiline?: boolean;
  onChange: (lang: "ja" | "en" | "zh", value: string) => void;
  testIdPrefix: string;
}) {
  const Field = multiline ? Textarea : Input;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div>
        <Label className="text-xs text-muted-foreground">{labels.adminLanguageJa}</Label>
        <Field
          value={ja}
          onChange={(e) => onChange("ja", e.target.value)}
          data-testid={`${testIdPrefix}-ja`}
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">{labels.adminLanguageEn}</Label>
        <Field
          value={en}
          onChange={(e) => onChange("en", e.target.value)}
          data-testid={`${testIdPrefix}-en`}
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">{labels.adminLanguageZh}</Label>
        <Field
          value={zh}
          onChange={(e) => onChange("zh", e.target.value)}
          data-testid={`${testIdPrefix}-zh`}
        />
      </div>
    </div>
  );
}
