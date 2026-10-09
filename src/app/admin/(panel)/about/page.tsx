import { asc, eq } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { certifications, galleryCategories, galleryImages } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import AboutPageClient from "@/components/admin/AboutPageClient";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminAboutPage({ searchParams }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { tab } = await searchParams;
  const activeTab = tab === "certifications" ? "certifications" : "gallery";

  let categoriesWithImages: ({
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    images: {
      id: string;
      url: string;
      alt: string;
      caption: string;
      sortOrder: number;
      categoryId: string;
      createdAt: Date;
    }[];
  })[] = [];

  let certs: (typeof certifications.$inferSelect)[] = [];

  try {
    const db = getDb();

    const [cats, imgs, certsData] = await withRetry(() =>
      db.batch([
        db.select().from(galleryCategories).orderBy(asc(galleryCategories.sortOrder), asc(galleryCategories.createdAt)),
        db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt)),
        db.select().from(certifications).orderBy(asc(certifications.sortOrder), asc(certifications.createdAt)),
      ]),
    );

    // Join images into their categories client-side (avoids a lateral join)
    categoriesWithImages = cats.map((cat) => ({
      ...cat,
      images: imgs.filter((img) => img.categoryId === cat.id),
    }));

    certs = certsData;
  } catch (error) {
    console.error("[admin/about] Failed to load data:", error);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content"
        title="About page"
        description="Manage the gallery categories, images, and certifications shown on the About page."
      />

      <AboutPageClient
        categories={categoriesWithImages}
        certifications={certs}
        readOnly={readOnly ?? false}
        tab={activeTab}
      />
    </div>
  );
}
