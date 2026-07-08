import { useEffect, useState, ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2, LogOut, ExternalLink, Save, Trash2, Mail, MailOpen,
  Package, FileText, MessageSquare, LayoutDashboard, Home as HomeIcon,
  BookOpen, Phone, Menu, X, Image as ImageIcon, Sparkles, MapPin,
  Search as SearchIcon, RefreshCw, LifeBuoy,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase, getPageContent, updatePageContent, refreshAllCache, checkConnection } from "@/lib/supabase";
import { AdminField, AdminArea, AdminImage } from "@/components/admin/AdminFields";
import { ListEditor } from "@/components/admin/ListEditor";
import { AdminGuide } from "@/components/admin/AdminGuide";
import { Switch } from "@/components/ui/switch";
import {
  defaultIndexContent,
  defaultStoryContent,
  defaultProductPageContent,
  defaultBlogContent,
  defaultContactContent,
  defaultSiteSettings,
  IndexContent,
  StoryContent,
  ProductPageContent,
  BlogContent,
  ContactContent,
  SiteSettings,
} from "@/lib/content";

type TabId = "dashboard" | "home" | "story" | "product" | "blog" | "contact" | "seo" | "messages" | "guide";

const tabs: { id: TabId; label: string; icon: typeof HomeIcon; desc: string }[] = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard, desc: "Thống kê & truy cập nhanh" },
  { id: "home", label: "Trang chủ", icon: HomeIcon, desc: "Hero, giới thiệu, danh mục" },
  { id: "story", label: "Giới thiệu", icon: Sparkles, desc: "Câu chuyện thương hiệu" },
  { id: "product", label: "Sản phẩm", icon: Package, desc: "Danh sách sản phẩm" },
  { id: "blog", label: "Tin tức", icon: BookOpen, desc: "Bài viết & tin tức" },
  { id: "contact", label: "Liên hệ", icon: Phone, desc: "Thông tin liên hệ & bản đồ" },
  { id: "seo", label: "SEO & Favicon", icon: SearchIcon, desc: "Tiêu đề, mô tả, favicon" },
  { id: "messages", label: "Tin nhắn", icon: MessageSquare, desc: "Tin nhắn từ khách hàng" },
  { id: "guide", label: "Hướng dẫn", icon: LifeBuoy, desc: "Cách dùng website & /admin" },
];

interface Message {
  id: string;
  form_data: Record<string, unknown>;
  created_at: string;
  is_read?: boolean;
}

/** Section wrapper: iconized header + optional description to reduce clutter */
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof HomeIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 border-b border-border bg-muted/30 px-6 py-4">
        <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-base font-bold leading-tight">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </Card>
  );
}

