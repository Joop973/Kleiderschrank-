# Datenschutz

Arbeitsdokument; ersetzt keine geprüfte Datenschutzerklärung.

## Grundsätze
- Fotos und Daten bleiben lokal; kein Konto nötig.
- Vor jedem KI-Upload: verkleinern (max. 1024 px), Metadaten entfernen, Gesichter verpixeln.
- Farbtyp-Selfies verlassen nie das Gerät.
- Server speichert keine Bilder und loggt keine Inhalte.

## Dienstleister (Auftragsverarbeitung)
| Dienst | Zweck | Region | AVV |
|---|---|---|---|
| Supabase | Auth, Sicherung, Edge Functions | Frankfurt | [ ] |
| Mistral | KI-Erkennung | EU | [ ] |
| Sentry | Absturz-Monitoring ohne Inhalte | EU | [ ] |
| RevenueCat | Abos | – | [ ] |
| Netlify | Hosting der Webapp (Teil A) | prüfen | [ ] |

## Datenflüsse
- **Anonymes Gerätekonto** (Plan 7.9): zufällige Konto-ID bei Supabase, keine E-Mail, keine Schrankdaten. Zweck: Schutz der KI-Schnittstelle, Kontingent. Löschung über "Konto löschen" oder nach 12 Monaten ohne Nutzung.
- **Echtheitsprüfung** (App Attest / Play Integrity): Ergebnis (geprüft/fehlgeschlagen, Zeitpunkt) am Gerätekonto. Apple bzw. Google verarbeiten dabei Gerätesignale; in Datenschutzerklärung nennen.
- **Prototyp (Webapp):** Daten liegen im Browser-Speicher des Geräts. Freistellen und Gesichtserkennung im Browser auf dem Gerät; Kleidungs-, Etikett- und verpixelte Selfie-Fotos (verkleinert, ohne Metadaten) gehen an die KI; keine Echtheitsprüfung.
- **Hosting Netlify:** liefert nur die App-Dateien aus; Zugriffsprotokolle (IP-Adressen) beim Anbieter, AVV und Region prüfen.
- **Web-Push (ab Phase 4):** Push-Abo (Endpunkt bei Apple bzw. Google) wird beim Gerätekonto in Supabase gespeichert.
- Weitere Flüsse werden ab Phase 2 ergänzt.

## Checkliste
Siehe KLEIDERSCHRANK_PLAN.md Abschnitt 11.
