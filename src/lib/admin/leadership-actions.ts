"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, withRetry } from "@/db";
import { leadershipMembers } from "@/db/schema";
import { requireWriteAccess } from "./auth";
import type { ActionState } from "./actions";
import { isLeadershipId, parseLeadershipForm } from "./leadership-input";

function revalidateLeadership() {
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function saveLeadershipMember(_previous: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();
  if (!(form instanceof FormData)) return { error: "Malformed submission." };
  const parsed = parseLeadershipForm(form);
  if (parsed.error) return { error: parsed.error };
  const { id, values } = parsed;
  try {
    const db = getDb();
    let savedId: string | undefined;
    if (id) {
      const updates = { ...values, updatedAt: new Date() };
      const update = db.update(leadershipMembers).set(updates)
        .where(eq(leadershipMembers.id, id)).returning({ id: leadershipMembers.id });
      if (values.isFeatured) {
        // Batch executes as one transaction. Lock the edited row before changing
        // the featured member, and don't demote anyone if the row was deleted.
        const result = await withRetry(() => db.batch([
          db.select({ id: leadershipMembers.id }).from(leadershipMembers)
            .where(eq(leadershipMembers.id, id)).for("update"),
          db.update(leadershipMembers).set({ isFeatured: false, updatedAt: new Date() })
            .where(and(eq(leadershipMembers.isFeatured, true),
              sql`exists (select 1 from leadership_members where id = ${id})`)),
          update,
        ]));
        savedId = result[2][0]?.id;
      } else {
        const [row] = await withRetry(() => update);
        savedId = row?.id;
      }
    } else {
      const insert = db.insert(leadershipMembers).values(values).returning({ id: leadershipMembers.id });
      if (values.isFeatured) {
        const result = await withRetry(() => db.batch([
          db.update(leadershipMembers).set({ isFeatured: false, updatedAt: new Date() })
            .where(eq(leadershipMembers.isFeatured, true)),
          insert,
        ]));
        savedId = result[1][0]?.id;
      } else {
        const [row] = await withRetry(() => insert);
        savedId = row?.id;
      }
    }
    if (!savedId) return { error: "This member no longer exists. Refresh the page." };
    revalidateLeadership();
    return { success: savedId };
  } catch (error) {
    console.error("[admin/leadership] Could not save member:", error);
    return { error: "Couldn't save the member. Please try again." };
  }
}

export async function deleteLeadershipMember(_previous: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();
  const id = form instanceof FormData ? String(form.get("id") ?? "") : "";
  if (!isLeadershipId(id)) return { error: "Invalid member." };
  try {
    await withRetry(() => getDb().delete(leadershipMembers).where(eq(leadershipMembers.id, id)));
    revalidateLeadership();
    return { success: "Member removed." };
  } catch (error) {
    console.error("[admin/leadership] Could not delete member:", error);
    return { error: "Couldn't remove the member. Please try again." };
  }
}
