import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import {
  useAllCustomRoutines,
  useDeleteCustomRoutine,
  useUpdateCustomRoutine,
  pickI18nText,
} from "@/hooks/useCustomRoutines";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin-layout";
import { CategoryBadge } from "@/components/category-badge";
import { getCategoryStyle } from "@/lib/category-styles";
import { getIconByKey } from "@/lib/icon-options";
import {
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import type { CustomRoutineWithSteps } from "@shared/schema";

export default function AdminRoutinesPage() {
  const { t, language } = useStore();
  const [, setLocation] = useLocation();
  const query = useAllCustomRoutines();
  const updateMutation = useUpdateCustomRoutine();
  const deleteMutation = useDeleteCustomRoutine();

  const routines = query.data ?? [];

  const handleToggleVisible = (r: CustomRoutineWithSteps) => {
    updateMutation.mutate({
      id: r.id,
      data: { isVisible: !r.isVisible },
    });
  };

  const handleDelete = (r: CustomRoutineWithSteps) => {
    if (!confirm(t.adminConfirmDelete)) return;
    deleteMutation.mutate(r.id);
  };

  const handleMove = (r: CustomRoutineWithSteps, direction: "up" | "down") => {
    const idx = routines.findIndex((x) => x.id === r.id);
    const swapWith = direction === "up" ? routines[idx - 1] : routines[idx + 1];
    if (!swapWith) return;
    updateMutation.mutate({ id: r.id, data: { order: swapWith.order } });
    updateMutation.mutate({ id: swapWith.id, data: { order: r.order } });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
          {t.adminRoutinesTitle}
        </h2>
        <Link href="/admin/routines/new">
          <Button data-testid="button-admin-new">
            <Plus className="mr-2 h-5 w-5" />
            {t.adminRoutineCreate}
          </Button>
        </Link>
      </div>

      {query.isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground py-12">
          <p>{t.loading}</p>
        </div>
      ) : query.isError ? (
        <Card className="bg-destructive/10 border-destructive/40">
          <CardContent className="p-6 text-destructive">
            {t.adminLoadError}
          </CardContent>
        </Card>
      ) : routines.length === 0 ? (
        <Card className="bg-white/60 border-none">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p className="mb-4">{t.adminEmptyState}</p>
            <Link href="/admin/routines/new">
              <Button data-testid="button-admin-empty-cta">
                <Plus className="mr-2 h-5 w-5" />
                {t.adminRoutineCreate}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {routines.map((r, idx) => {
            const title = pickI18nText(r.titleI18n, language) || r.id.slice(0, 8);
            const catStyle = getCategoryStyle(r.category);
            const RoutineIcon = getIconByKey(r.iconKey);
            return (
              <Card
                key={r.id}
                className={`${catStyle.card} border shadow-sm`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMove(r, "up")}
                      disabled={idx === 0}
                      aria-label={t.adminMoveUp}
                      data-testid={`button-move-up-${r.id}`}
                    >
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMove(r, "down")}
                      disabled={idx === routines.length - 1}
                      aria-label={t.adminMoveDown}
                      data-testid={`button-move-down-${r.id}`}
                    >
                      <GripVertical className="h-4 w-4 -rotate-90" />
                    </Button>
                  </div>

                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 ${catStyle.text}`}
                  >
                    <RoutineIcon className="h-6 w-6" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-medium text-lg text-foreground truncate"
                        data-testid={`text-routine-title-${r.id}`}
                      >
                        {title}
                      </h3>
                      <CategoryBadge category={r.category} />
                      {!r.isVisible && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground inline-flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          OFF
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.steps.length} {t.step}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={r.isVisible}
                        onCheckedChange={() => handleToggleVisible(r)}
                        data-testid={`switch-visible-${r.id}`}
                        aria-label={t.adminToggleVisible}
                      />
                      {r.isVisible ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <Link href={`/admin/routines/${r.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={t.adminRoutineEdit}
                        className="bg-white"
                        data-testid={`button-edit-${r.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(r)}
                      aria-label={t.adminDelete}
                      className="bg-white text-destructive hover:text-destructive"
                      data-testid={`button-delete-${r.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
