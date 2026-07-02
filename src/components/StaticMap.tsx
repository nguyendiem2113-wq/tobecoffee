import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface StaticMapProps {
  address: string;
  /** Tên địa điểm hiển thị trên thẻ (mặc định lấy dòng đầu của địa chỉ). */
  title?: string;
  className?: string;
}

/**
 * Bản đồ tĩnh "cứng" tự vẽ (không nhúng iframe Google) để tránh lỗi/confuse.
 * Vẫn cho phép mở Google Maps + chỉ đường theo địa chỉ.
 */
const StaticMap = ({ address, title, className = "" }: StaticMapProps) => {
  const query = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const label = title || address.split(",")[0];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border bg-secondary shadow-sm ${className}`}
    >
      {/* Nền bản đồ được vẽ bằng gradient + lưới đường */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary to-background" />
      <svg
        className="absolute inset-0 h-full w-full text-primary/15"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern id="map-grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>

      {/* "Đường phố" trang trí */}
      <div className="absolute left-0 right-0 top-1/3 h-3 -rotate-6 bg-primary/10" />
      <div className="absolute left-0 right-0 top-2/3 h-2 rotate-3 bg-primary/10" />
      <div className="absolute bottom-0 left-1/4 top-0 w-2 bg-primary/10" />
      <div className="absolute bottom-0 right-1/3 top-0 w-3 rotate-2 bg-primary/10" />

      {/* Ghim vị trí */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/30" />
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl ring-8 ring-primary/15">
          <MapPin className="h-7 w-7" />
        </div>
      </div>

      {/* Thẻ thông tin + nút hành động */}
      <div className="relative flex h-full min-h-[420px] flex-col justify-end p-5">
        <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-lg backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70">
            Vị trí của chúng tôi
          </p>
          <h3 className="mt-1 font-heading text-lg font-bold leading-snug">{label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{address}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
            >
              <Navigation className="h-4 w-4" /> Chỉ đường
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> Mở Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticMap;
