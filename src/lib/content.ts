//D:\JOBS\tobecoffee\src\lib\content.ts
import heroImg from "@/assets/hero-coffee-field.jpg";
import aboutImg from "@/assets/about-pourover.jpg";
import statsBg from "@/assets/stats-bg.jpg";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import storyImg from "@/assets/story-sourcing.jpg";
import serviceGreen from "@/assets/service-green-beans.jpg";
import serviceRoasting from "@/assets/service-roasting.jpg";
import serviceConsulting from "@/assets/service-consulting.jpg";
import productPulseBold from "@/assets/product-pulse-bold.jpg";
import productPauseDrip from "@/assets/product-pause-drip.jpg";
import productBrewBold from "@/assets/product-brew-bold.jpg";
import productDripBag from "@/assets/product-drip-bag.jpg";
import productPauseBox from "@/assets/product-pause-box.jpg";
import productCore from "@/assets/product-core.jpg";

export type HeroSection = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export type StatItem = {
  number: string;
  label: string;
};

export type ProductCategory = {
  imgUrl?: string;
  label: string;
  title: string;
};

export type BlogPost = {
  id: number;
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  topic: string;
  body: string;
  imgUrl?: string;
};

export type ProductItem = {
  id: string;
  slug?: string;
  name: string;
  desc: string;
  details: string;
  category: string;
  origin: string;
  price: number;
  imgUrl?: string;
};

export type AboutSection = {
  label: string;
  title: string;
  body: string;
  imageUrl?: string;
};

export type IndexContent = {
  hero: HeroSection;
  about?: AboutSection;
  productCategories: ProductCategory[];
  stats: StatItem[];
  statsImage?: string;
  blogTitle?: string;
  blogPosts: BlogPost[];
};

export type StoryContent = {
  hero: HeroSection;
  goal?: string;
  missions: { icon: string; title: string; desc: string }[];
  stats: StatItem[];
  services: { imgUrl?: string; label: string; title: string; desc: string }[];
};

export type ProductPageContent = {
  hero: HeroSection;
  products: ProductItem[];
  /** Hiển thị bộ lọc Xuất xứ trên trang /product (mặc định ẩn) */
  showOrigin?: boolean;
};

export type BlogContent = {
  title: string;
  subtitle: string;
  posts: BlogPost[];
};

export type ContactContent = {
  hero: HeroSection;
  info: { label: string; value: string }[];
  mapEmbed?: string;
};

export const allCategories = [
  "Tất cả",
  "Cà phê nhân xanh",
  "Cà phê hạt rang",
  "Cà phê bột",
  "Cà phê ủ lạnh",
  "Cà phê túi lọc",
  "Cà phê hoà tan",
];

export const origins = ["Tất cả", "Buôn Ma Thuột", "Đà Lạt", "Sơn La", "Bảo Lộc"];

