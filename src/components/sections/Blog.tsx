"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import type { BlogPost } from "@/lib/blog-types";

export default function Blog({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-24 sm:py-32">
      {/* Background ambient lighting glows */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#29B9F2]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-150 w-150 translate-x-1/3 translate-y-1/3 rounded-full bg-[#25D9C7]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#29B9F2]">
            Industry Insights
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Latest from Vectrae
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Stay updated with the latest trends, technologies, and strategies
            driving modern enterprise IT infrastructure.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <div
              key={post.slug}
              className="group relative h-full"
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 100, 300)}
            >
              <SpotlightCard className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition duration-500 hover:border-white/20 hover:bg-white/[0.04]">
                {post.image && (
                  <div className="relative h-56 w-full overflow-hidden border-b border-white/5">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          color: post.color,
                          borderColor: `${post.color}40`,
                          backgroundColor: `${post.color}10`,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-snug text-white transition duration-300 group-hover:text-[#29B9F2]">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 text-xs font-medium text-white/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

        <div
          className="mt-16 flex justify-center"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Link
            href="/blog"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.08]"
          >
            <span>View All Articles</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
