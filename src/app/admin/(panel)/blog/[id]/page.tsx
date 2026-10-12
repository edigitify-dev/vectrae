import { isUuid } from "@/lib/security";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Check } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { blogPosts } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import BlogEditor, { type PostDraft } from "@/components/admin/BlogEditor";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";
import { getBlogCategories } from "@/lib/admin/categories";
import { postStatusMeta } from "@/lib/admin/statuses";
import { formatDateTime } from "@/lib/admin/format";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditPostPage({ params, searchParams }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { saved } = await searchParams;

  let row: typeof blogPosts.$inferSelect | undefined;
  let categories: string[] = [];

  try {
    const [posts, loadedCategories] = await Promise.all([
      withRetry(() => getDb().select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)),
      getBlogCategories(),
    ]);
    [row] = posts;
    categories = loadedCategories;
  } catch (error) {
    console.error("[admin/blog] Load failed:", error);
  }

  if (!row) {
    notFound();
  }

  const draft: PostDraft = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    readTime: row.readTime,
    color: row.color,
    image: row.image,
    featured: row.featured,
    status: row.status === "published" ? "published" : "draft",
    authorName: row.authorName,
    authorRole: row.authorRole,
    authorInitials: row.authorInitials,
    tags: row.tags,
    content: row.content,
  };

  return (
    <div className="space-y-7">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All posts
      </Link>

      {saved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[#84D96C]/30 bg-[#84D96C]/10 px-4 py-3 text-sm text-[#b6e8a5]"
        >
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Post created.
        </p>
      )}

      <PageHeader
        eyebrow={`Last edited ${formatDateTime(row.updatedAt)}`}
        title={row.title || "Untitled post"}
        actions={<StatusBadge meta={postStatusMeta(row.status)} />}
      />

      <BlogEditor draft={draft} categories={categories} readOnly={readOnly} />
    </div>
  );
}
