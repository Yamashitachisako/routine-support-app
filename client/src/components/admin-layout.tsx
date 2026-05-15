import { Link, useLocation } from "wouter";
import { Shield, Home as HomeIcon, ListChecks, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useStore();
  const [location] = useLocation();

  const isRoutinesTab = location.startsWith("/admin/routines");
  const isUsersTab = location.startsWith("/admin/users");

  return (
    <div className="flex flex-col gap-4 flex-1 -mx-2 sm:mx-0">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
            <Shield className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-slate-500">{t.adminTitle}</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="shrink-0 bg-white" data-testid="button-admin-home">
            <HomeIcon className="mr-2 h-4 w-4" />
            {t.adminBackToApp}
          </Button>
        </Link>
      </div>

      {/* タブ: ルーティン管理 / 利用者一覧 */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100">
        <Link href="/admin/routines" className="flex-1">
          <button
            type="button"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRoutinesTab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            data-testid="tab-admin-routines"
          >
            <ListChecks className="h-4 w-4" />
            {t.adminRoutinesTitle}
          </button>
        </Link>
        <Link href="/admin/users" className="flex-1">
          <button
            type="button"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isUsersTab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            data-testid="tab-admin-users"
          >
            <Users className="h-4 w-4" />
            {t.usersTitle}
          </button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-4">{children}</div>
    </div>
  );
}
