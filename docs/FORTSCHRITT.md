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

## Phase 2 (vorgezogen) – Stand
- [x] Freistellen im Browser (U²-Net klein), im Test-Browser: synthetisches T-Shirt korrekt freigestellt, 0,7–2,3 s pro Foto (Server-CPU, nicht iPhone)
- [x] Gesichter verpixeln im Browser (MediaPipe Gesicht, Rückfall Körperhaltung); mit echten Gesichtern noch nicht getestet
- [x] Testbildschirm: Mehr → "Machbarkeitstest Bilder" mit Bewertung, Auswertung gegen die Ziele und Export als JSON
- [ ] Messung auf dem iPhone mit 20 Kleidungsfotos und Spiegel-Selfies (Entwickler)
- [ ] KI-Teil (Edge Function ai-vision, Mistral, Gerätekonto, Kontingent): wartet auf Supabase und Mistral-Konto
- [ ] Gruppierung, Größenschilder, Pflegeetiketten (brauchen KI)

## Bekannte Grenzen
- Safari auf dem iPhone nicht getestet (nur Chromium); SQLite im Browser braucht iOS 17 oder neuer.
- Große Systemschrift: Safari übernimmt die iOS-Schriftgröße für Webseiten nicht automatisch; nicht geprüft.
- Ohne Netz startet die App (Service Worker), die Bild-Modelle sind aber nur offline da, wenn sie einmal geladen wurden.

## Sitzungsprotokoll

### 2026-10-24
- PR #1 und #2 gemergt; Regel: Claude mergt eigene PRs nach grüner Prüfung.
- Mängel behoben: Teile, Anziehen, Selfie-Eintrag und Wäsche werden gespeichert; Offline-Start; Hinweiskarte bleibt sichtbar.
- Phase 2 auf dem Gerät vorgezogen (Freistellen, Gesichter, Testbildschirm).
- Netlify-Projekt "schrank-app" angelegt; Verbindung zu GitHub fehlt noch (docs/EINRICHTUNG.md, Schritt 3).

### 2026-10-23
- Bauplan, CLAUDE.md, docs angelegt; Plan auf Webapp-Prototyp umgestellt; Phase 0 umgesetzt (PR #1).
- Phase 1 umgesetzt (gleicher Branch, PR #1 erweitert). Entscheidungen: ohne Drizzle, Tannengrün, "Schrank", gezeichnete Symbole.
- Zwei Abweichungen vom Ablauf in Plan 3.2 zur Entscheidung nach dem Nutzertest (docs/ENTSCHEIDUNGEN.md).
- Nächster Schritt: Einrichtung (docs/EINRICHTUNG.md), PR mergen, auf dem iPhone prüfen, Nutzertest mit 5 Personen.
