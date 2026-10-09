import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Clock,
  List,
  Quote,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ReadingProgress from "@/components/sections/blog/ReadingProgress";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import { BRAND_GRADIENT } from "@/lib/brand";
import {
  getPublishedPost,
  getPublishedSlugs,
  getRelatedPosts,
} from "@/lib/blog";
import { slugifyHeading, type BlogBlock } from "@/lib/blog-types";
import { categoryIcons, DEFAULT_CATEGORY_ICON } from "@/lib/blogCategoryIcon";

type Props = {
  params: Promise<{ slug: string }>;
};

// Rebuilt on demand by the admin panel via `revalidatePath`, with an hourly
// backstop so a missed revalidation can never strand a post for long.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Vectrae Blog`,
    description: post.excerpt,
  };
}

function BlockRenderer({
  block,
  dropCap,
}: {
  block: BlogBlock;
  dropCap?: boolean;
}) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          id={slugifyHeading(block.text)}
          className="mt-14 scroll-mt-28 text-2xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-3xl"
        >
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p
          className={`mt-5 text-lg leading-relaxed text-neutral-600 ${
            dropCap
              ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-neutral-900 sm:first-letter:text-7xl"
              : ""
          }`}
        >
          {block.text}
        </p>
      );
    case "quote":
      return (
        <div
          className="relative mt-10 rounded-2xl border-l-2 border-transparent bg-neutral-50 p-8"
          style={{ borderImage: `${BRAND_GRADIENT} 1` }}
        >
          <Quote className="h-6 w-6 text-[#29B9F2]" />
          <p className="mt-4 text-xl font-medium leading-snug text-neutral-800">
            {block.text}
          </p>
          {block.attribution && (
            <p className="mt-4 text-sm font-semibold text-neutral-500">
              {block.attribution}
            </p>
          )}
        </div>
      );
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-lg leading-relaxed text-neutral-600"
            >
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const CategoryIcon = categoryIcons[post.category] ?? DEFAULT_CATEGORY_ICON;
  const related = await getRelatedPosts(post.slug, post.category, 3);
  const headings = post.content
    .filter(
      (b): b is Extract<BlogBlock, { type: "heading" }> => b.type === "heading",
    )
    .map((b) => ({ text: b.text, id: slugifyHeading(b.text) }));

  return (
    <>
      <ReadingProgress />

      {/* Full-bleed editorial hero */}
      <section className="relative isolate flex min-h-[62vh] flex-col overflow-hidden bg-black sm:min-h-[78vh]">
        <Image
          src={post.image}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/25 to-black/90" />

        <div className="relative z-10">
          <Navbar />
        </div>

        <div className="relative z-10 mx-auto mt-auto w-full max-w-4xl px-6 pb-12 sm:pb-16">
          <div
            className="flex items-center gap-1.5 text-sm text-white/50"
            data-aos="fade-up"
          >
            <Link href="/" className="transition hover:text-white/80">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="transition hover:text-white/80">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="text-white/80 transition hover:text-white"
            >
              {post.category}
            </Link>
          </div>

          <div
            className="mt-8 flex items-center gap-3"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <span
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
              style={{
                color: post.color,
                borderColor: `${post.color}50`,
                backgroundColor: `${post.color}18`,
              }}
            >
              <CategoryIcon className="h-3 w-3" />
              {post.category}
            </span>
          </div>

          <h1
            className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            {post.title}
          </h1>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Meta bar */}
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-6 text-sm text-neutral-500">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-xs font-bold text-neutral-700">
              {post.author.initials}
            </span>
            <div className="leading-tight">
              <p className="font-semibold text-neutral-900">
                {post.author.name}
              </p>
              <p className="text-xs text-neutral-400">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </div>
        </div>
      </div>

      {/* Body + sticky sidebar */}
      <article className="relative bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1fr_300px]">
          <div className="max-w-2xl">
            {post.content.map((block, i) => (
              <BlockRenderer key={i} block={block} dropCap={i === 0} />
            ))}
          </div>

          <aside>
            <div className="space-y-8 lg:sticky lg:top-28">
              {headings.length > 1 && (
                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    <List className="h-3.5 w-3.5" />
                    In This Article
                  </p>
                  <ul className="mt-4 space-y-3 border-l border-black/10 pl-4">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="text-sm text-neutral-600 transition hover:text-neutral-900"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Written By
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-bold text-neutral-700">
                    {post.author.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {post.author.role}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Tagged
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?category=${encodeURIComponent(post.category)}`}
                      className="rounded-full border border-black/10 bg-black/3 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-black/20 hover:text-neutral-900"
                    >
                      #{tag.replace(/\s+/g, "")}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-black p-6">
                <p className="text-sm font-semibold text-white">
                  Have a project like this?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Talk to our practice leads about your enterprise technology
                  roadmap.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-black transition hover:opacity-90"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  Talk to an Expert
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="relative overflow-hidden border-t border-black/5 bg-[#f5f5f0] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div
              className="mb-10 flex items-end justify-between"
              data-aos="fade-up"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                  Keep Reading
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
                  Related Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-1.5 text-sm font-semibold text-neutral-600 transition hover:text-neutral-900 sm:flex"
              >
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((r, i) => {
                const RelIcon =
                  categoryIcons[r.category] ?? DEFAULT_CATEGORY_ICON;
                return (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group relative h-full"
                  >
                    <SpotlightCard className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:border-black/20 hover:shadow-md">
                      <div
                        className="relative h-44 w-full overflow-hidden"
                        data-aos="fade-up"
                        data-aos-delay={i * 80}
                      >
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span
                          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
                          style={{
                            color: r.color,
                            borderColor: `${r.color}40`,
                            backgroundColor: "rgba(255,255,255,0.85)",
                          }}
                        >
                          <RelIcon className="h-3 w-3" />
                          {r.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <h3 className="text-base font-semibold leading-snug text-neutral-900 transition group-hover:text-[#0f9ac9]">
                          {r.title}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                          {r.readTime}
                        </span>
                      </div>
                    </SpotlightCard>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CTA />
      <Footer />
    </>
  );
}
