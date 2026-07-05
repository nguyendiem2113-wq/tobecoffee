import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Rocket, LogIn, Home as HomeIcon, Sparkles, Package, BookOpen,
  Phone, Search as SearchIcon, MessageSquare, Image as ImageIcon,
  RefreshCw, LifeBuoy, CheckCircle2, Lightbulb,
} from "lucide-react";

function Step({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span className="text-sm leading-relaxed text-muted-foreground [&_b]:text-foreground [&_b]:font-semibold">
        {children}
      </span>
    </li>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-foreground">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

type GuideSection = {
  id: string;
  icon: typeof HomeIcon;
  title: string;
  content: ReactNode;
};

const sections: GuideSection[] = [
  {
    id: "start",
    icon: Rocket,
    title: "Bắt đầu nhanh (3 bước)",
    content: (
      <ul className="space-y-2.5">
        <Step><b>Đăng nhập</b> vào trang <b>/admin</b> bằng tài khoản quản trị viên.</Step>
        <Step>Chọn trang cần sửa ở <b>thanh bên trái</b> (Trang chủ, Sản phẩm, Tin tức...).</Step>
        <Step>Chỉnh nội dung rồi nhấn nút <b>Lưu thay đổi</b> màu đậm ở góc dưới. Xong!</Step>
      </ul>
    ),
  },
  {
    id: "login",
    icon: LogIn,
    title: "Đăng nhập & tài khoản",
    content: (
      <ul className="space-y-2.5">
        <Step>Truy cập <b>/admin/login</b>, nhập email và mật khẩu quản trị.</Step>
        <Step>Chỉ tài khoản có quyền <b>admin</b> mới vào được khu vực quản trị.</Step>
        <Step>Nhấn <b>Thoát</b> ở cuối thanh bên để đăng xuất an toàn khi dùng máy chung.</Step>
      </ul>
    ),
  },
  {
    id: "home",
    icon: HomeIcon,
    title: "Trang chủ",
    content: (
      <ul className="space-y-2.5">
        <Step><b>Khu vực Hero</b>: tiêu đề lớn, mô tả và ảnh nền đầu trang.</Step>
        <Step><b>Về chúng tôi</b>: đoạn giới thiệu ngắn kèm ảnh minh hoạ.</Step>
        <Step><b>Danh mục sản phẩm</b>, <b>Số liệu nổi bật</b>, <b>Bài viết nổi bật</b>: nhấn <b>Thêm</b> để tạo mục mới, dùng mũi tên để sắp xếp.</Step>
      </ul>
    ),
  },
  {
    id: "story",
    icon: Sparkles,
    title: "Giới thiệu",
    content: (
      <ul className="space-y-2.5">
        <Step>Chỉnh <b>câu chuyện thương hiệu</b>: mục tiêu, lý do chọn, nhiệm vụ và dịch vụ.</Step>
        <Step>Ô <b>Icon</b> nhận emoji (ví dụ 🌱 ☕ 🌍) để hiển thị biểu tượng sinh động.</Step>
      </ul>
    ),
  },
  {
    id: "product",
    icon: Package,
    title: "Sản phẩm",
    content: (
      <ul className="space-y-2.5">
        <Step>Nhấn <b>Thêm</b> để tạo sản phẩm, rồi mở rộng để nhập tên, giá, danh mục, xuất xứ.</Step>
        <Step><b>Mô tả chi tiết</b> dùng trình soạn thảo có định dạng (in đậm, danh sách, ảnh...).</Step>
        <Step><b>Đường dẫn (slug)</b>: nhấn <b>Tạo</b> để sinh tự động từ tên, giúp link đẹp & chuẩn SEO.</Step>
        <Step>Bật/tắt <b>bộ lọc Xuất xứ</b> ở phần Hero nếu muốn khách lọc theo vùng trồng.</Step>
      </ul>
    ),
  },
  {
    id: "blog",
    icon: BookOpen,
    title: "Tin tức / Blog",
    content: (
      <ul className="space-y-2.5">
        <Step>Nhấn <b>Thêm</b> để viết bài mới: tiêu đề, chủ đề, ngày, tóm tắt và nội dung.</Step>
        <Step><b>Nội dung</b> dùng trình soạn thảo — chèn ảnh, tiêu đề phụ, trích dẫn dễ dàng.</Step>
        <Step><b>Ngày</b> nhập dạng <b>YYYY-MM-DD</b> (ví dụ 2026-07-05) để sắp xếp đúng.</Step>
      </ul>
    ),
  },
  {
    id: "contact",
    icon: Phone,
    title: "Liên hệ & Bản đồ",
    content: (
      <ul className="space-y-2.5">
        <Step>Chỉnh <b>Địa chỉ, Hotline, Email, Giờ làm việc</b> ở phần Thông tin liên hệ.</Step>
        <Step><b>Bản đồ tạo tự động</b> từ dòng <b>"Địa chỉ"</b> — không cần dán mã nhúng.</Step>
        <Tip>Chỉ cần sửa đúng địa chỉ là bản đồ, nút Chỉ đường và Mở Google Maps hoạt động chính xác.</Tip>
      </ul>
    ),
  },
  {
    id: "seo",
    icon: SearchIcon,
    title: "SEO & Favicon",
    content: (
      <ul className="space-y-2.5">
        <Step><b>Tiêu đề trang</b> nên dưới 60 ký tự, <b>Mô tả</b> dưới 160 ký tự để đẹp trên Google.</Step>
        <Step><b>Favicon</b>: ảnh vuông (khuyến nghị 512×512, PNG) hiển thị trên tab trình duyệt.</Step>
        <Step><b>OG Image</b> (1200×630): ảnh hiện ra khi chia sẻ link lên Facebook, Zalo...</Step>
      </ul>
    ),
  },
  {
    id: "messages",
    icon: MessageSquare,
    title: "Tin nhắn khách hàng",
    content: (
      <ul className="space-y-2.5">
        <Step>Tin nhắn từ form Liên hệ hiện ở tab <b>Tin nhắn</b>; số huy hiệu là số chưa đọc.</Step>
        <Step>Đánh dấu <b>đã đọc / chưa đọc</b> hoặc <b>xoá</b> tin bằng các nút bên phải mỗi tin.</Step>
      </ul>
    ),
  },
  {
    id: "images",
    icon: ImageIcon,
    title: "Mẹo tải & dùng hình ảnh",
    content: (
      <ul className="space-y-2.5">
        <Step>Nhấn vùng ảnh để <b>tải lên</b>; nên dùng ảnh <b>JPG</b> để nhẹ, <b>PNG</b> khi cần nền trong suốt.</Step>
        <Step>Chú ý <b>kích thước khuyến nghị</b> ghi dưới mỗi ô ảnh để hiển thị sắc nét, không vỡ.</Step>
        <Tip>Ảnh quá lớn sẽ làm web tải chậm — nên nén ảnh trước khi tải lên.</Tip>
      </ul>
    ),
  },
  {
    id: "cache",
    icon: RefreshCw,
    title: "Làm mới dữ liệu & chống lỗi kết nối",
    content: (
      <ul className="space-y-2.5">
        <Step>Website <b>lưu bản sao (cache)</b> nội dung nên vẫn hiển thị khi Supabase tạm ngưng.</Step>
        <Step>Khi kết nối trở lại, hệ thống <b>tự động làm mới</b> để dữ liệu không bị cũ.</Step>
        <Step>Muốn cập nhật ngay, nhấn nút <b>Làm mới</b> (biểu tượng ⟳) ở thanh bên quản trị.</Step>
      </ul>
    ),
  },
  {
    id: "support",
    icon: LifeBuoy,
    title: "Xử lý sự cố thường gặp",
    content: (
      <ul className="space-y-2.5">
        <Step><b>Không lưu được?</b> Kiểm tra mạng, sau đó nhấn <b>Làm mới</b> rồi lưu lại.</Step>
        <Step><b>Nội dung chưa cập nhật?</b> Nhấn <b>Làm mới</b> hoặc tải lại trang (Ctrl/Cmd + R).</Step>
        <Step><b>Không đăng nhập được?</b> Đảm bảo đúng email/mật khẩu và tài khoản có quyền admin.</Step>
      </ul>
    ),
  },
];

export function AdminGuide() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-4 p-6">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold">Hướng dẫn sử dụng đầy đủ</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tất cả những gì bạn cần để quản trị website và trang /admin. Nhấn từng mục để mở chi tiết.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-2 sm:p-4">
        <Accordion type="single" collapsible defaultValue="start" className="w-full">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <AccordionItem key={s.id} value={s.id} className="border-border">
                <AccordionTrigger className="hover:no-underline">
                  <span className="flex items-center gap-3 text-left">
                    <span className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-heading text-sm font-bold sm:text-base">{s.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-4 pt-1 sm:px-2">
                  <div className="space-y-3 pl-1 sm:pl-12">{s.content}</div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </div>
  );
}

export default AdminGuide;
