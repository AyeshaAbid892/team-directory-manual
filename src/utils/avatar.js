// src/utils/avatar.js
// Deterministic avatar styling: the same name always maps to the same
// color pair, so avatars stay stable across re-renders and reloads.

const PALETTE_SIZE = 6;

export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function getAvatarPaletteIndex(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % PALETTE_SIZE) + 1;
}