const Admin = () => {
  const { session, isAdmin, loading: authLoading, signOut } = useAdminAuth();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);

  const [home, setHome] = useState<IndexContent>(defaultIndexContent);
  const [story, setStory] = useState<StoryContent>(defaultStoryContent);
  const [product, setProduct] = useState<ProductPageContent>(defaultProductPageContent);
  const [blog, setBlog] = useState<BlogContent>(defaultBlogContent);
  const [contact, setContact] = useState<ContactContent>(defaultContactContent);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadContent = async () => {
    const [h, s, p, b, c, st] = await Promise.all([
      getPageContent<IndexContent>("index"),
      getPageContent<StoryContent>("story"),
      getPageContent<ProductPageContent>("product"),
      getPageContent<BlogContent>("blog"),
      getPageContent<ContactContent>("contact"),
      getPageContent<SiteSettings>("settings"),
    ]);

    setHome(h ?? defaultIndexContent);
    setStory(s ?? defaultStoryContent);
    setProduct(p ?? defaultProductPageContent);
    setBlog(b ?? defaultBlogContent);
    setContact(c ?? defaultContactContent);
    setSettings({ ...defaultSiteSettings, ...(st ?? {}) });
    const { data } = await supabase
      .from("contact_messages")
      .select("id, form_data, created_at, is_read")
      .order("created_at", { ascending: false });
    setMessages((data as unknown as Message[]) || []);
  };

  useEffect(() => {
    if (!session || !isAdmin) return;
    (async () => {
      await loadContent();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isAdmin]);

  useEffect(() => {
    if (!session || !isAdmin) return;
    let active = true;
    const check = async () => {
      const ok = await checkConnection();
      if (active) setOnline(ok);
    };
    check();
    const timer = window.setInterval(check, 60000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [session, isAdmin]);

  const refreshData = async () => {
    setRefreshing(true);
    const ok = await refreshAllCache();
    await loadContent();
    setRefreshing(false);
    if (ok) toast.success("Đã làm mới dữ liệu mới nhất");
    else toast.error("Không kết nối được máy chủ, đang dùng dữ liệu đã lưu");
  };


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
  const activeTab = tabs.find((t) => t.id === tab)!;

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
    const map: Record<string, unknown> = { home, story, product, blog, contact, seo: settings };
    const pageKey = page === "home" ? "index" : page === "seo" ? "settings" : page;
    setSaving(true);
    const ok = await updatePageContent(pageKey, map[page]);
    setSaving(false);
    if (ok) toast.success("Đã lưu thay đổi");
    else toast.error("Lưu thất bại");
  };

  const SaveBar = ({ page }: { page: TabId }) => (
    <div className="sticky bottom-4 z-10 flex justify-end">
      <Button onClick={() => save(page)} disabled={saving} size="lg" className="shadow-xl">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Lưu thay đổi
      </Button>
    </div>
  );

  const NavItems = () => (
    <nav className="space-y-1">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setNavOpen(false);
            }}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "" : "text-muted-foreground group-hover:text-foreground"}`} />
            <span className="flex-1 text-left">{t.label}</span>
            {t.id === "messages" && unreadCount > 0 && (
              <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                active ? "bg-primary-foreground text-primary" : "bg-destructive text-destructive-foreground"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setNavOpen((v) => !v)}>
            {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-heading font-bold">TOBE CMS</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/" target="_blank"><ExternalLink className="h-4 w-4" /></Link>
        </Button>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-border px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-md">
                <span className="font-heading text-lg font-bold">T</span>
              </div>
              <div>
                <p className="font-heading text-sm font-bold leading-tight">TOBE CMS</p>
                <p className="text-xs text-muted-foreground">Quản trị nội dung</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavItems />
            </div>
            <div className="border-t border-border p-3">
              <Button
                variant="outline"
                size="sm"
                className="mb-2 w-full"
                onClick={refreshData}
                disabled={refreshing}
                title="Tải lại dữ liệu mới nhất từ máy chủ"
              >
                <RefreshCw className={`mr-1.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Đang làm mới..." : "Làm mới dữ liệu"}
              </Button>
              <div className="mb-2 truncate px-3 text-xs text-muted-foreground" title={session.user.email ?? ""}>
                {session.user.email}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/" target="_blank"><ExternalLink className="mr-1.5 h-4 w-4" /> Website</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="mr-1.5 h-4 w-4" /> Thoát
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {navOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setNavOpen(false)} />
        )}

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {/* Page heading */}
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <activeTab.icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold leading-tight lg:text-2xl">{activeTab.label}</h1>
              <p className="text-sm text-muted-foreground">{activeTab.desc}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-w-3xl space-y-6">
              {/* DASHBOARD */}
              {tab === "dashboard" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { icon: Package, label: "Sản phẩm", value: product.products.length, tab: "product" as TabId },
                      { icon: FileText, label: "Bài viết", value: blog.posts.length, tab: "blog" as TabId },
                      { icon: MessageSquare, label: "Tin nhắn", value: messages.length, tab: "messages" as TabId },
                      { icon: Mail, label: "Chưa đọc", value: unreadCount, tab: "messages" as TabId },
                    ].map((s) => (
                      <button key={s.label} onClick={() => setTab(s.tab)} className="text-left">
                        <Card className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                          <div className="rounded-xl bg-primary/10 p-3 text-primary">
                            <s.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-heading text-2xl font-bold leading-none">{s.value}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                          </div>
                        </Card>
                      </button>
                    ))}
                  </div>
                  <Section icon={Sparkles} title="Truy cập nhanh" description="Chọn trang bạn muốn chỉnh sửa">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {tabs.filter((t) => t.id !== "dashboard").map((t) => {
                        const Icon = t.icon;
                        return (
                          <Button key={t.id} variant="outline" className="h-auto justify-start gap-3 py-3" onClick={() => setTab(t.id)}>
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="flex flex-col items-start">
                              <span className="text-sm font-semibold">{t.label}</span>
                              <span className="text-xs font-normal text-muted-foreground">{t.desc}</span>
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </Section>
                </>
              )}

              {/* HOME */}
              {tab === "home" && (
                <>
                  <Section icon={ImageIcon} title="Khu vực Hero" description="Ảnh nền và tiêu đề đầu trang chủ">
                    <AdminField label="Tiêu đề" value={home.hero.title} onChange={(v) => setHome({ ...home, hero: { ...home.hero, title: v } })} />
                    <AdminArea label="Mô tả" value={home.hero.subtitle} onChange={(v) => setHome({ ...home, hero: { ...home.hero, subtitle: v } })} />
                    <AdminImage label="Ảnh nền Hero" folder="home" value={home.hero.imageUrl} onChange={(v) => setHome({ ...home, hero: { ...home.hero, imageUrl: v } })} />
                  </Section>
                  <Section icon={Sparkles} title="Về chúng tôi" description="Đoạn giới thiệu ngắn trên trang chủ">
                    <AdminField label="Nhãn" value={home.about?.label ?? ""} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), label: v } })} />
                    <AdminField label="Tiêu đề" value={home.about?.title ?? ""} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), title: v } })} />
                    <AdminArea label="Nội dung" value={home.about?.body ?? ""} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), body: v } })} />
                    <AdminImage label="Ảnh" folder="home" value={home.about?.imageUrl} onChange={(v) => setHome({ ...home, about: { ...(home.about ?? { label: "", title: "", body: "" }), imageUrl: v } })} />
                  </Section>
                  <Section icon={Package} title="Danh mục sản phẩm">
                    <ListEditor
                      title="Danh mục"
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
                  </Section>
                  <Section icon={LayoutDashboard} title="Số liệu nổi bật">
                    <ListEditor
                      title="Số liệu"
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
                  </Section>
                  <Section icon={BookOpen} title="Bài viết nổi bật (trang chủ)">
                    <ListEditor
                      title="Bài viết"
                      items={home.blogPosts as unknown as Record<string, unknown>[]}
                      titleKey="title"
                      searchKeys={["title", "topic", "excerpt"]}
                      collapsible
                      onChange={(blogPosts) => setHome({ ...home, blogPosts: blogPosts as unknown as IndexContent["blogPosts"] })}
                      newItem={(items) => ({
                        id: Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1,
                        slug: "",
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
                  </Section>
                  <SaveBar page="home" />
                </>
              )}

              {/* STORY */}
              {tab === "story" && (
                <>
                  <Section icon={ImageIcon} title="Khu vực Hero" description="Ảnh và tiêu đề trang giới thiệu">
                    <AdminField label="Tiêu đề" value={story.hero.title} onChange={(v) => setStory({ ...story, hero: { ...story.hero, title: v } })} />
                    <AdminField label="Phụ đề" value={story.hero.subtitle} onChange={(v) => setStory({ ...story, hero: { ...story.hero, subtitle: v } })} />
                    <AdminImage label="Ảnh" folder="story" recommend="960 x 1280" value={story.hero.imageUrl} onChange={(v) => setStory({ ...story, hero: { ...story.hero, imageUrl: v } })} />
                    <AdminArea label="Mục tiêu (trích dẫn)" value={story.goal ?? ""} onChange={(v) => setStory({ ...story, goal: v })} />
                  </Section>
                  <Section icon={Sparkles} title="Tại Sao Chọn TOBE">
                    <AdminField label="Tiêu đề" value={story.why?.title ?? ""} onChange={(v) => setStory({ ...story, why: { ...story.why, title: v } })} />
                    <AdminArea label="Nội dung" value={story.why?.body ?? ""} onChange={(v) => setStory({ ...story, why: { ...story.why, body: v } })} />
                  </Section>
                  <Section icon={LayoutDashboard} title="Nhiệm vụ">
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
                  </Section>
                  <Section icon={LayoutDashboard} title="Số liệu">
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
                  </Section>
                  <Section icon={Package} title="Dịch vụ">
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
                        { key: "imgUrl", label: "Ảnh", kind: "image", folder: "story", recommend: "800 x 600" },
                      ]}
                    />
                  </Section>
                  <SaveBar page="story" />
                </>
              )}

              {/* PRODUCT */}
              {tab === "product" && (
                <>
                  <Section icon={ImageIcon} title="Khu vực Hero" description="Tiêu đề đầu trang sản phẩm">
                    <AdminField label="Tiêu đề" value={product.hero.title} onChange={(v) => setProduct({ ...product, hero: { ...product.hero, title: v } })} />
                    <AdminField label="Phụ đề" value={product.hero.subtitle} onChange={(v) => setProduct({ ...product, hero: { ...product.hero, subtitle: v } })} />
                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                      <div>
                        <p className="text-sm font-semibold">Hiển thị bộ lọc Xuất xứ</p>
                        <p className="text-xs text-muted-foreground">Bật để hiện cột lọc theo xuất xứ trên trang sản phẩm.</p>
                      </div>
                      <Switch
                        checked={product.showOrigin === true}
                        onCheckedChange={(checked) => setProduct({ ...product, showOrigin: checked })}
                      />
                    </div>
                  </Section>
                  <Section icon={Package} title="Danh sách sản phẩm" description="Nhấn mũi tên để mở rộng chỉnh sửa từng sản phẩm">
                    <ListEditor
                      title="Sản phẩm"
                      items={product.products as unknown as Record<string, unknown>[]}
                      titleKey="name"
                      searchKeys={["name", "category", "origin", "desc"]}
                      collapsible
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
                        { key: "imgUrl", label: "Ảnh", kind: "image", folder: "products", recommend: "800 x 800" },
                      ]}
                    />
                  </Section>
                  <SaveBar page="product" />
                </>
              )}

              {/* BLOG */}
              {tab === "blog" && (
                <>
                  <Section icon={ImageIcon} title="Tiêu đề trang">
                    <AdminField label="Nhãn" value={blog.title} onChange={(v) => setBlog({ ...blog, title: v })} />
                    <AdminField label="Phụ đề" value={blog.subtitle} onChange={(v) => setBlog({ ...blog, subtitle: v })} />
                  </Section>
                  <Section icon={BookOpen} title="Danh sách bài viết" description="Nhấn mũi tên để mở rộng chỉnh sửa từng bài">
                    <ListEditor
                      title="Bài viết"
                      items={blog.posts as unknown as Record<string, unknown>[]}
                      titleKey="title"
                      searchKeys={["title", "topic", "excerpt"]}
                      collapsible
                      onChange={(posts) => setBlog({ ...blog, posts: posts as unknown as BlogContent["posts"] })}
                      newItem={(items) => ({
                        id: Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1,
                        slug: "",
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
                  </Section>
                  <SaveBar page="blog" />
                </>
              )}

              {/* CONTACT */}
              {tab === "contact" && (
                <>
                  <Section icon={ImageIcon} title="Khu vực Hero">
                    <AdminField label="Tiêu đề" value={contact.hero.title} onChange={(v) => setContact({ ...contact, hero: { ...contact.hero, title: v } })} />
                    <AdminField label="Phụ đề" value={contact.hero.subtitle} onChange={(v) => setContact({ ...contact, hero: { ...contact.hero, subtitle: v } })} />
                  </Section>
                  <Section icon={Phone} title="Thông tin liên hệ">
                    <ListEditor
                      title="Thông tin"
                      items={contact.info}
                      titleKey="label"
                      onChange={(info) => setContact({ ...contact, info })}
                      newItem={() => ({ label: "Nhãn", value: "Giá trị" })}
                      fields={[
                        { key: "label", label: "Nhãn (Địa chỉ/Hotline/Email/Giờ làm việc)", kind: "text" },
                        { key: "value", label: "Giá trị", kind: "text" },
                      ]}
                    />
                  </Section>
                  <Section icon={MapPin} title="Bản đồ" description="Tạo tự động từ địa chỉ">
                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground space-y-1.5">
                      <p className="font-medium text-foreground">Bản đồ hiển thị tự động ✨</p>
                      <p>
                        Không cần dán mã nhúng. Bản đồ trên trang Liên hệ được tạo tự động từ
                        dòng <span className="font-medium text-foreground">"Địa chỉ"</span> ở phần
                        Thông tin liên hệ phía trên. Chỉ cần chỉnh sửa địa chỉ cho đúng là bản đồ,
                        nút <span className="font-medium text-foreground">Chỉ đường</span> và
                        <span className="font-medium text-foreground"> Mở Google Maps</span> sẽ hoạt động chính xác.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 text-sm">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Địa chỉ hiện tại</span>
                      <p className="mt-1 font-medium">
                        {contact.info.find((i) => i.label === "Địa chỉ")?.value || "Chưa có địa chỉ"}
                      </p>
                    </div>
                  </Section>
                  <SaveBar page="contact" />
                </>
              )}

              {/* SEO & FAVICON */}
              {tab === "seo" && (
                <>
                  <Section icon={SearchIcon} title="Thẻ SEO" description="Tiêu đề và mô tả hiển thị trên Google, mạng xã hội">
                    <AdminField label="Tiêu đề trang (title)" value={settings.siteTitle} onChange={(v) => setSettings({ ...settings, siteTitle: v })} />
                    <p className="-mt-3 text-xs text-muted-foreground">Nên dưới 60 ký tự. Hiện tại: {settings.siteTitle.length} ký tự.</p>
                    <AdminArea label="Mô tả (description)" value={settings.description} onChange={(v) => setSettings({ ...settings, description: v })} />
                    <p className="-mt-3 text-xs text-muted-foreground">Nên dưới 160 ký tự. Hiện tại: {settings.description.length} ký tự.</p>
                    <AdminField label="Từ khoá (keywords, ngăn cách bằng dấu phẩy)" value={settings.keywords ?? ""} onChange={(v) => setSettings({ ...settings, keywords: v })} />
                  </Section>
                  <Section icon={ImageIcon} title="Favicon" description="Biểu tượng nhỏ hiển thị trên tab trình duyệt">
                    <AdminImage label="Favicon (khuyến nghị 512 x 512, PNG)" folder="settings" value={settings.faviconUrl} onChange={(v) => setSettings({ ...settings, faviconUrl: v })} />
                  </Section>
                  <Section icon={ImageIcon} title="Ảnh chia sẻ mạng xã hội (OG Image)" description="Ảnh hiển thị khi chia sẻ link lên Facebook, Zalo...">
                    <AdminImage label="OG Image (khuyến nghị 1200 x 630)" folder="settings" value={settings.ogImageUrl} onChange={(v) => setSettings({ ...settings, ogImageUrl: v })} />
                  </Section>
                  <SaveBar page="seo" />
                </>
              )}


              {/* MESSAGES */}
              {tab === "messages" && (
                <Section icon={MessageSquare} title={`Tin nhắn liên hệ (${messages.length})`} description={unreadCount > 0 ? `${unreadCount} tin chưa đọc` : "Tất cả đã đọc"}>
                  {messages.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Chưa có tin nhắn nào.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-lg border p-4 transition-colors ${
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
                </Section>
              )}

              {/* GUIDE */}
              {tab === "guide" && <AdminGuide />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
