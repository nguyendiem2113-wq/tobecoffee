import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Copy, ChevronUp, ChevronDown, Search } from "lucide-react";
import { AdminField, AdminArea, AdminImage } from "./AdminFields";

export type FieldDef = {
  key: string;
  label: string;
  kind: "text" | "area" | "image" | "number";
  folder?: string;
};

interface ListEditorProps<T> {
  title: string;
  items: T[];
  fields: FieldDef[];
  onChange: (items: T[]) => void;
  newItem: (items: T[]) => T;
  titleKey?: string;
  searchKeys?: string[];
}

export function ListEditor<T extends Record<string, unknown>>({
  title,
  items,
  fields,
  onChange,
  newItem,
  titleKey,
  searchKeys,
}: ListEditorProps<T>) {
  const [query, setQuery] = useState("");

  const update = (index: number, key: string, value: unknown) => {
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  };
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, newItem(items)]);
  const duplicate = (index: number) => {
    const copy = { ...items[index] } as Record<string, unknown>;
    if ("id" in copy) copy.id = Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1;
    onChange([...items.slice(0, index + 1), copy as T, ...items.slice(index + 1)]);
  };
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
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

      <div className="space-y-4">
        {items.map((item, index) => {
          if (!matches(item)) return null;
          return (
            <Card key={index} className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-muted-foreground">
                  {titleKey ? String(item[titleKey] ?? `#${index + 1}`) : `#${index + 1}`}
                </span>
                <div className="flex items-center gap-0.5">
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
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => {
                  const span = f.kind === "area" || f.kind === "image" ? "sm:col-span-2" : "";
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
                          value={item[f.key] as string}
                          onChange={(v) => update(index, f.key, v)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
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
