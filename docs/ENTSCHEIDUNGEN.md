# Entscheidungen

Format: Datum – Entscheidung – Begründung – Alternativen

## 2026-10-23 – Branch der Claude-Code-Sitzung statt phase-XX-name
- Begründung: Cloud-Sitzungen von Claude Code geben einen Branch vor; Pushes auf andere Branches nur mit ausdrücklicher Erlaubnis.
- Folge: Plan-Regel 4 um diese Ausnahme ergänzt.

## 2026-10-23 – Android ab Phase 0 gleichwertig testen (ÜBERHOLT, siehe unten)
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

## 2026-10-23 – Erst Prototyp, dann Store-Entscheidung
- Begründung: Entwickler will die App erst selbst nutzen und prüfen, ob sie etwas taugt.
- Folge: Plan neu gegliedert in Teil A (Prototyp, Phasen 0–6), Teil B (Store-Vorbereitung, Phasen 7–11), Teil C (Erweiterungen, Phasen 12–15). Bezahlung, Cloud-Sicherung, Widget, Rechtstexte nach Teil B. Export bleibt früh (Phase 3).

## 2026-10-23 – Prototyp nur in Expo Go, nur iPhone
- Begründung: nur iPhone vorhanden; kein Apple-Entwicklerkonto (99 $/Jahr) vor der Store-Entscheidung.
- Folge: kein eigener nativer Code im Prototyp (Plan 7.10). Android gleichwertig erst ab Teil B. Ersetzt die Entscheidung "Android gleichwertig ab Phase 0".
- Kosten: lokale Fototyp-Vorentscheidung, Texterkennung, Gesichtserkennung, Echtheitsprüfung und Widget fehlen im Prototyp.

## 2026-10-23 – Freistellen im Prototyp: U²-Net auf dem Gerät
- Lösung: u2netp (Apache-2.0, ca. 5 MB) mit onnxruntime-web in react-native-webview; Machbarkeitstest in Phase 2 (≥ 80 % brauchbar, ≤ 6 s).
- Alternativen: Untergrund-Verfahren in JavaScript (Rückfall), iOS-eigenes Freistellen per Kopieren (bricht 3-Tipps-Regel), Server (widerspricht "Fotos bleiben lokal").
- Risiko: Tempo und Qualität ungetestet; Laufzeit in der Webansicht technisch wackliger als nativ.

## 2026-10-23 – Spiegel-Selfie verschoben, Etiketten als Bild an KI
- Spiegel-Selfie (K26) erst Phase 8: ohne nativen Code kein Verpixeln auf dem Gerät.
- Größenschild-Foto geht im Prototyp direkt an die KI (keine Personendaten, keine lokale Texterkennung in Expo Go).

## 2026-10-23 – Nutzertests reduziert
- Mit 5 Personen nur nach Phase 1 und vor der Store-Entscheidung; sonst Eigentest.

## Offen
- Geldmodell (vorläufig Freemium)
- App-Name nach Markenrecherche
- Gratis-Kontingent KI und Preise nach Beta
- Reihenfolge der Erweiterungs-Pakete nach Beta-Feedback
- KI-Kosten pro Aufgabe (Messung in Phase 2)
