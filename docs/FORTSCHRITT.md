# Fortschritt

## Aktuelle Phase
Teil A, Phase 1 – Klick-Prototyp und Fundament (Code fertig; Nutzertest offen)
Phase 0 ist noch nicht abgenommen (Einrichtung durch Entwickler offen). Phase 1 wurde auf Wunsch parallel begonnen.

## Phase 0 – Abnahme
- [ ] Webapp öffnet sich auf dem iPhone über die feste Adresse und lässt sich zum Home-Bildschirm hinzufügen (wartet auf Einrichtung, docs/EINRICHTUNG.md)
- [x] Tests grün (lokal und CI)
- [ ] Edge Function "hallo" antwortet in der App (Anzeige jetzt unten in "Mehr")

## Phase 1 – Abnahme
- [ ] Nutzertest mit 5 Personen: jeder Ablauf ohne Erklärung in der Soll-Tippzahl (docs/NUTZERTESTS.md)
- [x] Test-Erweiterung lässt sich ein- und ausschalten, ohne dass Kern-Tests sich ändern (Unit-Test und Browser-Test)
- [ ] VoiceOver liest alle Knöpfe (alle Knöpfe haben Beschriftungen; Test auf dem iPhone offen)
- [x] Alle Abläufe aus Plan 3.2 klickbar, im Browser-Test durchgespielt (15 Abläufe, keine Fehler)

## Stand Code
- Design-System `src/shared/design-system`: Farben hell/dunkel/reizarm (Kontraste getestet), Knöpfe, Karten, Bestätigungskarte, Bildauswahl, Rückgängig-Leiste, Seite, Wischen
- Navigation: Heute, Kamera-Knopf (Mitte), Schrank; "Mehr" oben rechts
- Kern: Hinweiskarten-Warteschlange, Benachrichtigungs-Budget, Steckplätze (`src/core`), alles mit Tests
- Datenbank: expo-sqlite (Browser: SQLite in WebAssembly), Migrationen, Einstellungen, Erweiterungs-Zustand, Hinweis-Verlauf; Tests mit echtem SQLite
- Foto-Speicher im Browser (IndexedDB)
- Test-Erweiterung E00 (Hinweiskarte + Bildschirm)
- Klick-Prototyp mit Beispieldaten in `src/prototyp/` und Bildschirmen in `src/app/`
- Testleitung in "Mehr" für Nutzertests
- Browser-Test `npm run test:browser`

## Bekannte Grenzen
- Safari auf dem iPhone nicht getestet (nur Chromium); SQLite im Browser braucht iOS 17 oder neuer.
- Auf kleinen Bildschirmen liegt die Hinweiskarte teils unter der Tab-Leiste (scrollen nötig).
- Alles außer Erscheinungsbild und Erweiterungen ist Beispieldaten im Speicher; nach Neuladen ist der Prototyp zurückgesetzt.

## Sitzungsprotokoll

### 2026-10-23
- Bauplan, CLAUDE.md, docs angelegt; Plan auf Webapp-Prototyp umgestellt; Phase 0 umgesetzt (PR #1).
- Phase 1 umgesetzt (gleicher Branch, PR #1 erweitert). Entscheidungen: ohne Drizzle, Tannengrün, "Schrank", gezeichnete Symbole.
- Zwei Abweichungen vom Ablauf in Plan 3.2 zur Entscheidung nach dem Nutzertest (docs/ENTSCHEIDUNGEN.md).
- Nächster Schritt: Einrichtung (docs/EINRICHTUNG.md), PR mergen, auf dem iPhone prüfen, Nutzertest mit 5 Personen.
