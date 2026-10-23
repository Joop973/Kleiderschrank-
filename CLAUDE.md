# CLAUDE.md

## Projekt
[APP-NAME]: die einfachste Kleiderschrank-App. Einfacher Kern + zuschaltbare Erweiterungen.
Verbindlicher Bauplan: KLEIDERSCHRANK_PLAN.md. Aktueller Stand: docs/FORTSCHRITT.md.
Entwickler arbeitet nur vom Smartphone, ohne Mac.
Aktuell Teil A (Prototyp): läuft in Expo Go, nur iPhone, kein Apple-Entwicklerkonto. Store erst nach Entscheidung.

## Stack
Expo (React Native, TypeScript), Expo Router, expo-sqlite + Drizzle, Zustand, TanStack Query,
Prototyp: expo-camera, expo-image-manipulator, U²-Net in react-native-webview (Plan 7.10).
Erst Teil B: eigenes Expo-Modul modules/native-vision (Apple Vision / ML Kit). Supabase (Frankfurt),
Mistral über Edge Functions, Bright Sky (Wetter), RevenueCat, Sentry (EU).

## Befehle
- Tests: npm test
- Lint: npm run lint
- Typprüfung: npm run typecheck
- KI-Testsatz: npm run eval
- Supabase-Migration: supabase migration new <name>
- Vorschau-Update: eas update --branch preview (läuft automatisch per GitHub Action)

## Regeln
- Nur an der aktuellen Phase arbeiten, Abnahmekriterien abhaken.
- Teil A: nur Bibliotheken, die in Expo Go laufen; kein eigener nativer Code. Sonst anhalten und fragen.
- Branches: phase-XX-name; gibt die Claude-Code-Sitzung einen Branch vor, gilt dieser.
- Commit-Nachrichten auf Deutsch, kleine Commits.
- Einfachheits-Regeln (Plan Abschnitt 2) sind Abnahmekriterien: 5 Sekunden, 1 Hauptaktion,
  max. 3 Tipps, keine Formulare, keine Pflichtfelder, max. 1 Benachrichtigung und 1 Hinweiskarte pro Tag.
- Kern importiert nie aus src/extensions/; Erweiterungen nur über Steckplätze.
- Riskantes zuerst als Machbarkeitstest, dann Oberfläche.
- Vor größeren Änderungen kurzen Plan vorschlagen.
- UI-Texte in src/i18n/de.json, Du-Form, Alltagssprache, nie über Körper urteilen.
- Keine API-Schlüssel im App-Code; externe Dienste nur über src/services/*.
- Edge Functions nur mit gültigem Gerätekonto; Kontingent serverseitig zählen (Plan 7.9).
- Fotos bleiben lokal; vor jedem KI-Upload: verkleinern, Metadaten entfernen, Gesichter verpixeln.
  Im Prototyp keine Fotos mit Personen hochladen (Spiegel-Selfie entfällt bis Phase 8).
- Farbtyp-Selfies verlassen nie das Gerät.
- KI-Ergebnisse nie ohne das "Ja" auf der Bestätigungskarte speichern; Unsicheres hervorheben; Erkanntes kennzeichnen.
- Keine erfundenen Werte (keine Haltbarkeitsnoten).
- Geschäftslogik immer mit Unit-Tests; Grenzen nur in src/core/paywall/limits.ts und Manifesten.
- Nach jeder Sitzung docs/FORTSCHRITT.md aktualisieren.
- Bei Widerspruch zu KLEIDERSCHRANK_PLAN.md: anhalten und nachfragen.
