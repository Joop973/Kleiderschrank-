# Fortschritt

## Aktuelle Phase
Teil A, Phase 0 – Grundlagen (Code fertig, Einrichtung durch Entwickler offen)

## Phase 0 – Abnahme
- [ ] Webapp öffnet sich auf dem iPhone über die feste Adresse und lässt sich zum Home-Bildschirm hinzufügen (wartet auf Einrichtung, docs/EINRICHTUNG.md)
- [x] Tests grün (lokal und CI)
- [ ] Edge Function "hallo" antwortet in der App (wartet auf Einrichtung)

## Stand Code
- Expo SDK 58, TypeScript, Expo Router (`src/app/`), Web-Ausgabe als Home-Bildschirm-App (`public/`), drei Bereiche als Platzhalter
- i18n (`src/i18n/de.json`, typisierte Schlüssel), Serverabfrage `src/services/server/hallo.ts`
- Edge Function `supabase/functions/hallo` (mit CORS für den Browser)
- GitHub Actions: Prüfung, Server-Deploy; Netlify baut über `netlify.toml`
- ESLint-Regel: Kern darf nicht aus `src/extensions/` importieren
- Lokal geprüft: Web-Build im Test-Browser (iPhone-Größe) startet ohne Fehler, Wechsel der Bereiche funktioniert

## Sitzungsprotokoll

### 2026-10-23
- KLEIDERSCHRANK_PLAN.md, CLAUDE.md und docs/-Gerüst angelegt; Lücken eingearbeitet.
- Plan zweimal umgestellt: erst Prototyp, dann Store; Prototyp als Webapp statt Expo Go (Abschnitt 7.10, 16, 17).
- Phase 0 umgesetzt. Nicht geprüft: Netlify-Build, Supabase-Deploy mit echten Zugangsdaten, Safari auf dem iPhone.
- Nächster Schritt: Entwickler richtet Supabase, GitHub und Netlify ein (docs/EINRICHTUNG.md) und mergt den Pull Request.
