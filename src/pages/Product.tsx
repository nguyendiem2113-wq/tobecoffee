import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  allCategories,
  defaultProductPageContent,
  formatPrice,
  origins,
  ProductItem,
} from "@/lib/content";

// Khai báo các khóa lưu trữ nội bộ đồng bộ với trang Admin
const STORAGE_KEYS = {
  product: "tobe_product_content",
};

// Helper tải dữ liệu cục bộ an toàn với SSR
function loadPersistedData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

const Product = () => {
  const [cat, setCat] = useState("Tất cả");
  const [origin, setOrigin] = useState("Tất cả");

  // Đổ dữ liệu từ localStorage hoặc fallback về data mặc định nếu trống
  const productPageContent = loadPersistedData(STORAGE_KEYS.product, defaultProductPageContent);
  const products: ProductItem[] = productPageContent.products || [];

  // Lọc sản phẩm theo Danh mục và Xuất xứ
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "Tất cả" || p.category === cat) &&
          (origin === "Tất cả" || p.origin === origin)
      ),
    [cat, origin, products]
  );

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            {productPageContent.hero.title}
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg">
            {productPageContent.hero.subtitle}
          </p>
        </div>
      </section>

      {/* FILTER & PRODUCT LIST */}
      <section className="py-16">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12">
          {/* Bộ lọc Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="font-heading text-lg font-bold mb-4">Danh mục</h3>
              <ul className="space-y-2 mb-8">
                {allCategories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => setCat(c)}
                      className={`font-body text-sm w-full text-left px-3 py-2 rounded-sm transition-colors ${
                        cat === c
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className="font-heading text-lg font-bold mb-4">Xuất xứ</h3>
              <ul className="space-y-2">
                {origins.map((o) => (
                  <li key={o}>
                    <button
                      onClick={() => setOrigin(o)}
                      className={`font-body text-sm w-full text-left px-3 py-2 rounded-sm transition-colors ${
                        origin === o
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {o}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Danh sách sản phẩm hiển thị */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <p className="font-body text-muted-foreground text-center py-20">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-border rounded-sm overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-secondary overflow-hidden">
                      <img
                        src={p.imgUrl} // Khớp với trường dữ liệu imgUrl trong content.ts
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {p.category}
                      </p>
                      <h3 className="font-heading text-base font-bold mb-1 leading-snug">
                        {p.name}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground mb-2 line-clamp-2">
                        {p.desc}
                      </p>
                      <p className="font-heading text-sm font-semibold mb-4">
                        {formatPrice(p.price)}
                      </p>
                      <Button
                        asChild
                        className="w-full rounded-sm font-body uppercase tracking-wider text-xs"
                      >
                        <Link to={`/product/${p.id}`}>Xem chi tiết</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;