import { supabase } from "@/lib/supabase";

type PageName = "index" | "story" | "product" | "blog" | "contact";

export const pageNames: PageName[] = ["index", "story", "product", "blog", "contact"];

export async function fetchPageContent<T>(page: PageName): Promise<T | null> {
  const { data, error } = await supabase
    .from("page_contents")
    .select("content")
    .eq("page", page)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return (data?.content ?? null) as T | null;
}

export async function upsertPageContent(page: PageName, content: unknown) {
  const { error } = await supabase.from("page_contents").upsert({ page, content });
  if (error) throw error;
}

export async function uploadPageImage(file: File, page: PageName) {
  const filePath = `${page}/${Date.now()}-${file.name}`;
  const { data, error: uploadError } = await supabase.storage
    .from("page-assets")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: urlData, error: urlError } = await supabase.storage
    .from("page-assets")
    .getPublicUrl(filePath);

  if (urlError) {
    throw urlError;
  }

  return urlData.publicUrl;
}