export const defaultIndexContent: IndexContent = {
  hero: {
    title: "Cà phê Việt Nam chuẩn chất lượng",
    subtitle: "Đem tinh túy cà phê từ nông trại đến tay bạn",
    imageUrl: heroImg,
  },
  about: {
    label: "Về chúng tôi",
    title: "Coffee Is In Our Blood!",
    body: "Tại TOBE chúng tôi tập trung mọi nguồn lực và đam mê để hướng đến chế biến sâu cà phê Việt Nam.",
    imageUrl: aboutImg,
  },
  statsImage: statsBg,
  blogTitle: "Góc lắng đọng",
  productCategories: [
    { imgUrl: productCore, label: "CÀ PHÊ NHÂN XANH", title: "Cà phê nhân xanh\nNguyên liệu chất lượng cao" },
    { imgUrl: productPulseBold, label: "CÀ PHÊ HẠT RANG", title: "Cà phê hạt rang\nRang mộc nguyên chất" },
    { imgUrl: productBrewBold, label: "CÀ PHÊ BỘT", title: "Cà phê bột\nXay mịn truyền thống" },
    { imgUrl: productPauseDrip, label: "CÀ PHÊ Ủ LẠNH", title: "Cà phê ủ lạnh\nCold Brew đậm vị" },
    { imgUrl: productDripBag, label: "CÀ PHÊ TÚI LỌC", title: "Cà phê túi lọc (Drip-bag)\nTiện lợi mọi lúc mọi nơi" },
    { imgUrl: productPauseBox, label: "CÀ PHÊ HOÀ TAN", title: "Cà phê hoà tan\nNhanh chóng & thơm ngon" },
  ],
  stats: [
    { number: "600+", label: "Nông hộ liên kết sản xuất, kinh doanh và trồng trọt bền vững" },
    { number: "2000+", label: "Tấn nguyên liệu chất lượng cao được sản xuất mỗi năm" },
    { number: "150+", label: "Tấn cà phê rang xay cung ứng cho khách hàng mỗi năm" },
  ],
  blogPosts: [
    {
      id: 1,
      title: "Hành trình khám phá vùng cà phê Đắk Lắk cùng TOBE",
      excerpt: "Theo chân đội ngũ TOBE đến tận vườn cà phê để tuyển chọn hạt tốt nhất.",
      date: "2026-03-15",
      topic: "Hành trình",
      body: "TOBE đã đi sâu vào từng nông trại cà phê ở Buôn Ma Thuột để chọn lọc hạt chín đều, tươi mới. Bài viết kể lại hành trình thu hoạch, xử lý xanh và tình yêu của các nông dân với cây cà phê.",
      imgUrl: blog1,
    },
    {
      id: 2,
      title: "Nghệ thuật pha cà phê: Bí quyết từ chuyên gia TOBE",
      excerpt: "Chia sẻ những bí quyết pha chế đơn giản để có tách cà phê hoàn hảo tại nhà.",
      date: "2026-03-08",
      topic: "Kiến thức",
      body: "Khám phá công thức, nhiệt độ và kỹ thuật pha phin, pour-over cũng như cách chọn tỷ lệ nước và cà phê phù hợp cho hương vị đậm đà mà vẫn cân bằng.",
      imgUrl: blog2,
    },
    {
      id: 3,
      title: "TOBE ra mắt dòng sản phẩm Premium mới",
      excerpt: "Dòng cà phê cao cấp mới với hương vị độc đáo, đánh dấu bước phát triển của thương hiệu.",
      date: "2026-02-20",
      topic: "Sản phẩm",
      body: "TOBE giới thiệu phiên bản Premium với công thức blend đặc biệt, bao bì sang trọng và hương vị đậm đà, phù hợp làm quà tặng hoặc thưởng thức riêng.",
      imgUrl: blog3,
    },
  ],
};

export const defaultStoryContent: StoryContent = {
  hero: {
    title: "Giới thiệu TOBE",
    subtitle: "Brew Bold, Be TOBE",
    imageUrl: storyImg,
  },
  goal: "Trở thành nhà cung ứng cà phê chất lượng tốt nhất và người đồng hành uy tín hàng đầu cho các đối tác là chuỗi và thương hiệu F&B tại Việt Nam.",
  missions: [
    {
      icon: "🌍",
      title: "Nâng Tầm Giá Trị Cà Phê Việt Trên Bản Đồ Thế Giới",
      desc: "TOBE liên kết với hơn 600 hộ nông dân và nâng cao chất lượng cà phê thông qua mô hình sản xuất bền vững.",
    },
    {
      icon: "🌱",
      title: "Cải Thiện Đời Sống Người Nông Dân Trồng Cà Phê",
      desc: "Công bằng và trách nhiệm với nông dân là cốt lõi cho chuỗi cung ứng cà phê chất lượng của chúng tôi.",
    },
    {
      icon: "☕",
      title: "Để Người Việt Được Thưởng Thức Cà Phê Ngon",
      desc: "TOBE mang hương vị cà phê thuần Việt đến tay người tiêu dùng với trải nghiệm sản phẩm tinh tế.",
    },
  ],
  stats: [
    { number: "90%+", label: "Tỷ lệ quả chín đạt chuẩn sản xuất rang xay nguyên chất" },
    { number: "600+", label: "Nông hộ liên kết trồng & sản xuất nhân xanh chất lượng cao" },
    { number: "2000+", label: "Tấn nguyên liệu chất lượng cao khai thác nguồn cung cả mùa vụ" },
    { number: "150+", label: "Tấn cà phê rang xay cung ứng cho khách hàng mỗi năm" },
  ],
  services: [
    {
      imgUrl: serviceGreen,
      label: "Cung ứng",
      title: "Cung Ứng Cà Phê Nhân Xanh",
      desc: "Nguồn nguyên liệu tốt sẽ tạo nên sản phẩm chất lượng, TOBE cam kết cung ứng nguyên liệu ổn định.",
    },
    {
      imgUrl: serviceRoasting,
      label: "Cung cấp",
      title: "Cung Cấp Cà Phê Rang Xay",
      desc: "Hạt cà phê rang xay tươi mới, phù hợp cho nhiều hình thức thưởng thức và kinh doanh.",
    },
    {
      imgUrl: serviceConsulting,
      label: "Tư vấn giải pháp",
      title: "Tư Vấn Giải Pháp Kinh Doanh Cà Phê",
      desc: "TOBE đồng hành cùng đối tác với giải pháp phát triển kinh doanh cà phê hiệu quả.",
    },
  ],
};

