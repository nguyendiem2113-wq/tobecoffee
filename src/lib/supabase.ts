// D:\JOBS\tobecoffee\src\lib\supabase.ts

import { supabase } from "@/integrations/supabase/client";

export { supabase };

/**
 * Lấy nội dung CMS từ Supabase.
 * Trả về null nếu không có dữ liệu hoặc có lỗi.
 */
export async function getPageContent<T>(
  pageName: string
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from("page_contents")
      .select("content")
      .eq("page", pageName)
      .maybeSingle();

    if (error) {
      console.error(
        `[Supabase] Không thể tải trang "${pageName}":`,
        error.message
      );
      return null;
    }

    if (!data?.content) {
      console.warn(
        `[Supabase] Trang "${pageName}" chưa có dữ liệu CMS`
      );
      return null;
    }

    return data.content as T;
  } catch (err) {
    console.error(
      `[Supabase] Lỗi hệ thống khi tải trang "${pageName}":`,
      err
    );
    return null;
  }
}

/**
 * Lưu nội dung CMS.
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
          content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "page",
        }
      );

    if (error) {
      console.error(
        `[Supabase] Không thể lưu trang "${pageName}":`,
        error.message
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error(
      `[Supabase] Lỗi hệ thống khi lưu trang "${pageName}":`,
      err
    );
    return false;
  }
}