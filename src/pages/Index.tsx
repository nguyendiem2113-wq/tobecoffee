import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getPageContent } from "@/lib/supabase";
import { IndexContent, defaultIndexContent, itemPath } from "@/lib/content";

const Index = () => {
  const [content, setContent] = useState<IndexContent>(defaultIndexContent);

  useEffect(() => {
    getPageContent<IndexContent>("index", defaultIndexContent).then(setContent);
  }, []);

  const hero = content.hero ?? defaultIndexContent.hero;
  const about = content.about;
  const productCategories = content.productCategories ?? [];
  const stats = content.stats ?? [];
  const statsImage = content.statsImage;
  const blogTitle = content.blogTitle;
  const blogPosts = content.blogPosts ?? [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] flex items-center justify-center overflow-hidden">
        {hero.imageUrl && (
          <img
            src={hero.imageUrl}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] sm:object-center scale-110 sm:scale-100"
            width={1920}
            height={1080}
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight drop-shadow-lg">
            {hero.title}
          </h1>
          <p className="font-body text-lg md:text-xl text-primary-foreground/90 drop-shadow">{hero.subtitle}</p>
        </div>
      </section>

      {/* About */}
      {about && (
        <section className="py-20">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden">
              {about.imageUrl && (
                <img src={about.imageUrl} alt={about.title} className="w-full h-[400px] lg:h-[500px] object-cover" loading="lazy" />
              )}
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-primary uppercase tracking-widest mb-3">{about.label}</p>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{about.title}</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">{about.body}</p>
              <Link
                to="/story"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-sm uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
              >
                Xem thêm về chúng tôi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12 uppercase tracking-wider">
            Danh mục sản phẩm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((cat) => (
              <Link key={cat.title} to="/product" className="group relative aspect-[4/3] overflow-hidden rounded-sm">
                {cat.imgUrl && (
                  <img
                    src={cat.imgUrl}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 z-10">
                  <p className="font-body text-[10px] font-semibold text-primary-foreground/70 uppercase tracking-widest mb-1">
                    {cat.label}
                  </p>
                  <h3 className="font-heading text-base md:text-lg font-bold text-primary-foreground leading-snug whitespace-pre-line">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 overflow-hidden">
        {statsImage && <img src={statsImage} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {stats.map((s) => (
              <div key={s.number}>
                <p className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">{s.number}</p>
                <p className="font-body text-primary-foreground/80 text-sm leading-relaxed max-w-xs mx-auto">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-primary mb-12 italic">
            {blogTitle || "Góc lắng đọng"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="group">
                <div className="overflow-hidden mb-5">
                  {post.imgUrl && (
                    <img
                      src={post.imgUrl}
                      alt={post.title}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 leading-snug">{post.title}</h3>
                <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                <Link to={`/blog/${itemPath(post)}`} className="font-body text-sm text-primary font-semibold hover:underline">
                  Đọc thêm →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
