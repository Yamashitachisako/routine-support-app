import { useQuery } from "@tanstack/react-query";
import { getUserNames, getRoutineRecords } from "@/lib/api";
import type { RoutineRecord } from "@shared/schema";

export function useUserNames() {
  return useQuery<string[]>({
    queryKey: ["users"],
    queryFn: () => getUserNames(),
    retry: false,
    staleTime: 30_000,
  });
}

export function useUserRoutineRecords(userName: string | null | undefined) {
  return useQuery<RoutineRecord[]>({
    queryKey: ["routine-records", "by-user", userName ?? "none"],
    queryFn: () => getRoutineRecords({ userName: userName as string }),
    enabled: !!userName && !!userName.trim(),
    retry: false,
    staleTime: 30_000,
  });
}
