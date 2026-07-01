import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/RichContent";
import { getPageContent } from "@/lib/supabase";
import {
  ProductPageContent,
  findBySlugOrId,
  itemPath,
  slugify,
} from "@/lib/content";
import { Leaf, Award, Truck, Phone, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type ProductItem = ProductPageContent["products"][number];

const ProductCard = ({ item, showCategory = true }: { item: ProductItem; showCategory?: boolean }) => (
  <Link
    to={`/product/detail/${itemPath(item)}`}
    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
  >
    <div className="relative aspect-square w-full overflow-hidden bg-secondary">
      {item.imgUrl ? (
        <img
          src={item.imgUrl}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-contain p-6 drop-shadow-md transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-primary/20">
          TOBE
        </div>
      )}
    </div>
    <div className="flex flex-1 flex-col p-5">
      {showCategory && (
        <p className="mb-1.5 font-body text-[10px] uppercase tracking-widest text-primary">
          {item.category}
        </p>
      )}
      <h3 className="font-heading text-base font-bold leading-snug">{item.name}</h3>
      <p className="mt-2 line-clamp-2 font-body text-xs text-muted-foreground">{item.desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </div>
  </Link>
);

const ProductCarousel = ({
  items,
  showCategory = true,
}: {
  items: ProductItem[];
  showCategory?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {items.length > 3 && (
        <>
          <button
            type="button"
            aria-label="Cuộn trái"
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card p-2.5 text-foreground shadow-md transition-colors hover:bg-primary hover:text-primary-foreground lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Cuộn phải"
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card p-2.5 text-foreground shadow-md transition-colors hover:bg-primary hover:text-primary-foreground lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => (
          <div
            key={p.id}
            className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <ProductCard item={p} showCategory={showCategory} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState<ProductPageContent>({
    hero: {
      title: "",
      subtitle: "",
      imageUrl: "",
    },
    products: [],
    showOrigin: false,
  });

  useEffect(() => {
    getPageContent<ProductPageContent>("product")
      .then((data) => {
        if (data) {
          setContent(data);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  const product = useMemo(
    () => findBySlugOrId(content.products || [], id),
    [content.products, id]
  );

  const related = useMemo(() => {
    if (!product) return [];

    const products = content.products || [];

    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 8);
  }, [content.products, product]);

  const otherProducts = useMemo(() => {
    if (!product) return [];

    const products = content.products || [];

    return products
      .filter((p) => p.id !== product.id && p.category !== product.category)
      .slice(0, 10);
  }, [content.products, product]);

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Đang tải sản phẩm...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl font-bold mb-4">Sản phẩm không tồn tại</h1>

            <p className="text-muted-foreground mb-6">
              Sản phẩm bạn tìm đang không có hoặc đã bị thay đổi.
            </p>

            <Link to="/product">
              <Button>Quay lại danh sách</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-primary-foreground/60 mb-4 flex flex-wrap gap-2 items-center">
            <Link to="/" className="hover:text-primary-foreground whitespace-nowrap">
              Trang chủ
            </Link>

            <span className="shrink-0">/</span>

            <Link
              to={`/product/${slugify(product.category)}`}
              className="hover:text-primary-foreground whitespace-nowrap"
            >
              {product.category}
            </Link>

            <span className="shrink-0">/</span>

            <span className="text-primary-foreground/90 truncate">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid gap-12 lg:grid-cols-2 items-start">
          <div className="aspect-square overflow-hidden rounded-3xl bg-secondary shadow-sm p-8 flex items-center justify-center">
            {product.imgUrl && (
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-xl"
                loading="lazy"
              />
            )}
          </div>

          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-3">
              {product.category}
            </p>

            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

            <p className="font-body text-lg text-muted-foreground mb-6">{product.desc}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                <Leaf className="h-3.5 w-3.5 text-primary" />
                {product.category}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                <Award className="h-3.5 w-3.5 text-primary" />
                Xuất xứ {product.origin}
              </span>
            </div>

            <div className="space-y-4 border-t border-border pt-6 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Danh mục</span>

                <span className="font-medium">{product.category}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Xuất xứ</span>

                <span className="font-medium">{product.origin}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-border pt-6 mb-8">
              {[
                { icon: Leaf, label: "Rang mộc nguyên chất" },
                { icon: Award, label: "Chất lượng tuyển chọn" },
                { icon: Truck, label: "Giao hàng toàn quốc" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs text-muted-foreground leading-tight">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Liên hệ đặt hàng
                </Link>
              </Button>

              <Button size="lg" variant="secondary" className="flex-1" asChild>
                <Link to={`/product/${slugify(product.category)}`}>Quay lại</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {product.details && (
        <section className="py-12 bg-secondary/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold mb-4">Mô tả chi tiết</h2>

            <RichContent html={product.details} className="prose-lg" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
            <ProductCarousel items={related} showCategory={false} />
          </div>
        </section>
      )}

      {otherProducts.length > 0 && (
        <section className="py-16 border-t border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold">Khám phá thêm hương vị khác</h2>
              <Button variant="link" asChild className="hidden sm:inline-flex">
                <Link to="/product">Xem tất cả →</Link>
              </Button>
            </div>

            <ProductCarousel items={otherProducts} />

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/product">Xem tất cả sản phẩm</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
