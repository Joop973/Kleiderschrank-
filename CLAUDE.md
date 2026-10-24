# CLAUDE.md

## Projekt

[APP-NAME]: die einfachste Kleiderschrank-App. Einfacher Kern + zuschaltbare Erweiterungen.
Verbindlicher Bauplan: KLEIDERSCHRANK_PLAN.md. Aktueller Stand: docs/FORTSCHRITT.md.
Entwickler arbeitet nur vom Smartphone, ohne Mac.
Aktuell Teil A (Prototyp): Webapp (Expo Web) auf Netlify, als Home-Bildschirm-App auf dem iPhone. Store erst nach Entscheidung.

## Stack

Expo (React Native, TypeScript), Expo Router, expo-sqlite (async, eigene Migrationen, ohne Drizzle), Zustand, TanStack Query,
Prototyp: Browser-APIs hinter src/services/, U²-Net und Gesichtserkennung im Browser, Web-Push (Plan 7.10).
Erst Teil B: eigenes Expo-Modul modules/native-vision (Apple Vision / ML Kit). Supabase (Frankfurt),
Mistral über Edge Functions, Bright Sky (Wetter), RevenueCat, Sentry (EU).

## Befehle

- Tests: npm test
- Lint: npm run lint
- Formatierung: npm run format (Prüfung: npm run format:check)
- Typprüfung: npm run typecheck
- Abläufe im Browser: npm run build:web && npm run test:browser (Playwright, zählt Tipps)
- KI-Testsatz: npm run eval
- Supabase-Migration: supabase migration new <name>
- Web-Build: npm run build:web (Netlify baut automatisch; Branches bekommen Vorschau-Adressen)
- Abhängigkeiten: EXPO_OFFLINE=1 npx expo install <paket> (expo.dev ist aus der Cloud-Sitzung gesperrt)

## Regeln

- Nur an der aktuellen Phase arbeiten, Abnahmekriterien abhaken.
- Teil A: Code muss im Browser laufen; Plattform-Code nur hinter src/services/, damit Teil B nur Umsetzungen tauscht.
- Neue Stände über Pull Request nach main; main = Webapp des Entwicklers (Netlify).
- Claude mergt eigene Pull Requests selbst, sobald die Prüfung auf GitHub grün ist und keine Konflikte bestehen (Auftrag des Entwicklers, docs/ENTSCHEIDUNGEN.md). Nie mit roter Prüfung mergen.
- Branches: phase-XX-name; gibt die Claude-Code-Sitzung einen Branch vor, gilt dieser.
- Commit-Nachrichten auf Deutsch, kleine Commits.
- Einfachheits-Regeln (Plan Abschnitt 2) sind Abnahmekriterien: 5 Sekunden, 1 Hauptaktion,
  max. 3 Tipps, keine Formulare, keine Pflichtfelder, max. 1 Benachrichtigung und 1 Hinweiskarte pro Tag.
- Kern importiert nie aus src/extensions/; Erweiterungen nur über Steckplätze. Einziger Import des Registers: src/zusammenbau.ts.
- Klick-Prototyp liegt in src/prototyp/ (Beispieldaten, Zustand); wird ab Phase 3 durch echte Daten ersetzt.
- Riskantes zuerst als Machbarkeitstest, dann Oberfläche.
- Vor größeren Änderungen kurzen Plan vorschlagen.
- UI-Texte in src/i18n/de.json, Du-Form, Alltagssprache, nie über Körper urteilen.
- Keine API-Schlüssel im App-Code; externe Dienste nur über src/services/*.
- Edge Functions nur mit gültigem Gerätekonto; Kontingent serverseitig zählen (Plan 7.9).
- Fotos bleiben lokal; vor jedem KI-Upload: verkleinern, Metadaten entfernen, Gesichter verpixeln.
  Spiegel-Selfies nur nach Verpixeln auf dem Gerät hochladen (Machbarkeitstest Phase 2).
- Farbtyp-Selfies verlassen nie das Gerät.
- KI-Ergebnisse nie ohne das "Ja" auf der Bestätigungskarte speichern; Unsicheres hervorheben; Erkanntes kennzeichnen.
- Keine erfundenen Werte (keine Haltbarkeitsnoten).
- Geschäftslogik immer mit Unit-Tests; Grenzen nur in src/core/paywall/limits.ts und Manifesten.
- Nach jeder Sitzung docs/FORTSCHRITT.md aktualisieren.
- Bei Widerspruch zu KLEIDERSCHRANK_PLAN.md: anhalten und nachfragen.
