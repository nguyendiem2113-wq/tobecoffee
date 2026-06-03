import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: typeof window === "undefined" ? undefined : window.localStorage,
  },
});
/**
 * Lấy dữ liệu CMS của một trang cụ thể (Bọc try-catch an toàn)
 */
export async function getPageContent<T>(pageName: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from("page_contents")
      .select("content")
      .eq("page", pageName)
      .single();

    if (error || !data) {
      console.warn(`[Supabase] Không tìm thấy trang ${pageName}, sử dụng dữ liệu mặc định.`);
      return fallback;
    }
    return data.content as T;
  } catch (err) {
    console.error(`[Supabase Error] Lỗi fetch trang ${pageName}:`, err);
    return fallback;
  }
}

/**
 * Cập nhật dữ liệu cấu trúc JSONB từ Admin lên Supabase
 */
export async function updatePageContent(pageName: string, content: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("page_contents")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("page", pageName);

    if (error) {
      console.error(`[Supabase Error] Không thể update dữ liệu trang ${pageName}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Supabase Error] Lỗi hệ thống khi lưu trang ${pageName}:`, err);
    return false;
  }
}