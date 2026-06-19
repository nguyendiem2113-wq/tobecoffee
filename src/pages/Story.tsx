import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getPageContent } from "@/lib/supabase";
import { StoryContent, defaultStoryContent } from "@/lib/content";

const Story = () => {
  const [storyContent, setStoryContent] = useState<StoryContent>(defaultStoryContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStory() {
      // ✅ ĐÃ SỬA LỖI Ở ĐÂY: Dùng ?? thay vì truyền làm tham số thứ 2
      const content = (await getPageContent<StoryContent>("story")) ?? defaultStoryContent;
      setStoryContent(content);
      setLoading(false);
    }
    fetchStory();
  }, []);

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Đang tải nội dung...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero banner */}
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">{storyContent.hero.title}</h1>
          <p className="font-body text-primary-foreground/70 text-lg">{storyContent.hero.subtitle}</p>
        </div>
      </section>

      {/* Mục Tiêu - Quote */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 italic">Mục Tiêu</h2>
          <div className="relative">
            <span className="text-primary text-6xl font-serif absolute -top-4 -left-4">"</span>
            <p className="font-body text-lg md:text-xl text-muted-foreground italic leading-relaxed px-8">
              {storyContent.goal ||
                "Trở thành nhà cung ứng cà phê chất lượng tốt nhất và người đồng hành uy tín hàng đầu cho các đối tác là chuỗi và thương hiệu F&B tại Việt Nam."}
            </p>
            <span className="text-primary text-6xl font-serif absolute -bottom-8 -right-4">"</span>
          </div>
        </div>
      </section>

      {/* Nhiệm Vụ - 3 cards */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">Nhiệm Vụ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storyContent.missions.map((m) => (
              <div key={m.title} className="bg-card p-8 rounded-sm border border-border text-center">
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className="font-heading text-lg font-bold mb-4 leading-snug">{m.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split section - Image + stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-sm">
            <img
              src={storyContent.hero.imageUrl || "https://via.placeholder.com/960x1280"}
              alt="Thu hoạch cà phê"
              className="w-full h-[500px] object-cover transition-all duration-700"
              loading="lazy"
              width={960}
              height={1280}
            />
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Tại Sao Chọn <span className="text-primary">TOBE</span>?
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              TOBE tập trung phát triển vùng canh tác và chuẩn hóa quy trình sản xuất để giới thiệu đến đối tác — khách hàng hương vị cà phê tuyệt vời đến từ nông trại Lâm Đồng.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {storyContent.stats.map((s) => (
                <div key={s.number}>
                  <p className="font-heading text-3xl md:text-4xl font-bold text-primary">{s.number}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dịch Vụ - with real images */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">Dịch Vụ</h2>
          <p className="font-body text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Với mỗi sản phẩm cà phê gửi đến quý đối tác — khách hàng, đội ngũ TOBE gửi vào đó sự tỉ mỉ và tận tâm để đem đến trải nghiệm dịch vụ tốt nhất.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storyContent.services.map((s) => (
              <div key={s.title} className="bg-card border border-border rounded-sm overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.imgUrl || "https://via.placeholder.com/800x600"}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="p-6">
                  <p className="font-body text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">
                    {s.label}
                  </p>
                  <h3 className="font-heading text-lg font-bold mb-3">{s.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  <span className="font-body text-sm text-primary font-semibold cursor-pointer hover:underline"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Story;