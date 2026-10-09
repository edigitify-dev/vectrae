import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const EXT = "(?:png|jpe?g|webp|svg|gif|avif|ico)";
// Files / paths that must NOT be rewritten
const SKIP_FILES = ["src/lib/site-images.ts", "src/components/admin/BlogEditor.tsx"];
const SKIP_PATHS = ["/cursor-original.png"]; // used as CSS cursor, keep same-origin
const IMPORT_LINE = `import { r2Asset } from "@/lib/site-images";`;

const attr = new RegExp(`(\\b[a-zA-Z-]+)=(["'])(\\/[A-Za-z0-9_./-]+\\.${EXT})\\2`, "g");
const lit = new RegExp(`(["'])(\\/[A-Za-z0-9_./-]+\\.${EXT})\\1`, "g");

function walk(dir, out = []) {
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) walk(full, out);
        else if (/\.(ts|tsx)$/.test(name)) out.push(full);
    }
    return out;
}

let changedFiles = 0;
let changedRefs = 0;

for (const file of walk("src")) {
    const rel = file.split(path.sep).join("/");
    if (SKIP_FILES.includes(rel)) continue;

    const original = readFileSync(file, "utf8");
    let count = 0;

    // 1) JSX attributes: src="/x.png"  ->  src={r2Asset("/x.png")}
    let next = original.replace(attr, (m, name, _q, p) => {
        if (SKIP_PATHS.includes(p)) return m;
        count++;
        return `${name}={r2Asset("${p}")}`;
    });

    // 2) Plain string literals: "/x.png"  ->  r2Asset("/x.png")
    next = next.replace(lit, (m, _q, p, offset, str) => {
        if (SKIP_PATHS.includes(p)) return m;
        // already wrapped?
        if (str.slice(Math.max(0, offset - 8), offset) === "r2Asset(") return m;
        // inside a // comment on the same line? leave it alone
        const lineStart = str.lastIndexOf("\n", offset) + 1;
        if (str.slice(lineStart, offset).includes("//")) return m;
        count++;
        return `r2Asset("${p}")`;
    });

    if (count === 0) continue;

    if (!next.includes(IMPORT_LINE)) {
        const eol = next.includes("\r\n") ? "\r\n" : "\n";
        const directive = next.match(/^(["']use (?:client|server)["'];?\r?\n)/);
        next = directive
            ? next.replace(directive[1], `${directive[1]}${IMPORT_LINE}${eol}`)
            : `${IMPORT_LINE}${eol}${next}`;
    }

    changedFiles++;
    changedRefs += count;
    console.log(`${WRITE ? "updated" : "would update"} ${rel} (${count})`);
    if (WRITE) writeFileSync(file, next);
}

console.log(`\n${changedRefs} references in ${changedFiles} files${WRITE ? " rewritten." : " (dry run, add --write to apply)."}`);