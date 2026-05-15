import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { useUserNames } from "@/hooks/useUserNames";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, User } from "lucide-react";

export default function AdminUsersPage() {
  const { t } = useStore();
  const query = useUserNames();
  const users = query.data ?? [];

  return (
    <AdminLayout>
      <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
        {t.usersTitle}
      </h2>

      {query.isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground py-12">
          <p>{t.loading}</p>
        </div>
      ) : query.isError ? (
        <Card className="bg-destructive/10 border-destructive/40">
          <CardContent className="p-6 text-destructive">{t.adminLoadError}</CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="bg-white/60 border-none">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>{t.usersEmptyState}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {users.map((name) => (
            <Link key={name} href={`/admin/users/${encodeURIComponent(name)}`}>
              <Card className="bg-white/70 border border-slate-200 hover:bg-white transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <User className="h-5 w-5" />
                  </span>
                  <span className="flex-1 font-medium text-foreground truncate" data-testid={`text-user-name-${name}`}>
                    {name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t.userDetailTitle}
                  >
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
