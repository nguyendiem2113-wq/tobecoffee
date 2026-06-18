import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

import {
  IndexContent,
  defaultIndexContent,
} from "@/lib/content";

import { getPageContent } from "@/lib/supabase";

const Index = () => {
  const [home, setHome] =
    useState<IndexContent>(defaultIndexContent);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHome() {
      const content =
        await getPageContent<IndexContent>(
          "index",
          defaultIndexContent
        );

      setHome(content);
      setLoading(false);
    }

    fetchHome();
  }, []);

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              Đang tải nội dung...
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>

      {/* HERO */}

      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden flex items-center justify-center">

        <img
          src={home.hero.imageUrl}
          alt={home.hero.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-4xl px-4 text-center text-white">
          <h1 className="font-heading text-4xl md:text-6xl font-bold">
            {home.hero.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80">
            {home.hero.subtitle}
          </p>
        </div>

      </section>

      {/* ABOUT */}

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          <img
            src={home.about?.imageUrl}
            alt={home.about?.title}
            className="w-full h-[500px] object-cover"
          />

          <div>

            <p className="text-primary uppercase tracking-widest text-sm font-semibold mb-3">
              {home.about?.label}
            </p>

            <h2 className="font-heading text-4xl font-bold mb-6">
              {home.about?.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {home.about?.body}
            </p>

            <Link
              to="/story"
              className="inline-flex bg-primary text-primary-foreground px-8 py-4 font-semibold"
            >
              Xem thêm
            </Link>

          </div>

        </div>
      </section>

      {/* PRODUCT CATEGORIES */}

      <section className="py-20">
        <div className="container mx-auto px-4">

          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Danh mục sản phẩm
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {home.productCategories.map((cat) => (

              <Link
                key={cat.title}
                to="/product"
                className="group relative overflow-hidden aspect-[4/3]"
              >

                <img
                  src={cat.imgUrl}
                  alt={cat.title}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-0 left-0 p-5">

                  <p className="text-xs text-white/70 uppercase tracking-widest">
                    {cat.label}
                  </p>

                  <h3 className="text-white font-bold whitespace-pre-line">
                    {cat.title}
                  </h3>

                </div>

              </Link>

            ))}

          </div>

        </div>
      </section>

      {/* STATS */}

      <section className="relative py-24 overflow-hidden">

        <img
          src={home.statsImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 container mx-auto px-4">

          <div className="grid md:grid-cols-3 gap-12 text-center">

            {home.stats.map((s) => (

              <div key={s.number}>

                <p className="text-5xl font-bold text-white">
                  {s.number}
                </p>

                <p className="text-white/70 mt-4">
                  {s.label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* BLOG */}

      {home.blogPosts?.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">

            <h2 className="font-heading text-3xl font-bold text-center mb-12">
              {home.blogTitle || "Tin tức"}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              {home.blogPosts.map((post) => (

                <article
                  key={post.id}
                  className="border border-border bg-card overflow-hidden"
                >

                  <img
                    src={post.imgUrl}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">

                    <p className="text-xs uppercase text-primary mb-2">
                      {post.topic}
                    </p>

                    <h3 className="font-bold mb-3">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          </div>
        </section>
      )}

    </Layout>
  );
};

export default Index;