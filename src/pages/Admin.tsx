import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogOut, ExternalLink, Save, Trash2, Mail, MailOpen, Package, FileText, MessageSquare } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase, getPageContent, updatePageContent } from "@/lib/supabase";
import { AdminField, AdminArea, AdminImage } from "@/components/admin/AdminFields";
import { ListEditor } from "@/components/admin/ListEditor";
import {
  defaultIndexContent,
  defaultStoryContent,
  defaultProductPageContent,
  defaultBlogContent,
  defaultContactContent,
  IndexContent,
  StoryContent,
  ProductPageContent,
  BlogContent,
  ContactContent,
} from "@/lib/content";

type TabId = "dashboard" | "home" | "story" | "product" | "blog" | "contact" | "messages";

const tabs: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Tổng quan" },
  { id: "home", label: "Trang chủ" },
  { id: "story", label: "Giới thiệu" },
  { id: "product", label: "Sản phẩm" },
  { id: "blog", label: "Tin tức" },
  { id: "contact", label: "Liên hệ" },
  { id: "messages", label: "Tin nhắn" },
];

interface Message {
  id: string;
  form_data: Record<string, unknown>;
  created_at: string;
  is_read?: boolean;
}

const Admin = () => {
  const { session, isAdmin, loading: authLoading, signOut } = useAdminAuth();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [home, setHome] = useState<IndexContent>(defaultIndexContent);
  const [story, setStory] = useState<StoryContent>(defaultStoryContent);
  const [product, setProduct] = useState<ProductPageContent>(defaultProductPageContent);
  const [blog, setBlog] = useState<BlogContent>(defaultBlogContent);
  const [contact, setContact] = useState<ContactContent>(defaultContactContent);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const [h, s, p, b, c] = await Promise.all([
        getPageContent<IndexContent>("index", defaultIndexContent),
        getPageContent<StoryContent>("story", defaultStoryContent),
        getPageContent<ProductPageContent>("product", defaultProductPageContent),
        getPageContent<BlogContent>("blog", defaultBlogContent),
        getPageContent<ContactContent>("contact", defaultContactContent),
      ]);
      setHome(h);
      setStory(s);
      setProduct(p);
      setBlog(b);
      setContact(c);
      const { data } = await supabase
        .from("contact_messages")
        .select("id, form_data, created_at")
        .order("created_at", { ascending: false });
      setMessages((data as unknown as Message[]) || []);
      setLoading(false);
    })();
  }, [session]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;

  const save = async (page: TabId) => {
    const map: Record<string, unknown> = { home: home, story, product, blog, contact };
    const pageKey = page === "home" ? "index" : page;
    setSaving(true);
    const ok = await updatePageContent(pageKey, map[page]);
    setSaving(false);
    ok ? toast.success("Đã lưu thay đổi") : toast.error("Lưu thất bại");
  };

  const SaveBar = ({ page }: { page: TabId }) => (
    <div className="sticky bottom-4 z-10 flex justify-end">
      <Button onClick={() => save(page)} disabled={saving} size="lg" className="shadow-lg">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Lưu thay đổi
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="font-heading text-xl font-bold">TOBE CMS</h1>
            <p className="text-xs text-muted-foreground">Quản trị nội dung website</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" /> Xem website
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
            </Button>
          </div>
        </div>
        <div className="container mx-auto flex gap-1 overflow-x-auto px-4 pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {/* HOME */}
            {tab === "home" && (
              <>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Hero</h2>
                  <AdminField label="Tiêu đề" value={home.hero.title} onChange={(v) => setHome({ ...home, hero: { ...home.hero, title: v } })} />
                  <AdminArea label="Mô tả" value={home.hero.subtitle} onChange={(v) => setHome({ ...home, hero: { ...home.hero, subtitle: v } })} />
                  <AdminImage label="Ảnh nền Hero" folder="home" value={home.hero.imageUrl} onChange={(v) => setHome({ ...home, hero: { ...home.hero, imageUrl: v } })} />
                </Card>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Về chúng tôi</h2>
                  <AdminField label="Nhãn" value={home.about?.label ?? ""} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), label: v } })} />
                  <AdminField label="Tiêu đề" value={home.about?.title ?? ""} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), title: v } })} />
                  <AdminArea label="Nội dung" value={home.about?.body ?? ""} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), body: v } })} />
                  <AdminImage label="Ảnh" folder="home" value={home.about?.imageUrl} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), imageUrl: v } })} />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Danh mục sản phẩm"
                    items={home.productCategories}
                    titleKey="label"
                    onChange={(productCategories) => setHome({ ...home, productCategories })}
                    newItem={() => ({ label: "DANH MỤC MỚI", title: "Tiêu đề\nMô tả", imgUrl: "" })}
                    fields={[
                      { key: "label", label: "Nhãn", kind: "text" },
                      { key: "title", label: "Tiêu đề (xuống dòng = mô tả)", kind: "area" },
                      { key: "imgUrl", label: "Ảnh", kind: "image", folder: "home" },
                    ]}
                  />
                </Card>
                <Card className="space-y-4 p-6">
                  <ListEditor
                    title="Số liệu nổi bật"
                    items={home.stats}
                    titleKey="number"
                    onChange={(stats) => setHome({ ...home, stats })}
                    newItem={() => ({ number: "0+", label: "Mô tả" })}
                    fields={[
                      { key: "number", label: "Số", kind: "text" },
                      { key: "label", label: "Mô tả", kind: "text" },
                    ]}
                  />
                  <AdminImage label="Ảnh nền số liệu" folder="home" value={home.statsImage} onChange={(v) => setHome({ ...home, statsImage: v })} />
                  <AdminField label="Tiêu đề mục Blog" value={home.blogTitle ?? ""} onChange={(v) => setHome({ ...home, blogTitle: v })} />
                </Card>
                <SaveBar page="home" />
              </>
            )}

            {/* STORY */}
            {tab === "story" && (
              <>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Hero</h2>
                  <AdminField label="Tiêu đề" value={story.hero.title} onChange={(v) => setStory({ ...story, hero: { ...story.hero, title: v } })} />
                  <AdminField label="Phụ đề" value={story.hero.subtitle} onChange={(v) => setStory({ ...story, hero: { ...story.hero, subtitle: v } })} />
                  <AdminImage label="Ảnh" folder="story" value={story.hero.imageUrl} onChange={(v) => setStory({ ...story, hero: { ...story.hero, imageUrl: v } })} />
                  <AdminArea label="Mục tiêu (trích dẫn)" value={story.goal ?? ""} onChange={(v) => setStory({ ...story, goal: v })} />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Nhiệm vụ"
                    items={story.missions}
                    titleKey="title"
                    onChange={(missions) => setStory({ ...story, missions })}
                    newItem={() => ({ icon: "⭐", title: "Nhiệm vụ mới", desc: "Mô tả" })}
                    fields={[
                      { key: "icon", label: "Icon (emoji)", kind: "text" },
                      { key: "title", label: "Tiêu đề", kind: "text" },
                      { key: "desc", label: "Mô tả", kind: "area" },
                    ]}
                  />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Số liệu"
                    items={story.stats}
                    titleKey="number"
                    onChange={(stats) => setStory({ ...story, stats })}
                    newItem={() => ({ number: "0+", label: "Mô tả" })}
                    fields={[
                      { key: "number", label: "Số", kind: "text" },
                      { key: "label", label: "Mô tả", kind: "text" },
                    ]}
                  />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Dịch vụ"
                    items={story.services}
                    titleKey="title"
                    onChange={(services) => setStory({ ...story, services })}
                    newItem={() => ({ label: "Dịch vụ", title: "Tiêu đề", desc: "Mô tả", imgUrl: "" })}
                    fields={[
                      { key: "label", label: "Nhãn", kind: "text" },
                      { key: "title", label: "Tiêu đề", kind: "text" },
                      { key: "desc", label: "Mô tả", kind: "area" },
                      { key: "imgUrl", label: "Ảnh", kind: "image", folder: "story" },
                    ]}
                  />
                </Card>
                <SaveBar page="story" />
              </>
            )}

            {/* PRODUCT */}
            {tab === "product" && (
              <>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Hero</h2>
                  <AdminField label="Tiêu đề" value={product.hero.title} onChange={(v) => setProduct({ ...product, hero: { ...product.hero, title: v } })} />
                  <AdminField label="Phụ đề" value={product.hero.subtitle} onChange={(v) => setProduct({ ...product, hero: { ...product.hero, subtitle: v } })} />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Sản phẩm"
                    items={product.products as unknown as Record<string, unknown>[]}
                    titleKey="name"
                    onChange={(products) => setProduct({ ...product, products: products as unknown as ProductPageContent["products"] })}
                    newItem={(items) => ({
                      id: Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1,
                      name: "Sản phẩm mới",
                      desc: "",
                      details: "",
                      category: "Cà phê hạt rang",
                      origin: "Bảo Lộc",
                      price: 0,
                      imgUrl: "",
                    })}
                    fields={[
                      { key: "name", label: "Tên sản phẩm", kind: "text" },
                      { key: "category", label: "Danh mục", kind: "text" },
                      { key: "origin", label: "Xuất xứ", kind: "text" },
                      { key: "price", label: "Giá (VNĐ)", kind: "number" },
                      { key: "desc", label: "Mô tả ngắn", kind: "area" },
                      { key: "details", label: "Mô tả chi tiết", kind: "area" },
                      { key: "imgUrl", label: "Ảnh", kind: "image", folder: "products" },
                    ]}
                  />
                </Card>
                <SaveBar page="product" />
              </>
            )}

            {/* BLOG */}
            {tab === "blog" && (
              <>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Tiêu đề trang</h2>
                  <AdminField label="Nhãn" value={blog.title} onChange={(v) => setBlog({ ...blog, title: v })} />
                  <AdminField label="Phụ đề" value={blog.subtitle} onChange={(v) => setBlog({ ...blog, subtitle: v })} />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Bài viết"
                    items={blog.posts as unknown as Record<string, unknown>[]}
                    titleKey="title"
                    onChange={(posts) => setBlog({ ...blog, posts: posts as unknown as BlogContent["posts"] })}
                    newItem={(items) => ({
                      id: Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1,
                      title: "Bài viết mới",
                      excerpt: "",
                      date: new Date().toISOString().slice(0, 10),
                      topic: "Tin tức",
                      body: "",
                      imgUrl: "",
                    })}
                    fields={[
                      { key: "title", label: "Tiêu đề", kind: "text" },
                      { key: "topic", label: "Chủ đề", kind: "text" },
                      { key: "date", label: "Ngày (YYYY-MM-DD)", kind: "text" },
                      { key: "excerpt", label: "Tóm tắt", kind: "area" },
                      { key: "body", label: "Nội dung", kind: "area" },
                      { key: "imgUrl", label: "Ảnh", kind: "image", folder: "blog" },
                    ]}
                  />
                </Card>
                <SaveBar page="blog" />
              </>
            )}

            {/* CONTACT */}
            {tab === "contact" && (
              <>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Hero</h2>
                  <AdminField label="Tiêu đề" value={contact.hero.title} onChange={(v) => setContact({ ...contact, hero: { ...contact.hero, title: v } })} />
                  <AdminField label="Phụ đề" value={contact.hero.subtitle} onChange={(v) => setContact({ ...contact, hero: { ...contact.hero, subtitle: v } })} />
                </Card>
                <Card className="p-6">
                  <ListEditor
                    title="Thông tin liên hệ"
                    items={contact.info}
                    titleKey="label"
                    onChange={(info) => setContact({ ...contact, info })}
                    newItem={() => ({ label: "Nhãn", value: "Giá trị" })}
                    fields={[
                      { key: "label", label: "Nhãn (Địa chỉ/Hotline/Email/Giờ làm việc)", kind: "text" },
                      { key: "value", label: "Giá trị", kind: "text" },
                    ]}
                  />
                </Card>
                <Card className="space-y-4 p-6">
                  <h2 className="font-heading text-lg font-bold">Bản đồ</h2>
                  <AdminArea label="Google Maps Embed URL" value={contact.mapEmbed ?? ""} onChange={(v) => setContact({ ...contact, mapEmbed: v })} />
                </Card>
                <SaveBar page="contact" />
              </>
            )}

            {/* MESSAGES */}
            {tab === "messages" && (
              <Card className="p-6">
                <h2 className="mb-4 font-heading text-lg font-bold">Tin nhắn liên hệ ({messages.length})</h2>
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có tin nhắn nào.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className="rounded-md border border-border p-4">
                        <p className="mb-2 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("vi-VN")}</p>
                        {Object.entries(m.form_data || {}).map(([k, v]) => (
                          <p key={k} className="text-sm">
                            <span className="font-semibold capitalize">{k}: </span>
                            {String(v)}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
