# Entscheidungen

Format: Datum – Entscheidung – Begründung – Alternativen

## 2026-10-23 – Branch der Claude-Code-Sitzung statt phase-XX-name
- Begründung: Cloud-Sitzungen von Claude Code geben einen Branch vor; Pushes auf andere Branches nur mit ausdrücklicher Erlaubnis.
- Folge: Plan-Regel 4 um diese Ausnahme ergänzt.

## 2026-10-23 – Android ab Phase 0 gleichwertig testen
- Begründung: Wunsch des Entwicklers; native-vision nutzt auf beiden Plattformen unterschiedliche Technik (Apple Vision / ML Kit), Fehler fallen so früh auf.
- Folge: Android-Testgerät nötig; jede Abnahme gilt für beide Plattformen; Google-Play-Konto früh anlegen.
- Kosten: mehr Testaufwand pro Phase, besonders Phase 2.

## 2026-10-23 – Schutz der KI-Schnittstelle: Gerätekonto + Echtheitsprüfung, weiche Regel
- Begründung: Ohne Konto wäre die Edge Function frei aufrufbar; Kosten trägt der Betreiber.
- Lösung: unsichtbares anonymes Supabase-Konto, App Attest / Play Integrity, Kontingent und Drosselung serverseitig (Plan 7.9).
- Bei fehlgeschlagener Prüfung: KI weiter nutzbar, Startwert 5 Erkennungen pro Monat, strengere Drosselung.
- Alternative verworfen: harte Sperre (schließt ehrliche Nutzer alter oder gerooteter Geräte aus).

## 2026-10-23 – Phase-2-Machbarkeitstests in zwei Teilen
- Begründung: native-vision läuft nur auf dem Gerät; ein reines Skript kann es nicht prüfen.
- Lösung: versteckter Testbildschirm im Entwicklungs-Build exportiert JSON; Skript wertet aus und testet KI-Teil.

## 2026-10-23 – Kleine Korrekturen
- Pfad matching.config.ts nach src/core/diary/ (passend zur Ordnerstruktur).
- Feld `merkmal` aus `items` entfernt; Merkmale stehen in details_json.

## Offen
- Geldmodell (vorläufig Freemium)
- App-Name nach Markenrecherche
- Gratis-Kontingent KI und Preise nach Beta
- Reihenfolge der Erweiterungs-Pakete nach Beta-Feedback
- KI-Kosten pro Aufgabe (Messung in Phase 2)
