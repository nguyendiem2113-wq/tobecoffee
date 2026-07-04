import { useEffect } from "react";
import { getPageContent } from "@/lib/supabase";
import { SiteSettings, defaultSiteSettings } from "@/lib/content";

/** Đặt/ cập nhật một thẻ <meta> theo name hoặc property. */
function setMeta(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function applySettings(s: SiteSettings) {
  if (s.siteTitle) document.title = s.siteTitle;
  setMeta("name", "description", s.description);
  if (s.keywords) setMeta("name", "keywords", s.keywords);

  setMeta("property", "og:title", s.siteTitle);
  setMeta("property", "og:description", s.description);
  if (s.ogImageUrl) setMeta("property", "og:image", s.ogImageUrl);

  setMeta("name", "twitter:title", s.siteTitle);
  setMeta("name", "twitter:description", s.description);
  if (s.ogImageUrl) setMeta("name", "twitter:image", s.ogImageUrl);

  if (s.faviconUrl) {
    let icon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = s.faviconUrl;
  }
}

/**
 * Áp dụng cấu hình SEO & favicon do admin quản lý vào <head> khi runtime.
 * Có fallback về giá trị mặc định nên không bao giờ làm hỏng trang.
 */
const SiteMeta = () => {
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const s = (await getPageContent<SiteSettings>("settings")) ?? defaultSiteSettings;
        if (active) applySettings({ ...defaultSiteSettings, ...s });
      } catch {
        if (active) applySettings(defaultSiteSettings);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return null;
};

export default SiteMeta;
