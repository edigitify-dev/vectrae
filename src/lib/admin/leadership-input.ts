export function isLeadershipId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function parseLeadershipForm(form: FormData) {
  const text = (name: string) => String(form.get(name) ?? "").trim();
  const id = text("id");
  const name = text("name");
  const designation = text("designation");
  const bio = text("bio");
  const imageUrl = text("imageUrl");
  const linkedinUrl = text("linkedinUrl");
  const sortOrder = Number(text("sortOrder"));
  if (id && !isLeadershipId(id)) {
    return { error: "Invalid member." } as const;
  }
  if (!name || name.length > 120) return { error: "Enter a name with up to 120 characters." } as const;
  if (!designation || designation.length > 180) return { error: "Enter a role with up to 180 characters." } as const;
  if (bio.length > 5000) return { error: "Keep the biography under 5,000 characters." } as const;
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000) {
    return { error: "Display order must be a whole number from 0 to 10,000." } as const;
  }
  if (imageUrl.length > 2048) return { error: "Image URL is too long." } as const;
  if (imageUrl && !imageUrl.startsWith("/images/")) {
    try {
      const url = new URL(imageUrl);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error();
    } catch { return { error: "Use a valid HTTPS image URL or upload a photo." } as const; }
  }
  if (linkedinUrl) {
    try {
      const url = new URL(linkedinUrl);
      if (linkedinUrl.length > 2048 || url.protocol !== "https:" || url.username || url.password ||
        !(url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))) throw new Error();
    } catch { return { error: "Use a valid LinkedIn URL starting with https://." } as const; }
  }
  return { id, values: { name, designation, bio, imageUrl, linkedinUrl, sortOrder,
    isFeatured: form.get("isFeatured") === "on" } } as const;
}
