import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { getPageContent, updatePageContent } from "@/lib/supabase";
import { uploadPageImage } from "@/lib/pageData";
import {
  allCategories,
  defaultIndexContent,
  defaultStoryContent,
  defaultProductPageContent,
  defaultBlogContent,
  defaultContactContent,
  formatPrice,
  origins,
  ProductItem,
  IndexContent,
  StoryContent,
  ProductPageContent,
  BlogContent,
  BlogPost,
  ContactContent,
} from "@/lib/content";

type PageId = "home" | "story" | "product" | "blog" | "contact";

const pages: { id: PageId; label: string }[] = [
  { id: "home", label: "Trang chủ" },
  { id: "story", label: "Giới thiệu" },
  { id: "product", label: "Sản phẩm" },
  { id: "blog", label: "Tin tức" },
  { id: "contact", label: "Liên hệ" },
];

const Admin = () => {
  const [activePage, setActivePage] = useState<PageId>("home");
  const [isSaving, setIsSaving] = useState(false);

  // Khởi tạo States ban đầu bằng dữ liệu tĩnh mặc định
  const [indexContent, setIndexContent] = useState<IndexContent>(defaultIndexContent);
  const [storyContent, setStoryContent] = useState<StoryContent>(defaultStoryContent);
  const [productPageContent, setProductPageContent] = useState<ProductPageContent>(defaultProductPageContent);
  const [blogContent, setBlogContent] = useState<BlogContent>(defaultBlogContent);
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent);

  const [jsonBuffer, setJsonBuffer] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Kéo dữ liệu dynamic từ Supabase về thay thế hoàn toàn localStorage
  useEffect(() => {
    async function initCMSData() {
      const [idx, sty, prd, blg, ctc] = await Promise.all([
        getPageContent<IndexContent>("index", defaultIndexContent),
        getPageContent<StoryContent>("story", defaultStoryContent),
        getPageContent<ProductPageContent>("product", defaultProductPageContent),
        getPageContent<BlogContent>("blog", defaultBlogContent),
        getPageContent<ContactContent>("contact", defaultContactContent),
      ]);

      setIndexContent(idx);
      setStoryContent(sty);
      setProductPageContent(prd);
      setBlogContent(blg);
      setContactContent(ctc);
    }
    initCMSData();
  }, []);

  // Hàm trigger đồng bộ hóa dữ liệu State hiện tại lên Supabase Cloud
  const handleCloudSave = async (target: "index" | "story" | "product" | "blog" | "contact") => {
    setIsSaving(true);
    let payload: IndexContent | StoryContent | ProductPageContent | BlogContent | ContactContent;

    if (target === "index") payload = indexContent;
    if (target === "story") payload = storyContent;
    if (target === "product") payload = productPageContent;
    if (target === "blog") payload = blogContent;
    if (target === "contact") payload = contactContent;

    const success = await updatePageContent(target, payload);
    setIsSaving(false);

    if (success) {
      alert(`Đồng bộ thành công dữ liệu trang [${target}] lên Cloud!`);
    } else {
      alert("Lưu thất bại. Vui lòng kiểm tra lại cấu hình Policy RLS trên database.");
    }
  };

  // Quản lý danh sách sản phẩm lấy từ ProductPageContent
  const products = useMemo(() => productPageContent.products || [], [productPageContent.products]);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id ?? 1);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number>(blogContent.posts[0]?.id ?? 1);
  
  // State for Story component selection
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  
  // State for Contact component selection
  const [selectedContactItemIndex, setSelectedContactItemIndex] = useState<number>(0);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const selectedBlogPost = useMemo(
    () => blogContent.posts.find((post) => post.id === selectedBlogPostId) || blogContent.posts[0],
    [blogContent.posts, selectedBlogPostId]
  );

  const sortedBlogPosts = useMemo(
    () => [...blogContent.posts].sort((a, b) => b.date.localeCompare(a.date)),
    [blogContent.posts]
  );

  useEffect(() => {
    if (!blogContent.posts.some((post) => post.id === selectedBlogPostId) && blogContent.posts.length > 0) {
      setSelectedBlogPostId(blogContent.posts[0].id);
    }
  }, [blogContent.posts, selectedBlogPostId]);

  // Cập nhật thông tin chi tiết của từng sản phẩm
  const updateProductField = <K extends keyof ProductItem>(key: K, value: ProductItem[K]) => {
    setProductPageContent((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === selectedProductId ? { ...product, [key]: value } : product
      ),
    }));
  };

  const updateBlogField = (key: "title" | "subtitle", value: string) => {
    setBlogContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateBlogPostField = (key: keyof BlogPost, value: string) => {
    setBlogContent((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post.id === selectedBlogPostId ? { ...post, [key]: value } : post
      ),
    }));
  };

  const handleBlogImageUpload = async (file: File | null) => {
    if (!file || !selectedBlogPost) return;
    setIsUploadingImage(true);
    setUploadStatus("");

    try {
      const publicUrl = await uploadPageImage(file, "blog");
      updateBlogPostField("imgUrl", publicUrl);
      setUploadStatus("Upload ảnh thành công.");
    } catch (error) {
      console.error(error);
      setUploadStatus("Upload ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addBlogPost = () => {
    const nextId = Math.max(0, ...blogContent.posts.map((post) => post.id)) + 1;
    const newPost = {
      id: nextId,
      title: "Bài viết mới",
      excerpt: "Tóm tắt ngắn gọn về bài viết mới.",
      date: new Date().toISOString().slice(0, 10),
      topic: "Tin tức",
      body: "Nội dung bài viết chi tiết sẽ được cập nhật tại đây.",
      imgUrl: "",
    };
    setBlogContent((prev) => ({ ...prev, posts: [newPost, ...prev.posts] }));
    setSelectedBlogPostId(nextId);
  };

  const deleteBlogPost = (id: number) => {
    setBlogContent((prev) => {
      const updated = prev.posts.filter((post) => post.id !== id);
      return { ...prev, posts: updated };
    });
    if (selectedBlogPostId === id && blogContent.posts.length > 1) {
      setSelectedBlogPostId(blogContent.posts.find((post) => post.id !== id)?.id ?? 1);
    }
  };

  // Cập nhật text của trang sản phẩm (hero title / subtitle)
  const handleProductPageHero = (key: "title" | "subtitle", value: string) => {
    setProductPageContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  const saveJsonBufferTo = (target: "index" | "story" | "blog" | "contact") => {
    try {
      const parsed = JSON.parse(jsonBuffer);
      if (target === "index") setIndexContent(parsed);
      if (target === "story") setStoryContent(parsed);
      if (target === "blog") setBlogContent(parsed);
      if (target === "contact") setContactContent(parsed);
      alert("Đã cập nhật vào state bộ nhớ tạm, nhấn nút Lưu Cloud để ghi dữ liệu.");
      setJsonBuffer("");
    } catch (e) {
      alert("JSON không hợp lệ: " + (e as Error).message);
    }
  };

  // Story handlers
  const updateMissionField = (key: string, value: string) => {
    setStoryContent((prev) => ({
      ...prev,
      missions: prev.missions.map((mission, idx) =>
        idx === selectedMissionIndex ? { ...mission, [key]: value } : mission
      ),
    }));
  };

  const updateServiceField = (key: string, value: string) => {
    setStoryContent((prev) => ({
      ...prev,
      services: prev.services.map((service, idx) =>
        idx === selectedServiceIndex ? { ...service, [key]: value } : service
      ),
    }));
  };

  const updateStoryStatField = (index: number, key: "number" | "label", value: string) => {
    setStoryContent((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, idx) =>
        idx === index ? { ...stat, [key]: value } : stat
      ),
    }));
  };

  const addMission = () => {
    setStoryContent((prev) => ({
      ...prev,
      missions: [...prev.missions, { icon: "⭐", title: "Nhiệm vụ mới", desc: "Mô tả chi tiết..." }],
    }));
    setSelectedMissionIndex(storyContent.missions.length);
  };

  const deleteMission = (index: number) => {
    setStoryContent((prev) => ({
      ...prev,
      missions: prev.missions.filter((_, idx) => idx !== index),
    }));
    if (selectedMissionIndex >= storyContent.missions.length - 1 && selectedMissionIndex > 0) {
      setSelectedMissionIndex(selectedMissionIndex - 1);
    }
  };

  const addService = () => {
    setStoryContent((prev) => ({
      ...prev,
      services: [...prev.services, { imgUrl: "", label: "Dịch vụ mới", title: "Tiêu đề dịch vụ", desc: "Mô tả dịch vụ..." }],
    }));
    setSelectedServiceIndex(storyContent.services.length);
  };

  const deleteService = (index: number) => {
    setStoryContent((prev) => ({
      ...prev,
      services: prev.services.filter((_, idx) => idx !== index),
    }));
    if (selectedServiceIndex >= storyContent.services.length - 1 && selectedServiceIndex > 0) {
      setSelectedServiceIndex(selectedServiceIndex - 1);
    }
  };

  const handleServiceImageUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploadingImage(true);
    setUploadStatus("");

    try {
      const publicUrl = await uploadPageImage(file, "story");
      updateServiceField("imgUrl", publicUrl);
      setUploadStatus("Upload ảnh dịch vụ thành công.");
    } catch (error) {
      console.error(error);
      setUploadStatus("Upload ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const updateStoryHeroField = (key: "title" | "subtitle" | "imageUrl", value: string) => {
    setStoryContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  // Contact handlers
  const updateContactItemField = (key: "label" | "value", value: string) => {
    setContactContent((prev) => ({
      ...prev,
      info: prev.info.map((item, idx) =>
        idx === selectedContactItemIndex ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addContactItem = () => {
    setContactContent((prev) => ({
      ...prev,
      info: [...prev.info, { label: "Nhãn mới", value: "Giá trị mới..." }],
    }));
    setSelectedContactItemIndex(contactContent.info.length);
  };

  const deleteContactItem = (index: number) => {
    setContactContent((prev) => ({
      ...prev,
      info: prev.info.filter((_, idx) => idx !== index),
    }));
    if (selectedContactItemIndex >= contactContent.info.length - 1 && selectedContactItemIndex > 0) {
      setSelectedContactItemIndex(selectedContactItemIndex - 1);
    }
  };

  const updateContactHeroField = (key: "title" | "subtitle" | "imageUrl", value: string) => {
    setContactContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  return (
    <Layout>
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Bảng quản trị</h1>
          <p className="font-body text-primary-foreground/70 text-lg">
            Quản lý nội dung trang và chỉnh sửa chi tiết từng component qua Supabase Cloud.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {pages.map((p) => (
              <Button
                key={p.id}
                variant={activePage === p.id ? "default" : "secondary"}
                size="sm"
                onClick={() => {
                  setActivePage(p.id);
                  setJsonBuffer("");
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-lg font-bold mb-4">Các trang</h2>
              <p className="font-body text-sm text-muted-foreground">
                Chọn mục để chỉnh sửa nội dung hiển thị của trang.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-semibold mb-3">Trang</h3>
              <div className="space-y-2">
                {pages.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePage(p.id);
                      setJsonBuffer("");
                    }}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      activePage === p.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-secondary text-primary-foreground/80"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-semibold mb-3">Danh sách sản phẩm</h3>
              <div className="space-y-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      product.id === selectedProductId
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-secondary text-primary-foreground/80"
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            {activePage === "home" && (
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">Chỉnh sửa Trang chủ</h2>
                  <Button variant="default" onClick={() => handleCloudSave("index")} disabled={isSaving}>
                    {isSaving ? "Đang lưu..." : "Lưu lên Cloud"}
                  </Button>
                </div>
                <div className="grid gap-6">
                  <label className="space-y-2">
                    <span className="font-semibold">Tiêu đề Hero</span>
                    <input
                      type="text"
                      value={indexContent.hero.title}
                      onChange={(e) => setIndexContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                      className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="font-semibold">Mô tả Hero</span>
                    <textarea
                      rows={3}
                      value={indexContent.hero.subtitle}
                      onChange={(e) => setIndexContent((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                      className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Dữ liệu trang (JSON)</span>
                    <textarea
                      rows={10}
                      value={jsonBuffer || JSON.stringify(indexContent, null, 2)}
                      onChange={(e) => setJsonBuffer(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none font-mono"
                    />
                  </label>
                  <div className="flex gap-3">
                    <Button onClick={() => saveJsonBufferTo("index")}>Cập nhật JSON</Button>
                    <Button variant="secondary" onClick={() => setJsonBuffer(JSON.stringify(indexContent, null, 2))}>
                      Load hiện tại
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activePage === "story" && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-2xl font-bold">Chỉnh sửa Trang Giới thiệu</h2>
                      <p className="text-sm text-muted-foreground mt-2">Quản lý hero, nhiệm vụ, thống kê và dịch vụ.</p>
                    </div>
                    <Button variant="default" onClick={() => handleCloudSave("story")} disabled={isSaving}>
                      {isSaving ? "Đang lưu..." : "Lưu lên Cloud"}
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    <label className="space-y-2">
                      <span className="font-semibold">Tiêu đề Hero</span>
                      <input
                        type="text"
                        value={storyContent.hero.title}
                        onChange={(e) => updateStoryHeroField("title", e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-semibold">Mô tả Hero</span>
                      <textarea
                        rows={3}
                        value={storyContent.hero.subtitle}
                        onChange={(e) => updateStoryHeroField("subtitle", e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-semibold">URL ảnh Hero</span>
                      <input
                        type="text"
                        value={storyContent.hero.imageUrl ?? ""}
                        onChange={(e) => updateStoryHeroField("imageUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                </div>

                {/* Missions Section */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-2xl font-bold">Quản lý Nhiệm vụ</h2>
                      <p className="text-sm text-muted-foreground mt-2">Thêm, sửa, xóa các nhiệm vụ của tổ chức.</p>
                    </div>
                    <Button onClick={addMission}>Thêm nhiệm vụ mới</Button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-3xl border border-border bg-background p-4">
                      <h3 className="font-semibold mb-3">Danh sách Nhiệm vụ</h3>
                      <div className="space-y-2">
                        {storyContent.missions.map((mission, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedMissionIndex(idx)}
                            className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                              idx === selectedMissionIndex
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-secondary text-primary-foreground/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{mission.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {storyContent.missions[selectedMissionIndex] && (
                      <div className="rounded-3xl border border-border bg-background p-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <h3 className="font-heading text-xl font-bold">Chỉnh sửa Nhiệm vụ</h3>
                          <Button variant="destructive" onClick={() => deleteMission(selectedMissionIndex)}>
                            Xóa
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          <label className="space-y-2">
                            <span className="font-semibold">Icon (Emoji)</span>
                            <input
                              type="text"
                              value={storyContent.missions[selectedMissionIndex].icon}
                              onChange={(e) => updateMissionField("icon", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                              maxLength={2}
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Tiêu đề Nhiệm vụ</span>
                            <input
                              type="text"
                              value={storyContent.missions[selectedMissionIndex].title}
                              onChange={(e) => updateMissionField("title", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Mô tả Nhiệm vụ</span>
                            <textarea
                              rows={5}
                              value={storyContent.missions[selectedMissionIndex].desc}
                              onChange={(e) => updateMissionField("desc", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services Section */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-2xl font-bold">Quản lý Dịch vụ</h2>
                      <p className="text-sm text-muted-foreground mt-2">Thêm, sửa, xóa các dịch vụ của TOBE.</p>
                    </div>
                    <Button onClick={addService}>Thêm dịch vụ mới</Button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-3xl border border-border bg-background p-4">
                      <h3 className="font-semibold mb-3">Danh sách Dịch vụ</h3>
                      <div className="space-y-2">
                        {storyContent.services.map((service, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedServiceIndex(idx)}
                            className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                              idx === selectedServiceIndex
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-secondary text-primary-foreground/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{service.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {storyContent.services[selectedServiceIndex] && (
                      <div className="rounded-3xl border border-border bg-background p-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <h3 className="font-heading text-xl font-bold">Chỉnh sửa Dịch vụ</h3>
                          <Button variant="destructive" onClick={() => deleteService(selectedServiceIndex)}>
                            Xóa
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          <label className="space-y-2">
                            <span className="font-semibold">Nhãn Dịch vụ</span>
                            <input
                              type="text"
                              value={storyContent.services[selectedServiceIndex].label}
                              onChange={(e) => updateServiceField("label", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Tiêu đề Dịch vụ</span>
                            <input
                              type="text"
                              value={storyContent.services[selectedServiceIndex].title}
                              onChange={(e) => updateServiceField("title", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Mô tả Dịch vụ</span>
                            <textarea
                              rows={4}
                              value={storyContent.services[selectedServiceIndex].desc}
                              onChange={(e) => updateServiceField("desc", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">URL ảnh Dịch vụ</span>
                            <input
                              type="text"
                              value={storyContent.services[selectedServiceIndex].imgUrl ?? ""}
                              onChange={(e) => updateServiceField("imgUrl", e.target.value)}
                              placeholder="https://..."
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Upload ảnh Dịch vụ</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => handleServiceImageUpload(event.target.files?.[0] ?? null)}
                              className="w-full text-sm text-muted-foreground"
                            />
                            <p className="text-xs text-muted-foreground">{isUploadingImage ? "Đang tải ảnh..." : uploadStatus}</p>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <h2 className="font-heading text-2xl font-bold mb-6">Quản lý Thống kê</h2>
                  <div className="space-y-6">
                    {storyContent.stats.map((stat, idx) => (
                      <div key={idx} className="grid gap-4 sm:grid-cols-2 p-4 rounded-lg border border-border bg-background">
                        <label className="space-y-2">
                          <span className="font-semibold">Số liệu</span>
                          <input
                            type="text"
                            value={stat.number}
                            onChange={(e) => updateStoryStatField(idx, "number", e.target.value)}
                            className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            placeholder="VD: 600+"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="font-semibold">Mô tả</span>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => updateStoryStatField(idx, "label", e.target.value)}
                            className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            placeholder="Mô tả chi tiết"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* JSON Editor */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <h3 className="font-heading text-lg font-bold mb-3">Dữ liệu trang (JSON)</h3>
                  <label className="space-y-2">
                    <textarea
                      rows={10}
                      value={jsonBuffer || JSON.stringify(storyContent, null, 2)}
                      onChange={(e) => setJsonBuffer(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none font-mono"
                    />
                  </label>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => saveJsonBufferTo("story")}>Cập nhật JSON</Button>
                    <Button variant="secondary" onClick={() => setJsonBuffer(JSON.stringify(storyContent, null, 2))}>
                      Load hiện tại
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activePage === "product" && (
              <div>
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold">Chỉnh sửa Hero trang sản phẩm</h2>
                    <Button variant="default" onClick={() => handleCloudSave("product")} disabled={isSaving}>
                      {isSaving ? "Đang lưu..." : "Lưu lên Cloud"}
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    <label className="space-y-2">
                      <span className="font-semibold">Tiêu đề</span>
                      <input
                        type="text"
                        value={productPageContent.hero.title}
                        onChange={(event) => handleProductPageHero("title", event.target.value)}
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-semibold">Mô tả nhỏ</span>
                      <textarea
                        rows={4}
                        value={productPageContent.hero.subtitle}
                        onChange={(event) => handleProductPageHero("subtitle", event.target.value)}
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                </div>

                {selectedProduct && (
                  <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                    <h2 className="font-heading text-2xl font-bold mb-6">Chỉnh sửa thông tin sản phẩm</h2>
                    <div className="grid gap-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                          <span className="font-semibold">Tên sản phẩm</span>
                          <input
                            type="text"
                            value={selectedProduct.name}
                            onChange={(event) => updateProductField("name", event.target.value)}
                            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="font-semibold">Giá</span>
                          <input
                            type="number"
                            value={selectedProduct.price}
                            onChange={(event) => updateProductField("price", Number(event.target.value))}
                            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </label>
                      </div>

                      <label className="space-y-2">
                        <span className="font-semibold">Mô tả ngắn</span>
                        <textarea
                          rows={3}
                          value={selectedProduct.desc}
                          onChange={(event) => updateProductField("desc", event.target.value)}
                          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="font-semibold">Chi tiết sản phẩm</span>
                        <textarea
                          rows={5}
                          value={selectedProduct.details}
                          onChange={(event) => updateProductField("details", event.target.value)}
                          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                          <span className="font-semibold">Danh mục</span>
                          <select
                            value={selectedProduct.category}
                            onChange={(event) => updateProductField("category", event.target.value)}
                            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          >
                            {allCategories.filter((item) => item !== "Tất cả").map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2">
                          <span className="font-semibold">Xuất xứ</span>
                          <select
                            value={selectedProduct.origin}
                            onChange={(event) => updateProductField("origin", event.target.value)}
                            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          >
                            {origins.filter((item) => item !== "Tất cả").map((origin) => (
                              <option key={origin} value={origin}>
                                {origin}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePage === "blog" && (
              <div className="space-y-8">
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-2xl font-bold">Chỉnh sửa Trang Tin tức</h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        Quản lý danh sách bài viết, tiêu đề trang và nội dung chi tiết bài viết.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={addBlogPost}>Thêm bài viết mới</Button>
                      <Button variant="default" onClick={() => handleCloudSave("blog")} disabled={isSaving}>
                        {isSaving ? "Đang lưu..." : "Lưu lên Cloud"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                    <div className="space-y-4">
                      <label className="space-y-2">
                        <span className="font-semibold">Tiêu đề trang</span>
                        <input
                          type="text"
                          value={blogContent.title}
                          onChange={(e) => updateBlogField("title", e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="font-semibold">Mô tả trang</span>
                        <input
                          type="text"
                          value={blogContent.subtitle}
                          onChange={(e) => updateBlogField("subtitle", e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </label>

                      <div className="rounded-3xl border border-border bg-background p-4">
                        <h3 className="font-semibold mb-3">Danh sách bài viết</h3>
                        <div className="space-y-2">
                          {sortedBlogPosts.map((post) => (
                            <button
                              key={post.id}
                              type="button"
                              onClick={() => setSelectedBlogPostId(post.id)}
                              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                                post.id === selectedBlogPostId
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "hover:bg-secondary text-primary-foreground/80"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span>{post.title}</span>
                                <span className="text-[11px] text-muted-foreground">{post.date}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedBlogPost && (
                      <div className="rounded-3xl border border-border bg-background p-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div>
                            <h3 className="font-heading text-xl font-bold">Chỉnh sửa bài viết</h3>
                            <p className="text-sm text-muted-foreground">Sửa nội dung chi tiết hoặc xóa bài viết hiện tại.</p>
                          </div>
                          <Button variant="destructive" onClick={() => deleteBlogPost(selectedBlogPost.id)}>
                            Xóa bài viết
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <label className="space-y-2">
                            <span className="font-semibold">Tiêu đề bài viết</span>
                            <input
                              type="text"
                              value={selectedBlogPost.title}
                              onChange={(e) => updateBlogPostField("title", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Tóm tắt</span>
                            <textarea
                              rows={3}
                              value={selectedBlogPost.excerpt}
                              onChange={(e) => updateBlogPostField("excerpt", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Chủ đề</span>
                            <input
                              type="text"
                              value={selectedBlogPost.topic}
                              onChange={(e) => updateBlogPostField("topic", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Ngày đăng</span>
                            <input
                              type="date"
                              value={selectedBlogPost.date}
                              onChange={(e) => updateBlogPostField("date", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Nội dung chi tiết</span>
                            <textarea
                              rows={8}
                              value={selectedBlogPost.body}
                              onChange={(e) => updateBlogPostField("body", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">URL ảnh bài viết</span>
                            <input
                              type="text"
                              value={selectedBlogPost.imgUrl ?? ""}
                              onChange={(e) => updateBlogPostField("imgUrl", e.target.value)}
                              placeholder="https://..."
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Upload ảnh bài viết</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => handleBlogImageUpload(event.target.files?.[0] ?? null)}
                              className="w-full text-sm text-muted-foreground"
                            />
                            <p className="text-xs text-muted-foreground">{isUploadingImage ? "Đang tải ảnh..." : uploadStatus}</p>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <h3 className="font-heading text-lg font-bold mb-3">Dữ liệu bài viết (JSON)</h3>
                  <label className="space-y-2">
                    <textarea
                      rows={10}
                      value={jsonBuffer || JSON.stringify(blogContent, null, 2)}
                      onChange={(e) => setJsonBuffer(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none font-mono"
                    />
                  </label>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => saveJsonBufferTo("blog")}>Cập nhật JSON</Button>
                    <Button variant="secondary" onClick={() => setJsonBuffer(JSON.stringify(blogContent, null, 2))}>
                      Load hiện tại
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <h3 className="font-heading text-lg font-bold mb-3">Live preview</h3>
                  <div className="rounded-3xl border border-border bg-background p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-primary/80 mb-3">{blogContent.title}</p>
                    <h3 className="font-heading text-2xl font-bold mb-4">{selectedBlogPost?.title ?? "Chọn bài viết để xem preview"}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{selectedBlogPost?.excerpt}</p>
                    {selectedBlogPost?.imgUrl ? (
                      <div className="mb-4 overflow-hidden rounded-3xl border border-border bg-secondary">
                        <img src={selectedBlogPost.imgUrl} alt={selectedBlogPost.title} className="w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="space-y-4 text-sm text-muted-foreground whitespace-pre-line">
                      <p>{selectedBlogPost?.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "contact" && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-2xl font-bold">Chỉnh sửa Trang Liên hệ</h2>
                      <p className="text-sm text-muted-foreground mt-2">Quản lý hero và thông tin liên lạc.</p>
                    </div>
                    <Button variant="default" onClick={() => handleCloudSave("contact")} disabled={isSaving}>
                      {isSaving ? "Đang lưu..." : "Lưu lên Cloud"}
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    <label className="space-y-2">
                      <span className="font-semibold">Tiêu đề Hero</span>
                      <input
                        type="text"
                        value={contactContent.hero.title}
                        onChange={(e) => updateContactHeroField("title", e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-semibold">Mô tả Hero</span>
                      <textarea
                        rows={3}
                        value={contactContent.hero.subtitle}
                        onChange={(e) => updateContactHeroField("subtitle", e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-2xl font-bold">Quản lý Thông tin liên hệ</h2>
                      <p className="text-sm text-muted-foreground mt-2">Thêm, sửa, xóa các thông tin liên lạc như địa chỉ, hotline, email.</p>
                    </div>
                    <Button onClick={addContactItem}>Thêm thông tin mới</Button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-3xl border border-border bg-background p-4">
                      <h3 className="font-semibold mb-3">Danh sách Thông tin</h3>
                      <div className="space-y-2">
                        {contactContent.info.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedContactItemIndex(idx)}
                            className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                              idx === selectedContactItemIndex
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-secondary text-primary-foreground/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{item.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {contactContent.info[selectedContactItemIndex] && (
                      <div className="rounded-3xl border border-border bg-background p-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <h3 className="font-heading text-xl font-bold">Chỉnh sửa Thông tin</h3>
                          <Button variant="destructive" onClick={() => deleteContactItem(selectedContactItemIndex)}>
                            Xóa
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          <label className="space-y-2">
                            <span className="font-semibold">Nhãn (Label)</span>
                            <input
                              type="text"
                              value={contactContent.info[selectedContactItemIndex].label}
                              onChange={(e) => updateContactItemField("label", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                              placeholder="VD: Địa chỉ, Hotline, Email"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="font-semibold">Giá trị (Value)</span>
                            <textarea
                              rows={5}
                              value={contactContent.info[selectedContactItemIndex].value}
                              onChange={(e) => updateContactItemField("value", e.target.value)}
                              className="w-full rounded-md border border-input bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                              placeholder="VD: 123 Đường ABC, TP. HCM"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* JSON Editor */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                  <h3 className="font-heading text-lg font-bold mb-3">Dữ liệu trang (JSON)</h3>
                  <label className="space-y-2">
                    <textarea
                      rows={10}
                      value={jsonBuffer || JSON.stringify(contactContent, null, 2)}
                      onChange={(e) => setJsonBuffer(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none font-mono"
                    />
                  </label>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => saveJsonBufferTo("contact")}>Cập nhật JSON</Button>
                    <Button variant="secondary" onClick={() => setJsonBuffer(JSON.stringify(contactContent, null, 2))}>
                      Load hiện tại
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold mb-6">Trạng thái dữ liệu</h2>
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Nội dung hiển thị bên dưới là cấu trúc dynamic đang được kéo thời gian thực từ database.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-semibold">Tiêu đề trang sản phẩm</h3>
                    <p className="mt-2 text-sm">{productPageContent.hero.title}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-semibold">Mô tả trang sản phẩm</h3>
                    <p className="mt-2 text-sm">{productPageContent.hero.subtitle}</p>
                  </div>
                </div>
                {selectedProduct && (
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-semibold">Sản phẩm đang chọn</h3>
                    <p className="mt-2 text-sm">{selectedProduct.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatPrice(selectedProduct.price)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;