import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getPageContent } from "@/lib/supabase";
import { BlogContent, defaultBlogContent } from "@/lib/content";

const Blog = () => {
  const [blogContent, setBlogContent] = useState<BlogContent>(defaultBlogContent);
  const [loading, setLoading] = useState(true);

  const sortedPosts = useMemo(
    () => [...blogContent.posts].sort((a, b) => b.date.localeCompare(a.date)),
    [blogContent.posts]
  );

  useEffect(() => {
    async function fetchBlog() {
      const content = await getPageContent<BlogContent>("blog", defaultBlogContent);
      setBlogContent(content);
      setLoading(false);
    }
    fetchBlog();
  }, []);

  return (
    <Layout>
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card/80 p-10 shadow-xl backdrop-blur-sm text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-primary/70 mb-4">{blogContent.title}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Tin tức & Blog</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">{blogContent.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">Đang tải bài viết...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.32em] text-primary/70 mb-3">Bài viết mới nhất</p>
                    <h2 className="font-heading text-2xl font-bold">Đọc ngay những câu chuyện cà phê truyền cảm hứng.</h2>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Chọn chủ đề phù hợp với bạn và khám phá những bài viết về pha chế, sức khỏe, hành trình và sản phẩm cà phê.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {sortedPosts.map((post) => (
                    <article key={post.id} className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                      <div className="aspect-video bg-secondary flex items-center justify-center text-3xl font-semibold text-primary/20">
                        {post.imgUrl ? ( <img src={post.imgUrl} alt={post.title} className="h-full w-full object-cover" /> ) : "TOBE"}
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{post.topic}</span>
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                        </div>
                        <h3 className="font-heading text-xl font-semibold mb-3 leading-snug">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-5 line-clamp-3">{post.excerpt}</p>
                        <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                          Xem chi tiết →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                  <h2 className="font-heading text-2xl font-bold mb-4">Gợi ý đọc tiếp</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Duyệt nhanh các chủ đề mới nhất và tìm bài viết phù hợp với gu thưởng thức cà phê của bạn.
                  </p>
                </div>
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                  {sortedPosts.slice(0, 3).map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="block rounded-3xl border border-border bg-background p-4 hover:border-primary hover:bg-primary/5 transition">
                      <p className="text-xs uppercase tracking-[0.24em] text-primary/80 mb-2">{post.topic}</p>
                      <h3 className="font-semibold text-lg leading-snug">{post.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