export const defaultProductPageContent: ProductPageContent = {
  showOrigin: false,
  hero: {
    title: " ",
    subtitle: " ",
    imageUrl: "",
  },
  products: [
   
  ],
};

export const defaultBlogContent: BlogContent = {
  title: "Tin tức & Blog",
  subtitle: "Cập nhật kiến thức và câu chuyện cà phê",
  posts: [
    {
      id: 1,
      title: "Cách pha Cold Brew tại nhà đơn giản",
      excerpt: "Hướng dẫn chi tiết cách pha cà phê ủ lạnh ngon chuẩn vị ngay tại nhà với dụng cụ đơn giản.",
      date: "2026-03-15",
      topic: "Cách pha",
      body: "Bài viết đưa bạn từng bước từ chọn nguyên liệu, xay hạt đến thời gian ủ lý tưởng. Cold Brew mang đến trải nghiệm cà phê thơm mượt, dễ uống và hoàn toàn phù hợp với phong cách sống năng động.",
      imgUrl: blog1,
    },
    {
      id: 2,
      title: "Cà phê và Sức khỏe: Những lợi ích bất ngờ",
      excerpt: "Nghiên cứu mới nhất cho thấy cà phê có nhiều lợi ích cho sức khỏe hơn bạn nghĩ.",
      date: "2026-03-08",
      topic: "Sức khỏe",
      body: "Cà phê chứa nhiều chất chống oxy hóa và có thể hỗ trợ cải thiện tinh thần. Trong bài, TOBE giải thích các lợi ích từ hợp chất tự nhiên và lưu ý khi sử dụng sao cho an toàn.",
      imgUrl: blog2,
    },
    {
      id: 3,
      title: "Khám phá vùng cà phê Buôn Ma Thuột",
      excerpt: "Hành trình đến thủ phủ cà phê Việt Nam — nơi sinh ra những hạt Robusta hảo hạng nhất.",
      date: "2026-02-20",
      topic: "Khám phá",
      body: "Đắk Lắk là trái tim của cà phê Việt Nam. Bài viết mở ra câu chuyện người trồng, cách canh tác và những giá trị văn hóa được gìn giữ trong từng hạt cà phê.",
      imgUrl: blog3,
    },
  ],
};

export const defaultContactContent: ContactContent = {
  hero: {
    title: "Liên hệ",
    subtitle: "Chúng tôi luôn sẵn sàng lắng nghe bạn",
    imageUrl: "",
  },
  info: [
    { label: "Địa chỉ", value: "Lô CN9 P, KCN, B'Lao, Lâm Đồng 66450, Việt Nam" },
    { label: "Hotline", value: "0969598892" },
    { label: "Email", value: "tobebaoloc@gmail.com" },
    { label: "Giờ làm việc", value: "T2 – T7: 8:00 – 18:00" },
  ],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.8!2d107.8112!3d11.5479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173f7a!2sKCN+B%27Lao!5e0!3m2!1svi!2svn!4v1700000000000",
};

export const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

export const getProductById = (products: ProductItem[], id: string) =>
  products.find((product) => product.id === id);

/** Tạo slug thân thiện từ chuỗi tiếng Việt. */
/** Tìm item theo slug hoặc theo id số (tương thích đường dẫn cũ). */
export const slugify = (input: string): string =>
  (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const itemPath = (
  item: ProductItem | BlogPost
): string => {
  if (item.slug?.trim()) {
    return item.slug;
  }

  if ("name" in item) {
    return slugify(item.name);
  }

  return slugify(item.title);
};

export function findBySlugOrId<T extends ProductItem | BlogPost>(
  items: T[],
  param?: string
): T | undefined {
  if (!param) return undefined;

  return items.find((item) => {
    const isIdMatch = String(item.id) === param;
    const isSlugMatch = item.slug === param;
    
    // Kiểm tra xem item là ProductItem (có name) hay BlogPost (có title)
    const nameOrTitle = "name" in item ? item.name : item.title;
    const isGeneratedSlugMatch = slugify(nameOrTitle) === param;

    return isIdMatch || isSlugMatch || isGeneratedSlugMatch;
  });
}


