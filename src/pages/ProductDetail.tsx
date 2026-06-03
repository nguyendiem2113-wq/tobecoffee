import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  defaultProductPageContent,
  formatPrice,
} from "@/lib/content";

// Khai báo khóa lưu trữ nội bộ đồng bộ với Admin và Product list
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id ?? "");

  // Tải nội dung trang sản phẩm chứa mảng products từ localStorage
  const productPageContent = loadPersistedData(STORAGE_KEYS.product, defaultProductPageContent);
  const products = productPageContent.products || [];

  // Tìm sản phẩm chính xác theo ID
  const product = useMemo(() => {
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  if (!product) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl font-bold mb-4">Sản phẩm không tồn tại</h1>
            <p className="text-muted-foreground mb-6">Sản phẩm bạn tìm đang không có hoặc đã bị thay đổi.</p>
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
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary/80 mb-2">Sản phẩm</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">{product.name}</h1>
          <p className="font-body text-primary-foreground/70 mt-4 max-w-2xl mx-auto">{product.desc}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-8">
            <div className="rounded-3xl overflow-hidden bg-secondary shadow-sm">
              <img 
                src={product.imgUrl} // Khớp hoàn toàn với trường dữ liệu thực tế
                alt={product.name} 
                className="w-full object-cover" 
                loading="lazy" 
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold mb-4">Mô tả chi tiết</h2>
              <p className="font-body text-base leading-relaxed text-muted-foreground whitespace-pre-line">{product.details}</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Giá</p>
                  <p className="font-heading text-3xl font-bold mt-2">{formatPrice(product.price)}</p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Danh mục</p>
                  <p className="font-medium mt-1">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Xuất xứ</p>
                  <p className="font-medium mt-1">{product.origin}</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Link to="/product">
                  <Button variant="secondary" size="lg" className="w-full">
                    Quay lại sản phẩm
                  </Button>
                </Link>
                <Button size="lg" className="w-full" asChild>
                  <a href="tel:0909806947">Liên hệ ngay</a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-heading text-lg font-semibold mb-3">Có thể bạn quan tâm</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Truy cập trang sản phẩm để xem thêm lựa chọn khác, cập nhật nhanh từ admin và điều chỉnh nội dung khi cần.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;