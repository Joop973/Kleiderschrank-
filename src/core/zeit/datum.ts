/** Kalendertag im Format JJJJ-MM-TT, in lokaler Zeit des Geräts. */
export type Tag = string;

export function tagVon(datum: Date): Tag {
  const j = datum.getFullYear();
  const m = String(datum.getMonth() + 1).padStart(2, '0');
  const t = String(datum.getDate()).padStart(2, '0');
  return `${j}-${m}-${t}`;
}

/** Ganze Tage von a nach b (b später = positiv). */
export function tageZwischen(a: Tag, b: Tag): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}
