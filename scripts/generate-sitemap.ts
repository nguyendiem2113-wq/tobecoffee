// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Pulls dynamic blog posts and products from Supabase so every public URL is indexed.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

const BASE_URL = "https://tobecoffee.lovable.app";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

/** Tạo slug thân thiện từ chuỗi tiếng Việt (đồng bộ với src/lib/content.ts). */
const slugify = (input: string): string =>
  (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");

type Item = { slug?: string; name?: string; title?: string; category?: string };
const itemPath = (item: Item): string =>
  item.slug?.trim() || slugify(item.name ?? item.title ?? "");

// Các trang tĩnh công khai (bỏ qua /admin và các route nội bộ)
const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/story", changefreq: "monthly", priority: "0.8" },
  { path: "/product", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.9" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

async function getContent<T>(page: string): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase
      .from("page_contents")
      .select("content")
      .eq("page", page)
      .maybeSingle();
    if (error || !data?.content) return null;
    return data.content as T;
  } catch {
    return null;
  }
}

async function buildEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [...staticEntries];
  const seenCategories = new Set<string>();

  // Sản phẩm + danh mục sản phẩm
  const productContent = await getContent<{ products?: Item[] }>("product");
  for (const p of productContent?.products ?? []) {
    entries.push({
      path: `/product/detail/${itemPath(p)}`,
      changefreq: "monthly",
      priority: "0.7",
    });
    if (p.category) {
      const cat = slugify(p.category);
      if (cat && !seenCategories.has(cat)) {
        seenCategories.add(cat);
        entries.push({ path: `/product/${cat}`, changefreq: "weekly", priority: "0.7" });
      }
    }
  }

  // Bài viết blog
  const blogContent = await getContent<{ posts?: (Item & { date?: string })[] }>("blog");
  for (const post of blogContent?.posts ?? []) {
    entries.push({
      path: `/blog/${itemPath(post)}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  return entries;
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const entries = await buildEntries();
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();
