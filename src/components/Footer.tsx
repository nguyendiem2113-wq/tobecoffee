import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const tobeLogo = "/logo.png"; // ✅ dùng public

  return (
    <footer className="bg-foreground text-primary-foreground/80 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* LOGO + DESC */}
        <div>
          <img
            src={tobeLogo}
            alt="TOBE Coffee"
            className="h-20 w-22 mb-4 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/fallback.png"; // fallback nếu lỗi
            }}
          />
          <p className="font-body text-sm leading-relaxed">
            Khởi đầu cho mọi ý tưởng — TOBE mang đến hương vị cà phê đậm đà từ vùng nguyên liệu Lâm Đồng, Việt Nam.
          </p>
        </div>

        {/* LINK */}
        <div>
          <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
            Liên kết
          </h4>
          <ul className="space-y-2 font-body text-sm">
            <li><Link to="/story" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
            <li><Link to="/product" className="hover:text-primary transition-colors">Sản phẩm</Link></li>
            <li><Link to="/blog" className="hover:text-primary transition-colors">Tin tức</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Liên hệ</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
            Liên hệ
          </h4>
          <ul className="space-y-3 font-body text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              Lô CN9 P, KCN, B'Lao, Lâm Đồng 66450, Việt Nam
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-primary shrink-0" />
              0969 598 892
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              tobebaoloc@gmail.com
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
            Theo dõi
          </h4>
          <p className="font-body text-sm mb-4">
            Kết nối với TOBE trên mạng xã hội
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-10 h-10 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-primary-foreground/10 text-center font-body text-xs text-primary-foreground/50">
        © 2026 Công ty TNHH TOBE Bảo Lộc. All rights reserved. | tobecoffee.vn
      </div>
    </footer>
  );
};

export default Footer;