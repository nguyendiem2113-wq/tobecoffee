import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/RichContent";
import { getPageContent } from "@/lib/supabase";
import { BlogContent, defaultBlogContent, findBySlugOrId, itemPath } from "@/lib/content";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blogContent, setBlogContent] = useState<BlogContent>(defaultBlogContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      const data = await getPageContent<BlogContent>("blog", defaultBlogContent);
      setBlogContent(data);
      setLoading(false);
    }
    fetchBlog();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);


  const post = useMemo(
    () => findBySlugOrId(blogContent.posts, id),
    [blogContent.posts, id]
  );

  const sortedPosts = useMemo(
    () => [...blogContent.posts].sort((a, b) => b.date.localeCompare(a.date)),
    [blogContent.posts]
  );

  const recommendations = useMemo(
    () => sortedPosts.filter((item) => item.id !== post?.id).slice(0, 3),
    [sortedPosts, post]
  );

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Đang tải nội dung blog...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Bài viết không tìm thấy</h1>
            <p className="text-muted-foreground mb-6">Bài viết bạn tìm kiếm không tồn tại hoặc đã được cập nhật.</p>
            <Link to="/blog">
              <Button>Trở về trang Blog</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-10 max-w-3xl rounded-3xl border border-border bg-card/80 p-10 shadow-xl backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.32em] text-primary/70 mb-4">{blogContent.title}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">{post.excerpt}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.topic}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <article className="space-y-8">
            <div className="rounded-3xl overflow-hidden bg-secondary shadow-sm">
              {post.imgUrl ? (
                <img src={post.imgUrl} alt={post.title} className="w-full object-cover" />
              ) : (
                <div className="aspect-[16/9] flex items-center justify-center text-3xl font-semibold text-primary/20">TOBE</div>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
              <h2 className="font-heading text-2xl font-bold mb-4">Nội dung chính</h2>
              <RichContent html={post.body} className="prose-lg" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="font-semibold text-lg">Chủ đề</h3>
                <p className="mt-2 text-muted-foreground">{post.topic}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="font-semibold text-lg">Gợi ý đọc khác</h3>
                <p className="mt-2 text-muted-foreground">Xem những bài viết mới nhất và phù hợp với chủ đề này.</p>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                {recommendations.map((item) => (
                  <Link key={item.id} to={`/blog/${item.id}`} className="block rounded-3xl border border-border bg-background p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                    <p className="text-xs uppercase tracking-[0.24em] text-primary/80 mb-2">{item.topic}</p>
                    <h4 className="font-semibold text-lg leading-snug mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold mb-4">Khám phá thêm</h3>
              <p className="text-sm text-muted-foreground">Tìm hiểu thêm các bài viết khác trong trang Blog để nắm rõ xu hướng và câu chuyện cà phê Việt Nam.</p>
              <Link to="/blog" className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Xem tất cả bài viết →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetail;
