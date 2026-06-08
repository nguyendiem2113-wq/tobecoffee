import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Copy, ChevronUp, ChevronDown, Search, Wand2, ChevronRight } from "lucide-react";
import { AdminField, AdminArea, AdminImage } from "./AdminFields";
import { RichTextEditor } from "./RichTextEditor";
import { slugify } from "@/lib/content";

export type FieldDef = {
  key: string;
  label: string;
  kind: "text" | "area" | "image" | "number" | "rich" | "slug";
  folder?: string;
  /** Cho kind "slug": key nguồn để tự tạo slug (vd: "name" hoặc "title") */
  from?: string;
  /** Cho kind "image": kích thước đề xuất, vd "800 x 800" */
  recommend?: string;
};

interface ListEditorProps<T> {
  title: string;
  items: T[];
  fields: FieldDef[];
  onChange: (items: T[]) => void;
  newItem: (items: T[]) => T;
  titleKey?: string;
  searchKeys?: string[];
  collapsible?: boolean;
}

export function ListEditor<T extends Record<string, unknown>>({
  title,
  items,
  fields,
  onChange,
  newItem,
  titleKey,
  searchKeys,
  collapsible,
}: ListEditorProps<T>) {
  const [query, setQuery] = useState("");
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const update = (index: number, key: string, value: unknown) => {
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  };
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => {
    const next = [...items, newItem(items)];
    onChange(next);
    if (collapsible) {
      setOpenIndices((prev) => {
        const s = new Set(prev);
        s.add(next.length - 1);
        return s;
      });
    }
  };
  const duplicate = (index: number) => {
    const copy = { ...items[index] } as Record<string, unknown>;
    if ("id" in copy) copy.id = Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1;
    const next = [...items.slice(0, index + 1), copy as T, ...items.slice(index + 1)];
    onChange(next);
    if (collapsible) {
      setOpenIndices((prev) => {
        const s = new Set(prev);
        s.add(index + 1);
        return s;
      });
    }
  };
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const s = new Set(prev);
      if (s.has(index)) s.delete(index);
      else s.add(index);
      return s;
    });
  };

  const keys = searchKeys ?? (titleKey ? [titleKey] : []);
  const q = query.trim().toLowerCase();
  const matches = (item: T) =>
    !q || keys.some((k) => String(item[k] ?? "").toLowerCase().includes(q));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-bold">
          {title} <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          {keys.length > 0 && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="h-9 w-40 pl-8 sm:w-52"
              />
            </div>
          )}
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="mr-2 h-4 w-4" /> Thêm
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          if (!matches(item)) return null;
          const isOpen = !collapsible || openIndices.has(index);
          return (
            <Card key={index} className={isOpen ? "p-5" : "px-4 py-3"}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {collapsible && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => toggle(index)}
                      title={isOpen ? "Thu gọn" : "Mở rộng"}
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}
                  <span className="text-sm font-semibold text-muted-foreground truncate">
                    {titleKey ? String(item[titleKey] ?? `#${index + 1}`) : `#${index + 1}`}
                  </span>
                  {!isOpen && searchKeys && searchKeys.slice(0, 2).map((k) =>
                    item[k] ? (
                      <span key={k} className="hidden sm:inline ml-2 text-xs text-muted-foreground truncate max-w-[200px]">
                        {String(item[k]).slice(0, 50)}
                      </span>
                    ) : null
                  )}
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(index, -1)} disabled={index === 0} title="Lên">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(index, 1)} disabled={index === items.length - 1} title="Xuống">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => duplicate(index)} title="Nhân bản">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)} title="Xoá">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {fields.map((f) => {
                    const span = f.kind === "area" || f.kind === "image" || f.kind === "rich" || f.kind === "slug" ? "sm:col-span-2" : "";
                    return (
                      <div key={f.key} className={span}>
                        {f.kind === "text" && (
                          <AdminField label={f.label} value={item[f.key] as string} onChange={(v) => update(index, f.key, v)} />
                        )}
                        {f.kind === "number" && (
                          <AdminField
                            label={f.label}
                            type="number"
                            value={item[f.key] as number}
                            onChange={(v) => update(index, f.key, Number(v) || 0)}
                          />
                        )}
                        {f.kind === "area" && (
                          <AdminArea label={f.label} value={item[f.key] as string} onChange={(v) => update(index, f.key, v)} />
                        )}
                        {f.kind === "image" && (
                          <AdminImage
                            label={f.label}
                            folder={f.folder ?? "general"}
                            recommend={f.recommend}
                            value={item[f.key] as string}
                            onChange={(v) => update(index, f.key, v)}
                          />
                        )}
                        {f.kind === "rich" && (
                          <RichTextEditor
                            label={f.label}
                            folder={f.folder ?? "content"}
                            value={item[f.key] as string}
                            onChange={(v) => update(index, f.key, v)}
                          />
                        )}
                        {f.kind === "slug" && (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {f.label}
                            </Label>
                            <div className="flex items-center gap-2">
                              <span className="select-none text-sm text-muted-foreground">/</span>
                              <Input
                                value={(item[f.key] as string) ?? ""}
                                placeholder="duong-dan-than-thien"
                                onChange={(e) => update(index, f.key, slugify(e.target.value))}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="shrink-0"
                                onClick={() => update(index, f.key, slugify(String(item[f.from ?? "title"] ?? "")))}
                                title="Tạo tự động từ tiêu đề"
                              >
                                <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Tạo
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Để trống sẽ dùng số ID. Đường dẫn nên ngắn gọn, không dấu.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
        {items.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Chưa có mục nào. Nhấn "Thêm" để tạo mới.
          </p>
        )}
      </div>
    </div>
  );
}
