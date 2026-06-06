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
    if (!session || !isAdmin) return;
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
        .select("id, form_data, created_at, is_read")
        .order("created_at", { ascending: false });
      setMessages((data as unknown as Message[]) || []);
      setLoading(false);
    })();
  }, [session, isAdmin]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="font-heading text-2xl font-bold">Không có quyền truy cập</h1>
        <p className="max-w-md text-muted-foreground">
          Tài khoản của bạn không phải quản trị viên. Vui lòng đăng nhập bằng tài khoản admin.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={signOut}>Đăng xuất</Button>
          <Button asChild><Link to="/">Về trang chủ</Link></Button>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const markRead = async (id: string, value: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: value } : m)));
    const { error } = await supabase.from("contact_messages").update({ is_read: value }).eq("id", id);
    if (error) toast.error("Cập nhật thất bại");
  };

  const deleteMessage = async (id: string) => {
    const prev = messages;
    setMessages((cur) => cur.filter((m) => m.id !== id));
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      setMessages(prev);
      toast.error("Xoá thất bại");
    } else {
      toast.success("Đã xoá tin nhắn");
    }
  };

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
              className={`relative whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t.label}
              {t.id === "messages" && unreadCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
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
            {/* DASHBOARD */}
            {tab === "dashboard" && (
              <>
                <div>
                  <h2 className="font-heading text-2xl font-bold">Xin chào 👋</h2>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { icon: Package, label: "Sản phẩm", value: product.products.length, tab: "product" as TabId },
                    { icon: FileText, label: "Bài viết", value: blog.posts.length, tab: "blog" as TabId },
                    { icon: MessageSquare, label: "Tin nhắn", value: messages.length, tab: "messages" as TabId },
                    { icon: Mail, label: "Tin chưa đọc", value: unreadCount, tab: "messages" as TabId },
                  ].map((s) => (
                    <button key={s.label} onClick={() => setTab(s.tab)} className="text-left">
                      <Card className="flex items-center gap-4 p-6 transition-shadow hover:shadow-md">
                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                          <s.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-heading text-2xl font-bold">{s.value}</p>
                          <p className="text-sm text-muted-foreground">{s.label}</p>
                        </div>
                      </Card>
                    </button>
                  ))}
                </div>
                <Card className="space-y-3 p-6">
                  <h3 className="font-heading text-lg font-bold">Truy cập nhanh</h3>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {tabs.filter((t) => t.id !== "dashboard").map((t) => (
                      <Button key={t.id} variant="outline" className="justify-start" onClick={() => setTab(t.id)}>
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </Card>
              </>
            )}

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
                <Card className="p-6">
                  <ListEditor
                    title="Bài viết nổi bật (trang chủ)"
                    items={home.blogPosts as unknown as Record<string, unknown>[]}
                    titleKey="title"
                    searchKeys={["title", "topic", "excerpt"]}
                    onChange={(blogPosts) => setHome({ ...home, blogPosts: blogPosts as unknown as IndexContent["blogPosts"] })}
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
                      { key: "slug", label: "Đường dẫn (slug)", kind: "slug", from: "title" },
                      { key: "topic", label: "Chủ đề", kind: "text" },
                      { key: "date", label: "Ngày (YYYY-MM-DD)", kind: "text" },
                      { key: "excerpt", label: "Tóm tắt", kind: "area" },
                      { key: "body", label: "Nội dung", kind: "rich", folder: "blog" },
                      { key: "imgUrl", label: "Ảnh", kind: "image", folder: "blog" },
                    ]}
                  />
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
                    searchKeys={["name", "category", "origin", "desc"]}
                    onChange={(products) => setProduct({ ...product, products: products as unknown as ProductPageContent["products"] })}
                    newItem={(items) => ({
                      id: Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1,
                      slug: "",
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
                      { key: "slug", label: "Đường dẫn (slug)", kind: "slug", from: "name" },
                      { key: "category", label: "Danh mục", kind: "text" },
                      { key: "origin", label: "Xuất xứ", kind: "text" },
                      { key: "price", label: "Giá (VNĐ)", kind: "number" },
                      { key: "desc", label: "Mô tả ngắn", kind: "area" },
                      { key: "details", label: "Mô tả chi tiết", kind: "rich", folder: "products" },
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
                    searchKeys={["title", "topic", "excerpt"]}
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
                      { key: "slug", label: "Đường dẫn (slug)", kind: "slug", from: "title" },
                      { key: "topic", label: "Chủ đề", kind: "text" },
                      { key: "date", label: "Ngày (YYYY-MM-DD)", kind: "text" },
                      { key: "excerpt", label: "Tóm tắt", kind: "area" },
                      { key: "body", label: "Nội dung", kind: "rich", folder: "blog" },
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
                <h2 className="mb-4 font-heading text-lg font-bold">
                  Tin nhắn liên hệ ({messages.length})
                  {unreadCount > 0 && <span className="ml-2 text-sm font-normal text-muted-foreground">— {unreadCount} chưa đọc</span>}
                </h2>
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có tin nhắn nào.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-md border p-4 transition-colors ${
                          m.is_read ? "border-border bg-card" : "border-primary/40 bg-primary/5"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!m.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                            <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("vi-VN")}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => markRead(m.id, !m.is_read)} title={m.is_read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}>
                              {m.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteMessage(m.id)} title="Xoá">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
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
