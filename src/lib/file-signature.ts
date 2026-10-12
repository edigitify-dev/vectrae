/** Check declared file types against their binary header; this is not a malware scan. */
export function fileContentMatches(type: string, bytes: Uint8Array): boolean {
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  switch (type) {
    case "image/jpeg": return starts(0xff, 0xd8, 0xff);
    case "image/png": return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case "image/webp": return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "image/avif": {
      if (ascii(4, 8) !== "ftyp") return false;
      if (["avif", "avis"].includes(ascii(8, 12))) return true;
      for (let offset = 16; offset + 4 <= bytes.length; offset += 4) {
        if (["avif", "avis"].includes(ascii(offset, offset + 4))) return true;
      }
      return false;
    }
    case "application/pdf": return ascii(0, 5) === "%PDF-";
    case "application/msword": return starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return starts(0x50, 0x4b, 0x03, 0x04);
    default: return false;
  }
}

export async function fileHasExpectedSignature(file: File): Promise<boolean> {
  return fileContentMatches(file.type, new Uint8Array(await file.slice(0, 64).arrayBuffer()));
}
