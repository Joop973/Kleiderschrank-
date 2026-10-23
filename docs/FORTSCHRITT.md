# Fortschritt

## Aktuelle Phase
Teil A, Phase 0 – Grundlagen (Code fertig, Einrichtung durch Entwickler offen)

## Phase 0 – Abnahme
- [ ] App öffnet sich per Link in Expo Go auf dem iPhone (wartet auf Einrichtung, docs/EINRICHTUNG.md)
- [x] Tests grün (lokal: Lint, Typprüfung, 8 Tests, Formatierung; iOS-Bündel baut)
- [ ] Tests grün in CI (erster Lauf nach Push)
- [ ] Edge Function "hallo" antwortet in der App (wartet auf Einrichtung)

## Stand Code
- Expo SDK 58, TypeScript, Expo Router (`src/app/`), drei Bereiche als Platzhalter
- i18n (`src/i18n/de.json`, typisierte Schlüssel), Serverabfrage `src/services/server/hallo.ts`
- Edge Function `supabase/functions/hallo`
- GitHub Actions: Prüfung, Vorschau in Expo Go (EAS Update), Server-Deploy
- ESLint-Regel: Kern darf nicht aus `src/extensions/` importieren

## Sitzungsprotokoll

### 2026-10-23
- KLEIDERSCHRANK_PLAN.md, CLAUDE.md und docs/-Gerüst angelegt; Lücken eingearbeitet; Plan auf Prototyp in Expo Go umgestellt.
- Phase 0 umgesetzt (siehe Stand Code). Nicht geprüft: Lauf der GitHub Actions mit echten Zugangsdaten, Öffnen in Expo Go.
- Nächster Schritt: Entwickler richtet Konten und GitHub-Secrets ein (docs/EINRICHTUNG.md), dann Abnahme prüfen.
