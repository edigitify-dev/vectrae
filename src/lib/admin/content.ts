import type { BlogBlock } from "@/lib/blog-types";

export function parseBlogContent(raw: string): BlogBlock[] {
  if (!raw || raw.length > 200_000) return [];
  try {
    const blocks: unknown = JSON.parse(raw);
    if (!Array.isArray(blocks) || blocks.length > 100) return [];
    const result: BlogBlock[] = [];
    for (const block of blocks) {
      if (!block || typeof block !== "object") return [];
      const text = (value: unknown): value is string => typeof value === "string" && value.length <= 20_000;
      if (block.type === "list") {
        if (!Array.isArray(block.items) || block.items.length > 100 || !block.items.every(text)) return [];
        result.push({ type: "list", items: block.items });
      } else if (block.type === "paragraph" || block.type === "heading") {
        if (!text(block.text)) return [];
        result.push({ type: block.type, text: block.text });
      } else if (block.type === "quote") {
        if (!text(block.text) || (block.attribution !== undefined && !text(block.attribution))) return [];
        result.push({ type: "quote", text: block.text, ...(block.attribution !== undefined ? { attribution: block.attribution } : {}) });
      } else return [];
    }
    return result;
  } catch { return []; }
}
