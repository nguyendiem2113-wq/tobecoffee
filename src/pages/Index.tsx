import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import heroImg from "@/assets/hero-coffee-field.jpg";
import aboutImg from "@/assets/about-pourover.jpg";
import statsBg from "@/assets/stats-bg.jpg";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import productPulseBold from "@/assets/product-pulse-bold.jpg";
import productPauseDrip from "@/assets/product-pause-drip.jpg";
import productBrewBold from "@/assets/product-brew-bold.jpg";
import productDripBag from "@/assets/product-drip-bag.jpg";
import productPauseBox from "@/assets/product-pause-box.jpg";
import productCore from "@/assets/product-core.jpg";

const productCategories = [
  { img: productCore, label: "CÀ PHÊ NHÂN XANH", title: "Cà phê nhân xanh\nNguyên liệu chất lượng cao" },
  { img: productPulseBold, label: "CÀ PHÊ HẠT RANG", title: "Cà phê hạt rang\nRang mộc nguyên chất" },
  { img: productBrewBold, label: "CÀ PHÊ BỘT", title: "Cà phê bột\nXay mịn truyền thống" },
  { img: productPauseDrip, label: "CÀ PHÊ Ủ LẠNH", title: "Cà phê ủ lạnh\nCold Brew đậm vị" },
  { img: productDripBag, label: "CÀ PHÊ TÚI LỌC", title: "Cà phê túi lọc (Drip-bag)\nTiện lợi mọi lúc mọi nơi" },
  { img: productPauseBox, label: "CÀ PHÊ HOÀ TAN", title: "Cà phê hoà tan\nNhanh chóng & thơm ngon" },
];

const stats = [
  { number: "600+", label: "Nông hộ liên kết sản xuất, kinh doanh và trồng trọt bền vững" },
  { number: "2000+", label: "Tấn nguyên liệu chất lượng cao được sản xuất mỗi năm" },
  { number: "150+", label: "Tấn cà phê rang xay cung ứng cho khách hàng mỗi năm" },
];

const blogPosts = [
  { img: blog1, title: "Hành trình khám phá vùng cà phê Đắk Lắk cùng TOBE", excerpt: "Theo chân đội ngũ TOBE đến tận vườn cà phê để tuyển chọn những hạt tốt nhất từ vùng cao nguyên..." },
  { img: blog2, title: "Nghệ thuật pha cà phê: Bí quyết từ chuyên gia TOBE", excerpt: "Chia sẻ những bí quyết pha chế đơn giản để có tách cà phê hoàn hảo tại nhà..." },
  { img: blog3, title: "TOBE ra mắt dòng sản phẩm Premium mới", excerpt: "Dòng cà phê cao cấp mới với hương vị độc đáo, đánh dấu bước phát triển mới..." },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <img
    src={heroImg}
    alt="Cánh đồng cà phê Việt Nam"
    className="
      absolute inset-0 w-full h-full 
      object-cover 
      object-[center_30%] sm:object-center
      scale-110 sm:scale-100
    "
    width={1920}
    height={1080}
    loading="eager"
  />

  {/* Overlay gradient cho dễ đọc */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

  {/* Content */}
  <div className="relative z-10 text-center px-4 max-w-3xl">
    
    
  </div>
</section>

    {/* About - Split screen */}
    <section className="py-20">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="overflow-hidden">
          <img
            src={aboutImg}
            alt="Pha cà phê pour-over"
            className="w-full h-[400px] lg:h-[500px] object-cover"
            loading="lazy"
            width={960}
            height={1080}
          />
        </div>
        <div>
          <p className="font-body text-sm font-semibold text-primary uppercase tracking-widest mb-3">Về chúng tôi</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Coffee Is In Our Blood!
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-5">
            Tại TOBE chúng tôi tập trung mọi nguồn lực và đam mê để hướng đến chế biến sâu cà phê Việt Nam. Mang đến thị trường sản phẩm cà phê hảo hạng — tiện lợi và ngon thuần khiết.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            Từ vùng nguyên liệu Lâm Đồng, TOBE liên kết với hơn 600 hộ nông dân để đảm bảo nguồn cà phê chất lượng cao nhất, mang hương vị Việt Nam ra thế giới.
          </p>
          <Link
            to="/story"
            className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-sm uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
          >
            Xem thêm về chúng tôi
          </Link>
        </div>
      </div>
    </section>

    {/* DANH MỤC SẢN PHẨM - 6 cards (3x2) */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12 uppercase tracking-wider">
          Danh mục sản phẩm
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((cat) => (
            <Link
              key={cat.title}
              to="/product"
              className="group relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
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
      <img
        src={statsBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        width={1920}
        height={800}
      />
      <div className="absolute inset-0 bg-foreground/70" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((s) => (
            <div key={s.number}>
              <p className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">
                {s.number}
              </p>
              <p className="font-body text-primary-foreground/80 text-sm leading-relaxed max-w-xs mx-auto">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    
    
  </Layout>
);

export default Index;
