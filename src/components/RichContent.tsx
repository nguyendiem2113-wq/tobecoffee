import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

/**
 * Hiển thị nội dung HTML (từ trình soạn thảo) một cách an toàn.
 * Tự động làm sạch để tránh tấn công XSS.
 * Nếu nội dung là văn bản thuần (không có thẻ), giữ nguyên xuống dòng.
 */
export function RichContent({ html, className }: { html: string; className?: string }) {
  const value = html ?? "";
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value);
  const clean = DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });

  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-img:rounded-xl prose-blockquote:border-primary",
        !looksLikeHtml && "whitespace-pre-line",
        className
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default RichContent;
