// D:\JOBS\tobecoffee\src\lib\supabase.ts

import { supabase } from "@/integrations/supabase/client";

export { supabase };

const CACHE_PREFIX = "tobe:page:";
const REQUEST_TIMEOUT_MS = 8000;

/** Các trang CMS được cache & làm mới tự động. */
export const CMS_PAGES = ["index", "story", "product", "blog", "contact", "settings"] as const;

/** Bọc một promise với timeout để tránh treo khi Supabase bị tạm dừng (paused). */
function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function readCache<T>(pageName: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + pageName);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(pageName: string, content: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + pageName, JSON.stringify(content));
  } catch {
    /* localStorage đầy hoặc bị chặn — bỏ qua */
  }
}

/**
 * Lấy nội dung CMS từ Supabase với cơ chế chống lỗi:
 * - Có timeout để không treo khi database bị tạm dừng.
 * - Lưu cache vào localStorage khi tải thành công.
 * - Nếu lỗi/không có mạng/paused → trả về bản cache gần nhất (nếu có).
 * Trả về null khi không có cả dữ liệu online lẫn cache (caller sẽ dùng default).
 */
export async function getPageContent<T>(pageName: string): Promise<T | null> {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from("page_contents")
        .select("content")
        .eq("page", pageName)
        .maybeSingle(),
      REQUEST_TIMEOUT_MS
    );

    if (error) {
      console.warn(`[Supabase] Lỗi tải trang "${pageName}", dùng cache:`, error.message);
      return readCache<T>(pageName);
    }

    if (!data?.content) {
      // Không có dữ liệu online — thử cache trước khi trả null
      return readCache<T>(pageName);
    }

    writeCache(pageName, data.content);
    return data.content as T;
  } catch (err) {
    console.warn(
      `[Supabase] Không kết nối được (có thể bị paused) khi tải "${pageName}", dùng cache.`,
      err
    );
    return readCache<T>(pageName);
  }
}

/**
 * Lưu nội dung CMS. Cập nhật cache cục bộ ngay khi lưu thành công.
 */
export async function updatePageContent(
  pageName: string,
  content: unknown
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("page_contents")
      .upsert(
        {
          page: pageName,
          content: content as never,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "page",
        }
      );

    if (error) {
      console.error(`[Supabase] Không thể lưu trang "${pageName}":`, error.message);
      return false;
    }

    writeCache(pageName, content);
    return true;
  } catch (err) {
    console.error(`[Supabase] Lỗi hệ thống khi lưu trang "${pageName}":`, err);
    return false;
  }
}
