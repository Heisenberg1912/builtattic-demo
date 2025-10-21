const DEFAULT_STUDIO_SIZE = { width: 960, height: 720 };
const DEFAULT_CARD_SIZE = { width: 960, height: 640 };
const DEFAULT_AVATAR_SIZE = { width: 320, height: 320 };

function seededPlaceholder(identifier, { width, height }) {
  const seed =
    (identifier && String(identifier).trim()) ||
    `fallback-${Math.random().toString(36).slice(2)}`;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

const studioSeed = (studio) =>
  studio?.slug || studio?._id || studio?.title || "studio";
const firmSeed = (firm) =>
  firm?.slug || firm?._id || firm?.name || "firm";
const associateSeed = (associate) =>
  associate?._id || associate?.user?.email || associate?.title || "associate";
const materialSeed = (item) =>
  item?._id || item?.sku || item?.title || "material";

export function getStudioImageUrl(studio) {
  return studio?.heroImage || studio?.gallery?.find(Boolean) || getStudioFallback(studio);
}

export function getFirmCoverImage(firm) {
  return firm?.coverImage || firm?.gallery?.find(Boolean) || getFirmCoverFallback(firm);
}

export function getFirmAvatarImage(firm) {
  return firm?.logo || firm?.gallery?.find(Boolean) || getFirmAvatarFallback(firm);
}

export function getAssociateAvatar(associate) {
  return associate?.avatar || getAssociateFallback(associate);
}

export function getMaterialImage(item) {
  return (
    item?.heroImage ||
    item?.gallery?.find(Boolean) ||
    item?.images?.find(Boolean) ||
    getMaterialFallback(item)
  );
}

export function applyFallback(event, url) {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === "true") return;
  target.dataset.fallbackApplied = "true";
  target.src = url;
}

export function getStudioFallback(studio) {
  return seededPlaceholder(studioSeed(studio), DEFAULT_STUDIO_SIZE);
}

export function getFirmCoverFallback(firm) {
  return seededPlaceholder(`${firmSeed(firm)}-cover`, DEFAULT_CARD_SIZE);
}

export function getFirmAvatarFallback(firm) {
  return seededPlaceholder(`${firmSeed(firm)}-logo`, DEFAULT_AVATAR_SIZE);
}

export function getAssociateFallback(associate) {
  return seededPlaceholder(associateSeed(associate), DEFAULT_AVATAR_SIZE);
}

export function getMaterialFallback(item) {
  return seededPlaceholder(materialSeed(item), DEFAULT_CARD_SIZE);
}
