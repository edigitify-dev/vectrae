"use client";

import { createContext, useContext, useTransition, type ReactNode, type TransitionStartFunction } from "react";
import { AdminTableSkeleton } from "./AdminSkeleton";

const ListTransition = createContext<{
  pending: boolean;
  startTransition: TransitionStartFunction;
} | null>(null);

export function useAdminListTransition() {
  const transition = useContext(ListTransition);
  if (!transition) throw new Error("List controls must be inside AdminListView.");
  return transition;
}

/** Keep search controls available while any filter or pagination request runs. */
export default function AdminListView({ filters, children }: { filters: ReactNode; children: ReactNode }) {
  const [pending, startTransition] = useTransition();
  return (
    <ListTransition.Provider value={{ pending, startTransition }}>
      <div className="space-y-7">
        {filters}
        <AdminListResults>{children}</AdminListResults>
      </div>
    </ListTransition.Provider>
  );
}

function AdminListResults({ children }: { children: ReactNode }) {
  const { pending } = useAdminListTransition();
  return (
    <div aria-busy={pending} className="space-y-7">
      {pending && <AdminTableSkeleton label="Updating results…" />}
      <div hidden={pending} className="space-y-7">{children}</div>
    </div>
  );
}
