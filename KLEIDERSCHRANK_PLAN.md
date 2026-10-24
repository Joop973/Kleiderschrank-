# [APP-NAME] – Bauplan für Claude Code (Version 2: einfacher Kern + Erweiterungen)

> Die einfachste Kleiderschrank-App: morgens ein Blick, ein Tipp, angezogen.
> Kern: Kamera-Knopf mit Etikett-Scan, ein Outfit pro Tag, "Anziehen"-Knopf.
> Alles Weitere sind **Erweiterungen**, die jeder Nutzer selbst einschalten kann.
> Deutsch, privat by default, offline nutzbar.
>
> Stand: Oktober 2026. Preise, Grenzen und Regeln von Drittanbietern vor der Umsetzung jeweils kurz prüfen.

---

## 0. Anleitung für Claude Code (zuerst lesen)

Diese Datei (`KLEIDERSCHRANK_PLAN.md`) ist die verbindliche Grundlage für das gesamte Projekt.

**Arbeitsregeln**

1. Arbeite immer nur an **einer Phase** (Abschnitt 17). Keine neue Phase, bevor alle Abnahmekriterien der aktuellen erfüllt und abgehakt sind.
2. Zu Beginn jeder Sitzung: diese Datei und `CLAUDE.md` lesen, Stand in `docs/FORTSCHRITT.md` prüfen.
3. Vor größeren Änderungen einen kurzen Plan in Stichpunkten vorschlagen und auf Freigabe warten.
4. Jede Phase in einem eigenen Git-Branch (`phase-XX-name`), kleine Commits mit deutschen Commit-Nachrichten. **Ausnahme:** Gibt die Claude-Code-Sitzung einen Branch vor, wird dieser verwendet (siehe `docs/ENTSCHEIDUNGEN.md`).
5. Alle sichtbaren Texte über `src/i18n/de.json`, nie fest im Code.
6. Keine API-Schlüssel im App-Code. KI-Schlüssel nur in Supabase Edge Functions.
7. Geschäftslogik (Fototyp-Erkennung, Gruppierung, Outfit-Regeln, Farblogik, Größen, Waschgruppen, Preis pro Tragen, Limits) immer mit Unit-Tests.
8. Wenn etwas technisch nicht geht oder es eine deutlich bessere Lösung gibt: **anhalten, begründen, Alternative vorschlagen**.
9. Nach jeder Sitzung `docs/FORTSCHRITT.md` aktualisieren.
10. Der Entwickler arbeitet **nur vom Smartphone, ohne Mac**. Alles muss über GitHub, Expo EAS und das Handy testbar sein (Abschnitt 16).
11. **Riskantes zuerst als Machbarkeitstest**, dann Oberfläche.
12. **Die Einfachheits-Regeln (Abschnitt 2) sind Abnahmekriterien jeder Phase.** Eine Funktion, die sie verletzt, gilt als nicht fertig.
13. **Der Kern kennt keine Erweiterung.** Erweiterungen docken nur über Steckplätze an (Abschnitt 7.5). Kern-Code darf nie aus `src/extensions/` importieren.
14. Wiederverwendbare Teile (Design-System, Erinnerungsplaner, KI-Schnittstelle) in `src/shared/` ohne App-spezifische Abhängigkeiten.

---

## 1. Vision und Zielgruppe

**Ein Satz:** Die App kennt deinen Schrank so genau wie die Etiketten selbst und zeigt dir jeden Tag ein Outfit, das passt.

**Zielgruppe:** Alle, die morgens Zeit und Nerven sparen und ihre Kleidung besser nutzen wollen, ausdrücklich auch Menschen, die mit Technik wenig am Hut haben. Was für ADHS hilft (ein Vorschlag, Vorabend-Outfit, keine Entscheidungen), ist **Standard für alle**. Wer mehr will, schaltet Erweiterungen dazu.

**Kernversprechen**
1. **Ein Blick, ein Tipp:** Outfit ansehen, "Anziehen", fertig.
2. **Fotografieren statt tippen:** ein Kamera-Knopf für alles, die App versteht selbst, was sie sieht.
3. **Bessere Käufe:** Kaufcheck im Laden mit der gleichen Kamera.
4. **Privat:** Fotos bleiben auf dem Handy, keine Werbung, keine Community, kein Konto nötig.

**Abgrenzung (Recherche Oktober 2026):** Acloset, GetWardrobe, Whering, Alta, Clueless, Cladwell bieten Foto, Kategorie, Farbe, Outfits, teils Wetter, Kalender, Kosten pro Tragen. Unser Unterschied: **Etikett als Datenquelle**, **ein Kamera-Knopf mit automatischer Erkennung**, **radikal einfache Bedienung**. Bekannte Kritik an der Konkurrenz, die wir vermeiden: Abstürze, Langsamkeit, schlechte Hintergrundentfernung ohne Korrektur, zu viel Handarbeit, generische Vorschläge ohne Accessoires, Werbung.

---

## 2. Einfachheits-Regeln (verbindlich, messbar)

1. **5-Sekunden-Regel:** Jeder Bildschirm ist in 5 Sekunden verstanden.
2. **Eine Hauptaktion pro Bildschirm**, als großer Knopf. Alles andere ist kleiner oder versteckt.
3. **Höchstens 3 Tipps** für jede häufige Aufgabe (Outfit annehmen, Teil anlegen, getragen eintragen, Kaufcheck, Wäsche erledigt).
4. **Drei Bereiche:** Heute, Schrank, Kamera-Knopf. Nicht mehr.
5. **Keine Formulare.** Stattdessen Bestätigungskarten: "Stimmt das?" → Ja, oder auf den falschen Teil tippen.
6. **Nur Unsicheres wird einzeln gefragt.** Pro Teil gibt es eine Karte mit kurzer Zusammenfassung und einem "Ja"; sichere Werte stehen nur in der Zusammenfassung, unsichere sind hervorgehoben. Alles bleibt jederzeit änderbar.
7. **Keine Pflichtfelder.** Fehlendes darf fehlen.
8. **Bilder vor Worten.** Kategorien als Bilder, höchstens 8 auf einmal sichtbar.
9. **Rückgängig statt Nachfragen.** Keine "Bist du sicher?"-Dialoge außer bei Konto löschen.
10. **Standardwerte statt Einstellungen.** Die Einstellungen passen auf einen Bildschirm.
11. **Höchstens 1 Benachrichtigung pro Tag** im Standard (das Vorabend-Outfit) und **höchstens 1 Hinweiskarte pro Tag** auf "Heute".
12. **Alltagssprache:** "Preis pro Tragen", "Wirkt deine Haut eher warm oder kühl?", keine Fachbegriffe, keine Anglizismen.
13. **Erweiterungen sind aus**, bis der Nutzer sie einschaltet.
14. **Nutzertest:** Vor dem Abschluss jeder Phase mit Oberfläche testen mindestens **5 Personen ohne Technik-Affinität** (z. B. Familie, Kollegen) die neuen Abläufe ohne Erklärung. Ergebnisse in `docs/NUTZERTESTS.md`. Was 2 oder mehr Personen nicht schaffen, wird vereinfacht.

---

## 3. Bedienkonzept

### 3.1 Aufbau

```
┌───────────────────────────────┐
│  Heute              (●) Mehr   │  ← Mehr: Erweiterungen, Einstellungen, Hilfe, Datenschutz
│                                │
│   [ Outfit-Bild, groß ]        │  ← Teile antippen = nur dieses Teil tauschen
│   "Passt zu 14 °C und Regen"   │
│   Jacke mitnehmen ab 17 Uhr    │
│                                │
│   [   Anziehen   ]  Anderes →  │
│   (Hinweiskarte, max. 1)       │
├───────────────────────────────┤
│  Heute    ( ◉ Kamera )  Schrank│
└───────────────────────────────┘
```

- **Heute:** ein Outfit, "Anziehen" (Hauptaktion), "Anderes" (Wischen oder Tippen), darunter höchstens eine Hinweiskarte.
- **Kamera-Knopf (Mitte):** für alles Neue. Galerie-Symbol unten links in der Kamera.
- **Schrank:** Bilderraster, Kategorien als Bilder, Suche.
- **Mehr:** kleines Symbol oben rechts auf "Heute": Erweiterungen, Einstellungen, Hilfe, Datenschutz.

### 3.2 Abläufe (Soll-Tipps in Klammern)

**Morgens (1 Tipp)**
1. App öffnen oder Widget ansehen → Outfit ist da.
2. "Anziehen" → eingetragen: getragen, Preis pro Tragen, Wäschestand. Fertig.
- Andere Schuhe gewünscht: Schuhe im Bild antippen → nächste passende Schuhe.

**Abends (1 Tipp)**
1. Benachrichtigung zur gewählten Uhrzeit: Bild des Outfits für morgen (Wetter und Termine von morgen).
2. "Passt" → festgelegt. Morgens erscheint genau dieses Outfit.

**Neues Teil (2–3 Tipps)**
1. Kamera-Knopf → Teil fotografieren → optional direkt danach Größenschild und Pflegeetikett fotografieren.
2. App erkennt den Fototyp selbst und ordnet die Fotos dem Teil zu.
3. Bestätigungskarte: "Blaue Jeans, Levi's, W32/L34, 98 % Baumwolle, 40 °C. Stimmt das?" → "Ja".

**Viele Teile auf einmal**
1. Kamera → Galerie-Symbol → Fotos markieren → "Hinzufügen".
2. App sortiert in Teile und zeigt einen Stapel Bestätigungskarten (Wischen = Ja).

**Kaufcheck im Laden (2 Tipps)**
1. Kamera-Knopf → Teil fotografieren.
2. App erkennt "nicht im Schrank" und fragt einmal pro Kamera-Sitzung: "Neu für deinen Schrank oder nur prüfen?" → "Nur prüfen".
   *Prototyp-Variante (offen, Nutzertest Phase 1):* keine eigene Frage; die Bestätigungskarte hat "Ja, in den Schrank" und "Nur prüfen". So bleibt "Neues Teil" bei 3 Tipps.
3. Ergebnis in drei Zeilen: "Passt zu 9 Outfits", "Ähnlich: deine graue Strickjacke", "Farbe steht dir". Dazu geschätzter Preis pro Tragen.

**Etwas anderes getragen (2 Tipps)**
1. Kamera-Knopf → Spiegel-Selfie.
2. App erkennt das Selfie, verpixelt das Gesicht, ordnet die Teile zu: "Heute getragen: Jeans, weißes Hemd, braune Schuhe?" → "Ja".

**Wäsche (1–2 Tipps)**
- Läuft automatisch über Tragezahl pro Kategorie.
- Hinweiskarte "12 Teile in der Wäsche. Waschgänge ansehen?" → Vorschlag nach Temperatur und Farbe → "Fertig gewaschen".

**Verkaufen (2 Tipps)**
- Hinweiskarte (höchstens einmal pro Woche): "Seit 8 Monaten nicht getragen: Verkaufen, spenden oder behalten?" → "Verkaufen" → Anzeigentext ist kopiert, Fotos zum Teilen bereit.

**Farbtyp (freiwillig, ca. 1 Minute)**
- Nach einer Woche einmalig als Hinweiskarte angeboten: "Willst du wissen, welche Farben dir stehen?"
- Selfie → Haut wird gemessen → Haare und Augen antippen → ein Bildschirm mit 4 Reglern → Palette.

### 3.3 Einstellungen (ein Bildschirm)
- Uhrzeit Vorabend-Outfit (Standard 20:00), Benachrichtigungen an/aus
- Wohnort für Wetter (automatisch, änderbar)
- Kalender verwenden an/aus
- KI an/aus
- Cloud-Sicherung an/aus (Premium)
- Erscheinungsbild: Hell, Dunkel, System, Reizarm
- Erweiterungen (eigener Bildschirm, Abschnitt 5)
- Datenschutz-Übersicht, Export, Konto löschen, Hilfe, Rechtliches

---

## 4. Kern-Funktionen (Version 1)

Kennzeichnung: **[F]** Gratis, **[P]** Premium, **[F/P]** Gratis mit Grenze. Geldmodell siehe Abschnitt 13.

### Kamera und Erfassung
- **K01** **Ein Kamera-Knopf, automatische Fototyp-Erkennung:** Kleidungsstück, Größenschild, Pflegeetikett, Spiegel-Selfie. Erkennung auf dem Gerät (Gesicht/Person, Textmenge), unklare Fälle entscheidet die KI im selben Aufruf. **[F]**
- **K02** **Automatische Gruppierung:** Fotos, die direkt nacheinander gemacht werden, gehören zum selben Teil; ein neues Kleidungsfoto beginnt ein neues Teil. Falsch zugeordnete Fotos per Ziehen umhängen. **[F]**
- **K03** **Galerie-Stapel:** viele Fotos auf einmal, App sortiert in Teile (Zeitstempel plus Fototyp). **[F/P]**
- **K04** Freistellen **auf dem Gerät**; Korrektur mit Pinsel versteckt hinter "Bild korrigieren". Tipp bei schlechtem Ergebnis: "Leg das Teil auf einen dunklen Untergrund." **[F]**
- **K05** Farben **auf dem Gerät** (Haupt- und Nebenfarbe, deutscher Farbname). **[F]**
- **K06** KI-Erkennung: Kategorie, Muster, Schnitt, Details, Formalität, Jahreszeit. **[F/P]**
- **K07** **Größenschild:** Marke, Größe (inkl. W/L, EU/US/UK), Material in Prozent. **[F/P]**
- **K08** **Pflegeetikett:** Symbole → Waschtemperatur, Trockner, Bügeln, Reinigung; daraus Pflegeaufwand (wenig, mittel, viel). Keine Haltbarkeitsnote. **[F/P]**
- **K09** **Bestätigungskarte statt Formular:** eine Karte pro Teil mit Zusammenfassung in einem Satz und "Ja"; unsichere Werte hervorgehoben; Antippen eines Werts öffnet eine Bildauswahl; Duplikat-Hinweis nur bei hoher Sicherheit. **[F]**
- **K10** **Teilen aus Shop oder Bestellmail:** Link, Screenshot oder Text an die App teilen → Teil mit Name, Marke, Preis, Größe, Kaufdatum. **[F/P]**

### Heute
- **K11** **Ein Outfit-Vorschlag:** Wetter (inkl. Tagesverlauf), Termine (Anlass automatisch aus dem Titel), Wäschestand, Material-Wetter-Logik, Farbharmonie, Farbtyp (falls vorhanden), Rotation; vollständig mit Schuhen und Accessoires. Läuft offline. **[F]**
- **K12** **"Anziehen":** trägt getragen ein, aktualisiert Preis pro Tragen und Wäschestand. **[F]**
- **K13** **"Anderes" und Teil tauschen:** Wischen = nächstes Outfit; ein Teil antippen = nur dieses Teil ersetzen. **[F]**
- **K14** **Eine Zeile Begründung** ("Passt zu 14 °C und Regen"), Antippen zeigt mehr. Aus Textbausteinen, ohne KI. **[F]**
- **K15** **Mitnehm-Hinweis:** "Jacke mitnehmen ab 17 Uhr", "Schirm einpacken". **[F]**
- **K16** **Vorabend-Outfit:** Benachrichtigung mit Bild, "Passt" legt fest. Standard an, Uhrzeit änderbar. **[F]**
- **K17** **Lernen mit einer Frage:** höchstens eine kurze Rückfrage pro Tag ("Gestern zu warm?" Ja/Nein), daraus persönliche Gewichte. **[F]**
- **K18** **Herz** für Lieblingsoutfits; Lieblinge werden häufiger vorgeschlagen. **[F]**
- **K19** **Hinweiskarten (max. 1 pro Tag)** aus einer Warteschlange mit Prioritäten: Wäsche voll, lange nicht getragen, Verkaufsvorschlag, Farbtyp-Angebot, fehlende Kategorie für Vorschläge, empfohlene Erweiterung. **[F]**
- **K20** **Startzustand:** Vorschläge ab 3 Teilen (Oberteil, Unterteil, Schuhe); bis dahin zeigt "Heute", was noch fehlt, mit Kamera-Knopf. **[F]**

### Schrank
- **K21** **Bilderraster**, Kategorien als Bilder, Suche per Text oder Sprache ("blaue Jeans"). **[F]**
- **K22** **Teil-Ansicht:** Foto, Größe, Marke, Material, Waschsymbole, Preis pro Tragen, zuletzt getragen, Pflegeaufwand; jeder Wert antippbar zum Ändern. **[F]**
- **K23** **Größenprofil pro Marke** automatisch ("Bei dieser Marke trägst du M"), sichtbar in Teil-Ansicht und Kaufcheck. **[F]**
- **K24** **Wäsche automatisch:** Tragezahl bis zur Wäsche pro Kategorie (z. B. Jeans 5, T-Shirt 1); Waschgang-Vorschlag nach Temperatur, Farbe, Programm; "Fertig gewaschen" mit einem Tipp. **[F]**
- **K25** **Verkaufen:** Anzeigentext aus vorhandenen Daten zum Kopieren, Link zur Suche ähnlicher Angebote, Status verkauft/gespendet/aussortiert. Kein automatisches Einstellen. **[F/P]**

### Tagebuch und Kaufcheck
- **K26** **Spiegel-Selfie:** Gesicht auf dem Gerät verpixelt, Teile erkannt und zugeordnet, knappe Treffer werden immer nachgefragt, Bestätigung verbessert künftige Erkennung. **[F/P]**
- **K27** **Kaufcheck:** gleiche Kamera, eine Frage pro Sitzung, Ergebnis in drei Zeilen plus Preis-pro-Tragen-Schätzung. **[F/P]**

### Farbtyp (freiwillig)
- **K28** Selfie bei Tageslicht, optional mit weißem Blatt Papier als Farbreferenz; alles **auf dem Gerät**. Haut automatisch, Haare und Augen per Antippen (Pipette mit Lupe), ein Bildschirm mit 4 Reglern in Alltagssprache; Unterton-Hilfe nur bei "Weiß ich nicht"; Ergebnis als Palette mit Hinweis "Stilberatung, keine Wissenschaft". **[F]**

### Grundlagen
- **K29** **Datenschutz-Übersicht in einfacher Sprache**, KI abschaltbar (dann Bildauswahl statt Erkennung). **[F]**
- **K30** **Kein Konto nötig.** Cloud-Sicherung als ein Schalter; dabei wird das unsichtbare Gerätekonto (Abschnitt 7.9) mit E-Mail-Link oder Mit Apple anmelden verknüpft. Sicherung Ende-zu-Ende verschlüsselt. **[P]**
- **K31** Export (alles als ZIP), Import auf neuem Gerät, **Konto in der App löschen**. **[F]**
- **K32** **Widget** auf Home- und Sperrbildschirm: heutiges Outfit und Wetter. **[F]**
- **K33** Barrierefreiheit: Systemschriftgrößen, Screenreader, große Tippflächen, Hell/Dunkel/Reizarm, Farben immer mit Namen. **[F]**
- **K34** **Erweiterungen-Bildschirm:** Liste mit Bild, einem Satz Erklärung und Schalter; empfohlene Erweiterungen höchstens einmal pro Monat als Hinweiskarte (aus Nutzungsverhalten, z. B. viele Online-Käufe → Rückgabe-Erinnerung). **[F]**
- **K35** **Einstieg in 3 Schritten:** Willkommen → erstes Teil fotografieren oder Galerie-Stapel → Abend-Benachrichtigung erlauben. Ort und Kalender werden erst gefragt, wenn sie gebraucht werden. **[F]**

---

## 5. Erweiterungen (zuschaltbar, Standard aus)

Jede Erweiterung: ein Schalter, ein Satz Erklärung, ein Bild. Ausschalten blendet alles aus; die Daten bleiben erhalten, bis der Nutzer "Daten löschen" wählt. Keine Erweiterung darf die Einfachheits-Regeln im ausgeschalteten Zustand verletzen; eingeschaltet gelten sie ebenfalls (Abschnitt 2).

| ID | Erweiterung | Was sie macht (ein Satz für den Nutzer) | Steckplätze | Plan |
|---|---|---|---|---|
| **E01** | Mehr Auswahl | "Zeigt dir 3 Vorschläge statt einem, mit Filtern und Anlass-Wahl." | Heute-Ansicht, Engine | F |
| **E02** | Outfit-Baukasten | "Stell Outfits selbst zusammen und speichere sie." | eigener Bildschirm, Schrank | F |
| **E03** | Uniform-Formel | "Leg deine Lieblingsformel fest, die App wechselt nur innerhalb davon." | Engine-Filter | F |
| **E04** | Wohlfühl-Filter | "Schließt kratzige Stoffe, enge Schnitte oder störende Etiketten aus." | Engine-Filter, Teil-Ansicht | F |
| **E05** | Rückgabe und Garantie | "Erinnert dich an Rücksendefristen und Garantien neuer Käufe." | Kamera/Teilen, Benachrichtigungen | F |
| **E06** | Wunschliste mit Bedenkzeit | "Merk dir Wünsche und entscheide nach 48 Stunden noch einmal." | Kaufcheck, Hinweiskarten | F |
| **E07** | Pflege-Plus | "Pflege-Erinnerungen, Saisonwechsel, Reparatur-Liste, Waschzähler." | Hinweiskarten, Teil-Ansicht | P |
| **E08** | Statistik und Rückblick | "Wie viel deines Schranks du trägst, Monatsrückblick, Schrankwert." | eigener Bildschirm | P |
| **E09** | Budget | "Kleidungsbudget pro Monat und freiwillige Regel 'eins rein, eins raus'." | Kaufcheck, Hinweiskarten | P |
| **E10** | Was fehlt? | "Zeigt, welches Teil dir die meisten neuen Outfits bringen würde." | Hinweiskarten, eigener Bildschirm | P |
| **E11** | Reise-Packliste | "Packt für Ziel, Dauer und Wetter mit möglichst wenigen Teilen." | eigener Bildschirm | P |
| **E12** | Passform | "Vermisst dein Lieblingsteil per Foto und vergleicht mit Maßtabellen von Shops." | Kamera, Teil-Ansicht, Kaufcheck | P |
| **E13** | Proportionen | "Schnitt-Vorlieben per Regler, ohne Foto und ohne Gewicht." | Engine-Bewertung | P |
| **E14** | Anlässe und Personen | "Merkt sich, was du bei welchem Anlass und mit wem getragen hast." | Tagebuch, Hinweiskarten | P |
| **E15** | Profile und Kinderkleiderschrank | "Weitere Schränke für Partner oder Kinder, mit Größenwechsel-Hinweis." | Profilwahl, Schrank | P |
| **E16** | Geteilter Schrank | "Teile ausgewählte Teile mit Partner oder Geschwistern zum Leihen." (braucht Cloud) | Schrank, Teil-Ansicht | P |
| **E17** | Familien-Abstimmung | "Stimmt Outfits mehrerer Profile farblich ab, z. B. für Familienfotos." (braucht E15) | Heute | P |
| **E18** | Outfit-Umfrage | "Frag Freunde per Link, welches Outfit besser ist. Link läuft nach 48 Stunden ab." | Teilen | P |
| **E19** | Aussortieren und Spenden | "Archiv für Verkauftes und Gespendetes, Erlös, Kleiderspende in der Nähe." | Schrank | F |
| **E20** | Sprachbefehle | "Frag Siri oder Google: 'Was ziehe ich heute an?'" | Kurzbefehle | P |

---

## 6. Schwierigkeiten und Lösungen

| Schwierigkeit | Lösung |
|---|---|
| Erfassen ist zu aufwendig | Ein Kamera-Knopf, automatische Fototyp-Erkennung und Gruppierung (K01–K02), Galerie-Stapel (K03), Teilen aus Shops (K10), Bestätigungskarten ohne Formular (K09), Vorschläge schon ab 3 Teilen (K20), Schrank wächst über Spiegel-Selfies (K26) |
| Fototyp falsch erkannt (z. B. Etikett als Teil) | Bestätigungskarte zeigt den erkannten Typ klein mit "Ändern"; Korrekturen fließen in die lokalen Schwellenwerte |
| Fotos falsch gruppiert | Foto auf der Karte per Ziehen einem anderen Teil zuordnen; Gruppierungsregel per Unit-Tests abgesichert |
| Kaufcheck und neues Teil nutzen dieselbe Kamera | Eine Frage pro Kamera-Sitzung, Antwort gilt für die ganze Sitzung |
| Spiegel-Selfie verwechselt ähnliche Teile | Nie still eintragen; knappe Treffer mit einem Tipp nachfragen; Bestätigungen werden Referenzbilder; **Machbarkeitstest in Phase 2** (im Browser; sonst Phase 8); Rückfall: "Anziehen"-Knopf deckt den Normalfall ohnehin ab |
| Farbanalyse per Foto unzuverlässig | Messung nur als Startwert, Pipette und Regler, weißes Blatt als Farbreferenz, Ergebnis als Palette mit ehrlichem Hinweis, alles auf dem Gerät |
| Pflegeetikett sagt nichts über Haltbarkeit | Keine Haltbarkeitsnote; Pflegeaufwand und echte Werte (getragen, gewaschen) |
| Gesichter in Fotos | Verpixeln auf dem Gerät vor jedem Upload, Metadaten entfernen, auf dem Server nichts speichern |
| Zu viele Funktionen für "sehr einfach" | Kern mit 35 Funktionen, Rest als Erweiterungen (Standard aus), Steckplatz-Architektur |
| Erweiterungen machen die App wieder kompliziert | Jede Erweiterung muss die Einfachheits-Regeln erfüllen; höchstens 1 Hinweiskarte pro Tag gilt für Kern und Erweiterungen zusammen; empfohlene Erweiterung höchstens einmal pro Monat |
| Vorschläge wirken generisch | Material-Wetter-Logik, Termine, Accessoires, Rotation, Teil tauschen (K13), Lernen über eine Frage pro Tag (K17), Herz (K18) |
| Stabilität und Tempo (Kritik an Konkurrenz) | Offline zuerst, Bildverarbeitung im Hintergrund, Leistungsziele (Abschnitt 15), Absturz-Monitoring ohne Inhalte |
| Shop-Produktfotos sind urheberrechtlich geschützt | Nur privat im eigenen Schrank, nie in Umfrage-Links oder Anzeigentexten |
| Verkaufsplattformen ohne offene Schnittstelle | Nur Text zum Kopieren und Link zur Suche |
| Wenig Zeit des Entwicklers | Launch nur mit dem Kern; Erweiterungen danach einzeln nach Nutzerwunsch |

---

## 7. Architektur

### 7.1 Offline zuerst
- Alles lokal (SQLite plus Fotodateien). Jede Tabelle: `id` (UUID im Gerät), `updated_at`, `deleted_at`.
- Ohne Konto bleibt alles lokal. Server nur für KI-Anfragen (ohne Speicherung), verschlüsselte Sicherung, Umfrage-Links.
- Für KI-Anfragen gibt es ein unsichtbares, anonymes Gerätekonto (Abschnitt 7.9); es enthält keine Schrankdaten.

### 7.2 Kamera-Pipeline (K01–K10, K26, K27)

```
Foto
 → lokal: Metadaten entfernen, Vorschaubild, Gesichts-/Personenerkennung, Textmenge messen
 → Vorentscheidung:
     Person mit Gesicht erkannt            → Typ "Spiegel-Selfie" → Gesicht verpixeln
     viel Text, kleines Objekt             → Typ "Etikett" (Größe oder Pflege entscheidet die KI)
     sonst                                 → Typ "Kleidungsstück" → Freistellen, Farben lokal
 → Gruppierung (Kamera-Sitzung): Etiketten hängen am zuletzt fotografierten Teil;
   neues Kleidungsfoto = neues Teil; Galerie: Zeitstempel-Lücken > 60 s trennen Teile
 → Warteschlange (läuft offline weiter, wenn wieder Netz):
     Kleidungsstück → ai-vision: classify_garment (Typ bestätigen + Merkmale)
     Größenschild   → lokale Texterkennung → ai-text: label_extract
     Pflegeetikett  → ai-vision: care_symbols
     Spiegel-Selfie → ai-vision: outfit_photo_garments → lokale Zuordnung
 → nicht im Schrank? → einmal pro Sitzung fragen: neues Teil oder Kaufcheck
 → Bestätigungskarten (nur Unsicheres sichtbar) → Speichern
```

### 7.3 Spiegel-Selfie-Zuordnung (K26)
- Pro erkanntem Teil Kandidaten bewerten: Kategorie (Pflicht), Farbabstand ΔE, Muster, Merkmale, Häufigkeit, Wäschestand.
- Ergebnis: sicher (vorausgewählt) | knapp (Auswahl aus 2–3 Bildern) | neu (als neues Teil vorschlagen).
- Schwellenwerte in `src/core/diary/matching.config.ts`, festgelegt durch den Machbarkeitstest in Phase 2.
- Optional später: Bild-Ähnlichkeit auf dem Gerät (kleines Embedding-Modell, ONNX Runtime), nur wenn der Test es nötig macht.

### 7.4 Outfit-Engine (K11–K18), komplett lokal ohne KI
1. **Filter:** Wetter und Tagesverlauf (Temperaturbereich pro Kategorie und Material), Regen (Materialien), Anlass/Formalität, Wäschestand; Erweiterungen hängen weitere Filter ein (E03, E04).
2. **Bausteine:** Oberteil, Unterteil oder Kleid, Schicht, Schuhe, Accessoires.
3. **Bewertung:** Farbharmonie, Farbtyp-Passung, einheitliche Formalität, Rotation, Herz, gelernte Gewichte (K17), Abwechslung zu den letzten 7 Tagen; Erweiterungen hängen Bewertungen ein (E13).
4. **Teil tauschen (K13):** Neuberechnung mit allen anderen Teilen fest.
5. **Begründung (K14) und Mitnehm-Hinweis (K15):** aus den stärksten Bewertungsgründen und dem Tagesverlauf.
- Tabellen (Material-Wetter, Formalität, Farbharmonie, Tragezahl bis Wäsche) in `src/data/`, vollständig unit-getestet.

### 7.5 Erweiterungs-System (Steckplätze)

Jede Erweiterung liegt in `src/extensions/<id>/` mit einem Manifest:

```ts
export const manifest: ExtensionManifest = {
  id: 'E05',
  name: 'Rückgabe und Garantie',
  description: 'Erinnert dich an Rücksendefristen und Garantien neuer Käufe.',
  icon: 'return',
  plan: 'free',                // 'free' | 'premium'
  requires: [],                // z. B. ['E15'] oder ['cloud']
  migrations: [...],           // eigene Tabellen mit Präfix ext_e05_
  slots: {
    todayCards: [...],         // Hinweiskarten (Kern entscheidet über die eine pro Tag)
    itemDetailSections: [...], // Abschnitte in der Teil-Ansicht
    cameraIntents: [...],      // zusätzliche Auswertungen nach Foto oder Teilen
    engineFilters: [...],      // harte Regeln für Outfits
    engineScorers: [...],      // Bewertungen für Outfits
    notificationProviders: [...],
    screens: [...],            // eigene Bildschirme, erreichbar über "Mehr"
    settingsSections: [...],
  },
};
```

- **Register** `src/extensions/registry.ts` listet alle Manifeste; welche aktiv sind, steht in Tabelle `extensions_state`. Steckplatz-Typen und -Logik liegen im Kern unter `src/core/steckplaetze/`.
- **Kompositionswurzel** `src/zusammenbau.ts`: einziger Ort, an dem die App das Register importiert. Kern, Bildschirme und Dienste importieren nie aus `src/extensions/` (ESLint-Regel).
- Der Kern stellt die Steckplätze bereit und kennt keine einzelne Erweiterung.
- Ausschalten: Steckplätze werden entfernt, Daten bleiben; "Daten löschen" entfernt die `ext_`-Tabellen.
- **Hinweiskarten-Warteschlange** im Kern: alle Karten (Kern und Erweiterungen) mit Priorität; angezeigt wird höchstens eine pro Tag.
- **Benachrichtigungs-Budget** im Kern: Standard 1 pro Tag; jede Erweiterung, die Benachrichtigungen sendet, erhöht das Budget nur nach Zustimmung beim Einschalten ("Darf diese Erweiterung dich erinnern?").
- Jede Erweiterung hat eigene Tests und muss ein- und ausgeschaltet werden können, ohne dass Kern-Tests sich ändern.

### 7.6 KI-Aufgaben (Edge Functions)

| Aufgabe | Eingabe | Ausgabe (JSON) |
|---|---|---|
| `classify_garment` | Bild Kleidungsstück | Fototyp-Bestätigung, Kategorie, Unterkategorie, Muster, Schnitt, Details, Formalität 1–5, Jahreszeit, Sicherheit |
| `label_extract` | Text aus lokaler Erkennung | Marke, Größen, Material in %, Land, Artikelnummer |
| `care_symbols` | Bild Pflegeetikett | genormte Symbol-Codes, Sicherheit |
| `outfit_photo_garments` | Spiegel-Selfie (Gesicht verpixelt) | Teile mit Kategorie, Farbe, Muster, Details, Bildbereich |
| `import_product` | Link-Text, Screenshot oder Mailtext | Name, Marke, Größe, Preis, Datum, Shop |
| `size_chart` (E12) | Screenshot Maßtabelle | Größen mit Maßen in cm |

- Bild auf max. 1024 px, Metadaten entfernt, Gesichter verpixelt. Feste System-Anweisung pro Aufgabe auf Deutsch, Temperatur 0, **nur JSON**, Zod-Prüfung, ein Neuversuch, sonst manueller Rückfall.
- **Keine Inhalte loggen, keine Bilder speichern**, nur Zähler und Fehlercodes.
- Jede Edge Function akzeptiert nur Anfragen mit gültigem Gerätekonto (Abschnitt 7.9); Kontingent wird **auf dem Server** gezählt, nie nur in der App.

### 7.7 Cloud-Sicherung (K30)
- Datenbank-Export und Fotos werden **auf dem Gerät verschlüsselt** (libsodium); Schlüssel aus einem Wiederherstellungs-Code, den der Nutzer einmal sicher aufbewahrt (als Bild speichern oder ausdrucken).
- Einfach für den Nutzer: Schalter an → E-Mail-Link oder Mit Apple anmelden → Wiederherstellungs-Code sichern → fertig; danach läuft die Sicherung automatisch bei WLAN.
- Wiederherstellen: neues Handy → "Ich habe eine Sicherung" → anmelden → Code eingeben.

### 7.8 Ordnerstruktur

```
modules/native-vision/  eigenes Expo-Modul (Swift, Kotlin), erst Teil B
src/
  app/                  Expo-Router-Bildschirme (heute, schrank, kamera, mehr)
  shared/               design-system/ reminders/ ai-client/
  core/
    camera/ grouping/ labels/ today/ engine/ wardrobe/ laundry/
    diary/ shopcheck/ selling/ color/ backup/ settings/ onboarding/ paywall/
    hints/              Hinweiskarten-Warteschlange
    notifications/      Budget und Planer
  extensions/
    registry.ts types.ts
    e01-mehr-auswahl/ ... e20-sprachbefehle/
  services/             ai/ weather/ calendar/ vision/ storage/ purchases/ crypto/
  data/                 materials.json formality.json colorNames.json careSymbols.json washDefaults.json
  db/                   schema.ts migrations/ repositories/
  i18n/                 de.json
supabase/
  migrations/  functions/ (attest, ai-vision, ai-text, backup, share-poll, revenuecat-webhook, delete-account)
tests/
  fixtures/  eval/      (KI-Testsatz; Fotos nicht im Repository)
docs/
  FORTSCHRITT.md ENTSCHEIDUNGEN.md TESTLISTE.md NUTZERTESTS.md DATENSCHUTZ.md FEEDBACK.md
```

### 7.9 Schutz der KI-Schnittstelle (Gerätekonto und Echtheitsprüfung)

Problem: Ohne Konto und mit Gratis-Kontingent könnte jeder die Edge Functions direkt aufrufen; die Kosten trägt der Betreiber.

- **Unsichtbares Gerätekonto:** Beim ersten KI-Aufruf legt die App per Supabase Anonymous Sign-in ein anonymes Konto an. Der Nutzer sieht davon nichts; es gibt weder E-Mail noch Passwort. Bei Cloud-Sicherung (K30) wird genau dieses Konto mit E-Mail oder Apple verknüpft.
- **Echtheitsprüfung:** Beim Anlegen und danach regelmäßig weist die App nach, dass sie die echte App auf einem echten Gerät ist: iOS App Attest, Android Play Integrity. Prüfung serverseitig in einer Edge Function `attest`; Ergebnis wird am Gerätekonto gespeichert.
- **Weiche Regel bei fehlgeschlagener Prüfung** (z. B. gerootetes oder altes Gerät, Entwicklungs-Build): KI bleibt nutzbar, aber mit kleinem Kontingent (Startwert 5 pro Monat) und strengerer Drosselung. Werte nur in `src/core/paywall/limits.ts` und gespiegelt in der Server-Konfiguration.
- **Drosselung pro Gerätekonto** (z. B. höchstens 20 Anfragen pro Minute) und globale Tagesobergrenze als Kostenbremse; bei Überschreitung freundlicher Hinweis und manueller Rückfall (Bildauswahl).
- **Zählung serverseitig** in `ai_usage` pro Gerätekonto und Monat; die lokale Tabelle `ai_usage` ist nur Anzeige.
- **Prototyp (Teil A):** Echtheitsprüfung entfällt, da sie in einer Webapp nicht verfügbar ist (Abschnitt 7.10). Schutz nur über Gerätekonto, Kontingent, Drosselung und eine niedrige globale Tagesobergrenze; Restrisiko akzeptiert, solange die App nicht öffentlich ist.
- **Neuinstallation** erzeugt ein neues Gerätekonto. Missbrauch dadurch wird durch die Echtheitsprüfung begrenzt (App Attest und Play Integrity liefern geräte- bzw. installationsbezogene Signale) und durch die globale Obergrenze gedeckelt. Restrisiko akzeptiert.
- **Datenschutz:** Gerätekonto-ID und Prüfergebnis sind personenbezogene Daten; in Datenschutzerklärung und `docs/DATENSCHUTZ.md` aufnehmen. Löschung über "Konto löschen" (K31) oder automatisch nach 12 Monaten ohne Nutzung.

### 7.10 Prototyp-Variante (Teil A, Webapp)

Der Prototyp läuft als **Webapp im Browser** (Expo Web, als Home-Bildschirm-App auf dem iPhone). Derselbe Code wird in Teil B zur Store-App; Plattform-Unterschiede liegen hinter den Schnittstellen in `src/services/`.

| Thema | Prototyp (Webapp) | Endausbau (Teil B) |
|---|---|---|
| Auslieferung | Netlify; `main` = feste Adresse für den Home-Bildschirm, andere Branches = Vorschau-Adressen | App Store, Google Play |
| Lokale Daten | im Browser (IndexedDB bzw. SQLite im Browser, Wahl in Phase 1); `navigator.storage.persist()` anfragen; Export früh (Phase 3) | expo-sqlite |
| Kamera | Kamera im Browser (Foto-Auswahl mit Kamera bzw. getUserMedia) | expo-camera oder react-native-vision-camera |
| Verkleinern, Metadaten entfernen | Canvas im Browser (neu kodieren entfernt Metadaten; per Test belegen) | expo-image-manipulator |
| Freistellen (K04) | U²-Net (u2netp, ca. 5 MB, Apache-2.0) mit onnxruntime-web direkt im Browser, auf dem Gerät; Rückfall: Originalfoto | Apple Vision / ML Kit über `native-vision` |
| Farben (K05), Farbtyp (K28) | Pixel per Canvas lesen | wie Prototyp oder `native-vision` |
| Fototyp-Erkennung (K01) | Gesichtserkennung im Browser (Selfie); sonst bestimmt die KI den Typ im selben Aufruf; offline wird das Foto vorgemerkt | lokale Vorentscheidung (Abschnitt 7.2) |
| Größenschild (K07) | Foto direkt an die KI (Etiketten enthalten keine Personendaten) | lokale Texterkennung, dann `label_extract` |
| Spiegel-Selfie (K26) | Gesichtserkennung und Verpixeln im Browser auf dem Gerät (z. B. MediaPipe Face Detection, Lizenz prüfen); **Machbarkeitstest in Phase 2** | `native-vision` |
| Teilen aus Shop (K10) | Link oder Text aus der Zwischenablage einfügen | Teilen-Menü des Systems |
| Vorabend-Outfit (K16) | **Web-Push** über Supabase (geplanter Versand, VAPID); nur für Home-Bildschirm-App ab iOS 16.4; Bild des Outfits nur, wenn ohne Upload des Fotos machbar, sonst Text | lokale Benachrichtigung |
| Kalender (K11) | kein Zugriff; Anlass per Antippen statt aus Terminen | expo-calendar |
| Offline | Service Worker cacht die App (spätestens Phase 4) | nativ |
| Echtheitsprüfung (7.9) | entfällt; Schutz nur über Gerätekonto, Kontingent, Drosselung und niedrige globale Tagesobergrenze | App Attest / Play Integrity |
| Widget (K32), Cloud-Sicherung (K30), Bezahlung | entfallen | Phasen 9–11 |
| Plattform | iPhone (Safari) getestet; Testpersonen per Link, auch Android | iPhone und Android gleichwertig |

- Regel: Bibliotheken müssen im Browser laufen und dürfen den späteren Store-Weg nicht verbauen (lieber Expo-Pakete mit Web-Unterstützung).
- Modelle (U²-Net, Gesichtserkennung) werden mit der App ausgeliefert, nicht von fremden Servern geladen.
- **Umzug in die Store-App (Teil B):** Daten wandern per Export/Import; Speicher, Kamera, Benachrichtigungen und Bildverarbeitung bekommen native Umsetzungen hinter denselben Schnittstellen.

---

## 8. Datenmodell

**Kern (lokal; Cloud nur als verschlüsselte Sicherung)**
- `items` (id, name, category, subcategory, pattern, cut, details_json, formality, seasons[], status: `active|sold|donated|discarded`, purchase_price_cents?, purchase_date?, shop?, favorite, created_at, updated_at, deleted_at)
- `item_photos` (id, item_id, kind: `front|back|worn|label|care|other`, uri, thumb_uri, mask_uri?)
- `item_colors` (item_id, rank, hex, lab_l, lab_a, lab_b, name_de)
- `item_labels` (item_id, brand?, size_system?, size_value?, size_secondary?, composition_json, origin?, article_no?)
- `item_care` (item_id, symbols[], care_effort: `low|mid|high`)
- `brand_size_profile` (brand, category, size_value, sample_count)
- `outfits` (id, favorite, source: `engine|diary|ext`)
- `outfit_items` (outfit_id, item_id, slot)
- `wear_logs` (id, date, outfit_id?, event_title?, weather_json, feedback_json?, source: `wear_button|selfie|evening`)
- `wear_log_items` (wear_log_id, item_id)
- `laundry_state` (item_id, state: `clean|laundry`, wears_since_wash, washes_total)
- `planned_outfit` (date, outfit_id) – Vorabend-Festlegung
- `color_profile` (skin_l, undertone, hair_hex, eye_hex, contrast, palette_json, calibrated)
- `engine_weights` (key, value)
- `hints` (id, source, priority, payload_json, shown_at?, dismissed_at?)
- `shopcheck_history` (id, photo_uri, attributes_json, price_cents?, result_json, decision?)
- `extensions_state` (extension_id, enabled, enabled_at, notifications_allowed)
- `settings` (key, value), `ai_usage` (month, count)

**Erweiterungen:** eigene Tabellen mit Präfix `ext_<id>_`, angelegt über die Migrationen im Manifest.

**Server (Supabase):** `accounts` (auch anonyme Gerätekonten), `device_attestations` (account_id, platform, status: `verified|failed|pending`, checked_at), `ai_usage` (account_id, month, count), `backups` (Metadaten verschlüsselter Dateien), `shared_wardrobes` (E16), `polls` (E18, ablaufend). Row Level Security für alles, mit SQL-Tests.

---

## 9. Technik-Stack

| Bereich | Wahl |
|---|---|
| App | Expo (React Native, TypeScript), Expo Router |
| Builds und Updates | EAS Build, EAS Submit, EAS Update (ohne Mac) |
| Mindestversion | iOS 17, Android 10 (vor Start prüfen; iOS 17 für Freistellen über Apple Vision) |
| Lokale Daten | expo-sqlite mit asynchronen Abfragen und eigenen Migrationen (ohne Drizzle: blockiert im Browser, siehe `docs/ENTSCHEIDUNGEN.md`); Fotos als WebP (max. 1600 px, Vorschau 400 px) |
| Zustand | Zustand (UI), TanStack Query (Server) |
| Bildverarbeitung | Prototyp: siehe Abschnitt 7.10 (U²-Net und Gesichtserkennung im Browser, Canvas). Teil B: eigenes Expo-Modul `native-vision`: iOS Apple Vision (Freistellen, Text, Gesichter, Rechtecke), Android Google ML Kit (Subject Segmentation, Text, Gesichter); vorher prüfen, ob gepflegte Bibliotheken reichen (z. B. `react-native-subject-lift`, MIT) |
| Kamera | Prototyp: Kamera im Browser; Teil B expo-camera oder react-native-vision-camera |
| Webapp-Hosting (Teil A) | Netlify (kostenlos), Home-Bildschirm-App per Web-Manifest |
| Farben | eigener Code (k-Means, Lab, ΔE, deutsche Farbnamen) |
| Kalender | expo-calendar (nur lesen) |
| Wetter | Bright Sky (Daten Deutscher Wetterdienst, CC BY 4.0, Namensnennung); Rückfall Open-Meteo **kommerzieller** Plan |
| Benachrichtigungen | expo-notifications mit eigenem Planer (iOS: max. 64 geplante) und Budget |
| Widget | iOS-Widget-Target per Config-Plugin, Android-Widget-Bibliothek |
| Backend | Supabase Frankfurt (eu-central-1): Auth (inkl. Anonymous Sign-in), Storage, Edge Functions |
| Echtheitsprüfung | iOS App Attest, Android Play Integrity API (Abschnitt 7.9) |
| KI | Mistral Small 3.2 (Bild und Text) über Edge Function, austauschbar |
| Verschlüsselung | libsodium |
| Bezahlung | RevenueCat |
| Monitoring | Sentry EU-Region, ohne Fotos und Texte |
| Tests | Jest, React Native Testing Library, KI-Testsatz, Nutzertests |

---

## 10. KI: Kosten und Regeln

- Mistral Small 3.2: laut Preisübersichten **0,10 $ pro Million Eingabe-Tokens, 0,30 $ pro Million Ausgabe-Tokens**, Bilder zusätzlich in Tokens. Grobe Schätzung **unter 0,001 $ pro Bild-Aufgabe**; in Phase 2 mit echten Aufrufen messen und in `docs/ENTSCHEIDUNGEN.md` festhalten.
- Auftragsverarbeitungsvertrag mit Mistral, Verarbeitung in der EU, keine Nutzung zum Training (Vertrag prüfen).
- Anbieter hinter Schnittstelle, zweiter Anbieter als Rückfall konfigurierbar.
- **Kennzeichnung:** Erkennungen auf Bestätigungskarten als "erkannt" markiert (kleines Symbol); Datenschutz-Übersicht erklärt, wo KI arbeitet (EU-KI-Verordnung, Transparenzpflichten seit 2. August 2026). Begründungen (K14) stammen aus Textbausteinen.

---

## 11. Datenschutz und Recht (Checkliste)

**Vor dem Start**
- [ ] Nebentätigkeit beim Arbeitgeber anzeigen oder genehmigen lassen
- [ ] App-Name: Markenrecherche (DPMA, EUIPO), Domain, Store-Namen
- [ ] Konten: Expo und Supabase (Phase 0), Mistral (Phase 2); erst bei "Store ja": Apple-Entwickler (99 $/Jahr, Freischaltung kann Tage dauern), Google Play (25 $ einmalig), RevenueCat, Sentry, Android-Testgerät

**Vor dem ersten externen Tester**
- [ ] Gewerbe anmelden
- [ ] Impressum in App und Store
- [ ] Datenschutzerklärung (Anbieter, Zwecke, Speicherorte, Dauer, Rechte; Verpixelung und lokale Farbanalyse beschreiben)
- [ ] Auftragsverarbeitungsverträge: Supabase, Mistral, Sentry, RevenueCat
- [ ] Verzeichnis der Verarbeitungstätigkeiten, technische und organisatorische Maßnahmen
- [ ] Prüfen, ob eine Datenschutz-Folgenabschätzung nötig ist (Personenfotos; Gegenmaßnahmen: lokal verpixeln, nicht speichern)
- [ ] Hinweis: Kinder nicht mitfotografieren; erkannte Gesichter werden immer verpixelt
- [ ] Namensnennung Wetterdaten ("Deutscher Wetterdienst")
- [ ] Mindestalter für Konten 16 Jahre
- [ ] Anonymes Gerätekonto und Echtheitsprüfung (Abschnitt 7.9) in der Datenschutzerklärung beschrieben

**Vor dem Store-Launch**
- [ ] Konto-Löschung in der App (Apple-Regel 5.1.1(v)); App ohne Konto nutzbar
- [ ] Datenschutz-Angaben App Store und Google Play vollständig
- [ ] Abo-Bedingungen klar vor dem Kauf, Wiederherstellen-Knopf
- [ ] KI-Kennzeichnung
- [ ] Shop-Produktfotos nur privat
- [ ] Keine Körper- oder Gesundheitsversprechen in Store-Texten
- [ ] Rechtstexte einmal von einer Fachperson prüfen lassen

---

## 12. Was die App bewusst NICHT macht

- Keine Haltbarkeits- oder Qualitätsnoten.
- Keine Aussagen über Körperform, Gewicht oder "Problemzonen"; keine Körperfotos.
- Keine öffentliche Community, kein Feed, keine Werbung, kein Datenverkauf.
- Kein automatisches Einstellen auf Verkaufsplattformen.
- Keine KI-generierte virtuelle Anprobe.
- Keine Affiliate-Links im ersten Jahr.

---

## 13. Geldmodell (vorläufig, noch offen)

Das Geldmodell ist noch nicht entschieden. **Vorläufig Freemium mit Abo.** Grenzen und Premium-Kennzeichnung nur in `src/core/paywall/limits.ts` und in den Erweiterungs-Manifesten.

**Gratis:** unbegrenzt Teile, Heute-Outfit, Anziehen, Vorabend-Outfit, Wäsche, Farbtyp, Größenprofil, Widget, alle Gratis-Erweiterungen, **30 KI-Erkennungen pro Monat** (Wert nach Beta anpassen; 5 pro Monat bei fehlgeschlagener Echtheitsprüfung, Abschnitt 7.9), Export, Konto löschen.

**Premium:** unbegrenzte KI-Erkennungen (Etiketten, Spiegel-Selfie, Kaufcheck, Galerie-Stapel, Teilen-Import), Cloud-Sicherung, alle Premium-Erweiterungen.

**Preisvorschlag (testen):** 3,99 € / Monat oder 29,99 € / Jahr, 14 Tage Probezeit.

**Konkurrenz zur Orientierung:** Acloset gratis bis 100 Teile, Abos ab 3,99 € / Monat; Whering kostenlos; GetWardrobe gratis bis 100 Teile, ab 9,99 $ / Monat; Stylebook einmalig 4,99 $.

**Laufende Kosten:** Supabase Free für Entwicklung (pausiert nach 1 Woche Inaktivität), danach Pro 25 $ / Monat. Fotos als WebP ca. 150–300 KB.

---

## 14. Design-System

- Kleidung steht im Mittelpunkt: heller, neutraler Hintergrund, große Bilder, wenig Text.
- Eine Akzentfarbe nur für die Hauptaktion.
- Systemschrift, Fließtext mindestens 16 pt, Tippflächen mindestens 48 × 48 pt.
- Komponenten zuerst: Hauptknopf, Outfit-Bild (Collage aus freigestellten Teilen, Teile einzeln antippbar), Bestätigungskarte, Bildauswahl (statt Listen), Hinweiskarte, Regler mit Live-Vorschau, Pipette mit Lupe, Waschsymbol-Raster, Kaufcheck-Ergebnis (drei Zeilen), Rückgängig-Leiste, leerer Zustand mit Kamera-Knopf, Erweiterungs-Kachel mit Schalter.
- Texte: Du-Form, kurz, freundlich, nie über Körper urteilen, nie vorwurfsvoll.
- Bewegung dezent; aus im reizarmen Modus und bei "Bewegung reduzieren".

---

## 15. Qualität

- **Unit-Tests:** Fototyp-Vorentscheidung, Gruppierung, Farben, Farbharmonie und Palette, Engine (Filter, Bewertung, Teil tauschen, Begründung, Mitnehm-Hinweis), Material-Wetter, Waschgruppen, Größen und Größenprofil, Preis pro Tragen, Selfie-Zuordnung, Hinweiskarten-Warteschlange, Benachrichtigungs-Budget, Erweiterungs-Register (ein/aus ohne Kern-Änderung), Limits und serverseitiges Kontingent inkl. weicher Regel bei fehlgeschlagener Echtheitsprüfung, Verschlüsselung.
- **KI-Testsatz** (`tests/eval/`): 30 Größenschilder, 20 Pflegeetiketten, 50 Spiegel-Selfies, 40 Kleidungsfotos für Fototyp und Kategorie; Fotos privat, nicht im Repository; Skript misst Trefferquoten.
- **Nutzertests** nach Regel 14 (Abschnitt 2) in jeder Phase mit Oberfläche.
- **Leistung:** Heute-Bildschirm mit Outfit unter 1 s; Freistellen unter 2 s pro Foto auf einem 3 Jahre alten Handy; Schrank mit 500 Teilen scrollt flüssig.
- **SQL-Tests** für alle RLS-Regeln.
- **Barrierefreiheit:** vor jedem Release mit VoiceOver/TalkBack und größter Schrift.

---

## 16. Arbeitsweise ohne Mac (nur Smartphone)

**Teil A – Prototyp (Webapp, kein Apple-Entwicklerkonto)**
1. Code auf GitHub; Claude Code arbeitet in Branches und öffnet Pull Requests.
2. **Netlify** baut bei jedem Push: jeder Branch bekommt eine Vorschau-Adresse; `main` ist die feste Adresse der Home-Bildschirm-App. Der Entwickler entscheidet per Merge in der GitHub-App, wann sich seine App ändert.
3. GitHub Actions prüfen bei jedem Push Formatierung, Lint, Typprüfung und Tests; Ergebnis sichtbar in der GitHub-App.
4. Supabase über Web-Dashboard und Migrationen im Repository; Deploy der Edge Functions per GitHub Action.
5. Pro Sitzung ein klar umrissenes Ziel aus der aktuellen Phase.
6. **Risiko Browser-Speicher:** Safari kann Daten von Webseiten löschen (bei Speichermangel, bei Webseiten ohne Home-Bildschirm nach 7 Tagen ohne Nutzung). Daher als Home-Bildschirm-App nutzen, dauerhaften Speicher anfragen und Export früh (Phase 3).

**Teil B – Store-Vorbereitung (eigene Builds)**
1. EAS Build in der Cloud; Entwicklungs-Build pro nativer Änderung (Modul `native-vision`, Widget, Berechtigungen), installiert auf dem iPhone (internal distribution, Gerät vorher registriert) und auf Android (Installationsdatei direkt).
2. Voraussetzung iOS: bezahltes Apple-Entwicklerkonto; Zugang für EAS über einen App-Store-Connect-API-Schlüssel, der im Browser erzeugt und bei Expo hinterlegt wird (kein Mac, keine interaktive Anmeldung).
3. Builds werden über GitHub Actions per Knopf in der GitHub-App gestartet; jeder native Fehler kostet einen Build, daher gepflegte Bibliotheken vor eigenem nativem Code.
4. Reine JavaScript-Änderungen per EAS Update.

---

## 17. Phasenplan mit Abnahmekriterien

**Vorgehen:** Erst einen Prototyp als Webapp bauen, ihn als Home-Bildschirm-App auf dem iPhone selbst nutzen (Teil A). Danach entscheiden, ob die App in die Stores geht (Teil B). Erweiterungen erst nach dem Launch (Teil C).

**Grobe Schätzung** bei etwa 4 Stunden pro Woche mit Claude Code: Prototyp (Teil A) ca. 4 bis 7 Monate; Store-Vorbereitung (Teil B) weitere ca. 4 bis 8 Monate. Ehrliche Unsicherheit: hoch.

**Nutzertests (Regel 14) im Prototyp reduziert:** mit 5 Personen nur nach Phase 1 (Klick-Prototyp) und vor der Store-Entscheidung; in den übrigen Phasen Eigentest. Testpersonen bekommen einen Link (iPhone oder Android).

### Teil A – Prototyp (Webapp, iPhone, Eigennutzung)

Was im Prototyp fehlt oder anders ist, steht in Abschnitt 7.10.

#### Phase 0 – Grundlagen
- Repository, Expo-Projekt (TypeScript, Expo Router, Web-Ausgabe), ESLint, Prettier, Jest
- `CLAUDE.md`, `docs/`-Dateien
- Home-Bildschirm-App: Manifest, Symbole, Apple-Angaben
- Konten (Entwickler): Netlify, Supabase (kostenlos). GitHub-Secret `SUPABASE_ACCESS_TOKEN`
- GitHub Actions: Prüfung bei jedem Push; Supabase-Deploy. Netlify baut selbst.
- Supabase-Projekt in Frankfurt, Edge Function "hallo"
- **Abnahme:** Webapp öffnet sich auf dem iPhone über die feste Adresse und lässt sich zum Home-Bildschirm hinzufügen; Tests grün (CI); Edge Function antwortet in der App.

#### Phase 1 – Klick-Prototyp und Fundament
- Design-System (Abschnitt 14), Navigation mit drei Bereichen (Abschnitt 3.1), i18n, lokale Datenbank, Foto-Speicher
- **Klick-Prototyp mit Beispieldaten** für alle Abläufe aus Abschnitt 3.2 außer Spiegel-Selfie (ohne echte Logik)
- Erweiterungs-Register mit Steckplätzen (Abschnitt 7.5) und einer Test-Erweiterung, Hinweiskarten-Warteschlange, Benachrichtigungs-Budget
- **Abnahme:** Nutzertest mit 5 Personen: jeder Ablauf wird ohne Erklärung in der Soll-Tippzahl geschafft (sonst Prototyp vereinfachen); Test-Erweiterung lässt sich ein- und ausschalten, ohne dass Kern-Tests sich ändern; VoiceOver liest alle Knöpfe.

#### Phase 2 – Machbarkeitstests (Freistellen und KI)
*Stand: Teil auf dem Gerät (Freistellen, Gesichter verpixeln) vorgezogen und gebaut; KI-Teil wartet auf Supabase und Mistral (siehe `docs/FORTSCHRITT.md`).*
- **Freistellen auf dem Gerät** (Abschnitt 7.10): U²-Net (u2netp, Apache-2.0) mit onnxruntime-web im Browser
- **Spiegel-Selfie auf dem Gerät:** Gesichtserkennung und Verpixeln im Browser; Edge-Function-Aufgabe `outfit_photo_garments`; Zuordnung (Abschnitt 7.3)
- Edge Function `ai-vision` mit Mistral (Kleidungsstück inkl. Fototyp, Größenschild als Bild, Pflegeetikett), Zod-Schemas
- Gerätekonto ohne Echtheitsprüfung (Abschnitt 7.9, Prototyp-Stufe): Anonymous Sign-in, serverseitiges Kontingent, Drosselung, globale Tagesobergrenze
- **Machbarkeitstests ohne Nutzer-Oberfläche:** versteckter Testbildschirm (nur im Entwicklungsmodus sichtbar) verarbeitet Testfotos aus der Galerie (Freistellen und Gesichtserkennung auf dem Gerät, KI-Aufgaben über die Edge Function) und exportiert die Ergebnisse als JSON-Datei; ein Skript wertet sie gegen die erwarteten Werte in `tests/eval/` aus.
  - Umfang: Freistellen (20 Fotos), Fototyp-Erkennung (40), Gruppierung (10 Serien), Größenschilder (30), Pflegeetiketten (20), Spiegel-Selfies (50 Fotos gegen ca. 40 Teile)
- Kosten pro Aufgabe mit echten Aufrufen messen
- Missbrauchstest: Aufruf ohne gültiges Gerätekonto wird abgelehnt; Kontingent, Drosselung und Tagesobergrenze greifen
- **Abnahme:** Freistellen: ≥ 80 % der Fotos brauchbar (Urteil des Entwicklers), höchstens 6 s pro Foto auf dem eigenen iPhone; Fototyp ≥ 95 %; Gruppierung ≥ 95 %; Größenschild ≥ 90 %; Pflegesymbole ≥ 80 %; Spiegel-Selfie: jedes Gesicht verpixelt (0 Ausreißer) und richtiges Teil unter den Top 3 in ≥ 80 %; Missbrauchstest bestanden. **Wird ein Wert nicht erreicht:** anhalten, Ergebnisse vorlegen, Entscheidung einholen (Rückfall Freistellen: Untergrund-Verfahren oder Originalfoto; Rückfall Selfie: zurück nach Phase 8).

#### Phase 3 – Kamera und Erfassung
- K01–K09 in der Prototyp-Variante (Abschnitt 7.10), K10 über die Zwischenablage, K29 (Datenschutz-Übersicht, KI abschaltbar)
- Export als ZIP (Teil von K31), wegen des Expo-Go-Risikos (Abschnitt 16)
- **Abnahme:** 10 Teile mit Etiketten in unter 8 Minuten erfasst; jedes Teil in höchstens 3 Tipps bestätigt; keine Formularansicht im Normalablauf; App funktioniert mit abgeschalteter KI (Bildauswahl); Offline-Aufträge laufen bei Netz nach; Export enthält alle Daten und Fotos.

#### Phase 4 – Heute und Outfit-Engine
- K11–K20, K24 (Wäsche automatisch); Anlass per Antippen statt Kalender
- Vorabend-Benachrichtigung per **Web-Push** (Supabase: Abo speichern, geplanter Versand zur gewählten Uhrzeit)
- Service Worker: App startet offline
- **Abnahme:** Bei 5 °C und Regen weder Sandalen noch Wildleder; Termin "Vorstellungsgespräch" ergibt formelles Outfit; Teile in der Wäsche erscheinen nicht; Teil tauschen ändert nur dieses Teil; Vorabend-Outfit erscheint morgens unverändert; höchstens 1 Benachrichtigung und 1 Hinweiskarte pro Tag; Vorabend-Push kommt auf dem iPhone pünktlich an (± 5 Minuten); Vorschlag auch offline.

#### Phase 5 – Schrank
- K21–K23, K25
- **Abnahme:** Suche "blaue Jeans" findet passende Teile; jeder Wert in der Teil-Ansicht in einem Tipp änderbar; Größenprofil pro Marke korrekt nach 3 Teilen derselben Marke; Anzeigentext enthält Marke, Größe, Material, Zustand und wird kopiert.

#### Phase 6 – Spiegel-Selfie, Kaufcheck und Farbtyp
- K26 (nur wenn der Machbarkeitstest in Phase 2 bestanden ist), K27, K28 (Farbtyp komplett auf dem Gerät, Pixel per Canvas)
- **Abnahme:** Spiegel-Selfie in höchstens 2 Tipps eingetragen, knappe Treffer werden immer nachgefragt, kein unverpixeltes Gesicht erreicht den Server (Netzwerk-Protokoll); Kaufcheck-Ergebnis in unter 10 s; Farbtyp in unter 2 Minuten; kein Farbtyp-Selfie verlässt das Gerät (Prüfung per Netzwerk-Protokoll der App); Palette beeinflusst Vorschläge und Kaufcheck.
- ➜ **Meilenstein: Store-Entscheidung.** Mindestens 4 Wochen Eigennutzung, danach Nutzertest mit 5 Personen. Ergebnis ("Store ja/nein", was fehlt) in `docs/ENTSCHEIDUNGEN.md`. Bei "nein" endet der Plan hier oder wird überarbeitet.

### Teil B – Store-Vorbereitung (nur bei "Store ja")

#### Phase 7 – Native Basis und Umzug aus der Webapp
- Apple-Entwicklerkonto, Android-Testgerät, EAS-Entwicklungs-Builds (Abschnitt 16, Teil B)
- Native Umsetzungen hinter den Schnittstellen in `src/services/` (Speicher, Kamera, Benachrichtigungen, Kalender); Import der Webapp-Exportdatei
- Expo-Modul `native-vision` (Freistellen über Apple Vision / ML Kit, Texterkennung, Gesichter, Rechtecke) auf beiden Plattformen; lokale Fototyp-Vorentscheidung (Abschnitt 7.2); prüfen, ob es U²-Net ersetzt
- Echtheitsprüfung (Abschnitt 7.9): Edge Function `attest`, App Attest, Play Integrity, weiche Regel
- K10 über das Teilen-Menü des Systems; react-native-vision-camera falls Kamera-Tempo es nötig macht
- **Abnahme:** Entwicklungs-Build auf iPhone und Android; Export aus der Webapp vollständig importiert; Machbarkeitswerte aus Phase 2 auf beiden Plattformen erreicht; Echtheitsprüfung funktioniert, fehlgeschlagene Prüfung führt zum kleinen Kontingent.

#### Phase 8 – Spiegel-Selfie nativ
- K26 mit `native-vision` (Gesichtserkennung nativ); falls der Webapp-Test in Phase 2 scheiterte: Machbarkeitstest (50 Selfies gegen ca. 40 Teile) hier
- **Abnahme:** richtiges Teil unter den Top 3 in ≥ 80 % (sonst anhalten und Entscheidung einholen); Selfie in höchstens 2 Tipps eingetragen; knappe Treffer werden immer nachgefragt; kein unverpixeltes Gesicht erreicht den Server (Netzwerk-Mitschnitt).

#### Phase 9 – Sicherung, Import, Konto
- K30, K31 (Import, Konto löschen)
- **Abnahme:** Cloud-Sicherung in höchstens 4 Schritten eingerichtet; Wiederherstellung von iPhone auf Android vollständig; Server-Dateien ohne Schlüssel nicht lesbar; Konto-Löschung entfernt alle Cloud-Daten; RLS-Tests grün.

#### Phase 10 – Bezahlung und Erweiterungen-Bildschirm
- RevenueCat, Paywall, Probezeit, Wiederherstellen, `limits.ts`, Webhook
- K34 (Erweiterungen-Bildschirm mit Premium-Kennzeichnung, Empfehlungslogik)
- **Abnahme:** Kauf, Kündigung, Wiederherstellung im Sandbox-Modus auf beiden Plattformen; Grenzen exakt wie Abschnitt 13; Paywall erscheint nur bei Premium-Aktionen, nie beim Öffnen der App.

#### Phase 11 – Widget, Einstieg, Beta, Launch
- K32, K33 (Barrierefreiheits-Durchgang), K35
- Leistungsziele (Abschnitt 15), leere und Fehlerzustände
- **Geschlossene Beta** (TestFlight und Google Play intern), 20 bis 40 Tester; Rückmeldungen und gewünschte Erweiterungen in `docs/FEEDBACK.md`
- Rechtstexte, Store-Einträge, Screenshots, Datenschutz-Angaben (Abschnitt 11)
- **Abnahme:** Neue Testperson bekommt ihr erstes Outfit in unter 5 Minuten ab Installation; Widget zeigt heutiges Outfit; Checkliste Abschnitt 11 komplett; Store-Freigabe auf beiden Plattformen.

### Teil C – Erweiterungen nach dem Launch

Reihenfolge innerhalb der Pakete nach Beta-Feedback. **Gemeinsame Abnahme für jede Erweiterung:** ein- und ausschaltbar ohne Änderung am Kern; eigene Tests grün; Einfachheits-Regeln erfüllt; ausgeschaltet keinerlei sichtbare Spuren; Nutzertest mit 3 Personen.

#### Phase 12 – Paket "Alltag" (lokal, meist gratis)
- E01 Mehr Auswahl, E02 Outfit-Baukasten, E03 Uniform-Formel, E04 Wohlfühl-Filter, E05 Rückgabe und Garantie, E06 Wunschliste, E19 Aussortieren und Spenden
- **Zusätzliche Abnahme:** E03 und E04 schränken Vorschläge korrekt ein (Unit-Tests); E05 erzeugt aus geteilter Bestellmail eine Frist mit Erinnerung.

#### Phase 13 – Paket "Überblick"
- E07 Pflege-Plus, E08 Statistik und Rückblick, E09 Budget, E10 Was fehlt?, E14 Anlässe und Personen
- **Zusätzliche Abnahme:** "Was fehlt?" nennt eine nachvollziehbare Zahl neuer Outfits; Statistik stimmt mit Tagebuch überein.

#### Phase 14 – Paket "Passform und Reisen"
- E11 Reise-Packliste, E12 Passform (inkl. Edge-Function-Aufgabe `size_chart`), E13 Proportionen
- **Zusätzliche Abnahme:** Vermessen per Foto mit A4-Blatt weicht höchstens 2 cm vom Maßband ab (5 Testteile); Maßtabellen-Screenshot korrekt eingelesen; Proportionen ohne Foto und ohne Gewicht.

#### Phase 15 – Paket "Familie und Teilen"
- E15 Profile und Kinderkleiderschrank, E16 Geteilter Schrank, E17 Familien-Abstimmung, E18 Outfit-Umfrage, E20 Sprachbefehle
- **Zusätzliche Abnahme:** geteilter Schrank zwischen iPhone und Android funktioniert; Umfrage-Link läuft nach 48 Stunden ab und Bilder sind gelöscht; keine Shop-Fotos in Umfragen; Kinder-Profile ohne Geburtsdatum.

---

## 18. Risiken und Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Automatische Fototyp-Erkennung oder Gruppierung zu ungenau | Machbarkeitstest Phase 2, "Ändern" auf der Karte, Foto per Ziehen umhängen |
| Spiegel-Selfie zu ungenau | Nachfragen statt Raten, Referenzbilder, "Anziehen"-Knopf deckt den Normalfall |
| App wird mit Erweiterungen unübersichtlich | Steckplätze, gemeinsame Hinweiskarten- und Benachrichtigungsgrenzen, Standard aus |
| Nutzer verstehen Abläufe nicht | Klick-Prototyp und Nutzertest in Phase 1, danach in jeder Phase |
| Freistellen schlecht bei hellen Teilen auf hellem Grund | Tipp "dunkler Untergrund", Pinsel-Korrektur |
| Wetter- oder Kalenderdienst nicht erreichbar | Vorschlag ohne diese Daten, freundlicher Hinweis statt Fehler |
| KI-Anbieter ändert Preise | Schnittstelle, zweiter Anbieter, Kontingente |
| Missbrauch der KI-Schnittstelle (Kostenfalle) | Gerätekonto, Echtheitsprüfung, serverseitiges Kontingent, Drosselung, globale Tagesobergrenze (Abschnitt 7.9) |
| Datenschutzverstoß durch Personenfotos | Verpixeln auf dem Gerät, keine Speicherung, Prüfung per Netzwerk-Mitschnitt |
| Safari löscht Webapp-Daten | Home-Bildschirm-App, dauerhaften Speicher anfragen, Export früh (Phase 3) |
| Web-Push auf dem iPhone unzuverlässig | Test in Phase 4; Rückfall: Outfit für morgen nur in der App |
| Umzug Webapp → Store-App aufwendiger als gedacht | Plattform-Code nur hinter `src/services/`; Export/Import-Format früh festlegen |
| Freistellen mit U²-Net zu langsam oder zu schlecht | Machbarkeitstest Phase 2; Rückfall Untergrund-Verfahren oder Originalfoto |
| Wenig Zeit des Entwicklers | Prototyp zuerst, Store nur bei Erfolg, Launch nur mit Kern, Erweiterungen einzeln danach, keine zweite App parallel |

---

## 19. Offene Entscheidungen

- [ ] **Geldmodell** (vorläufig Freemium, Abschnitt 13)
- [ ] App-Name nach Markenrecherche
- [ ] Gratis-Kontingent KI und Preise nach Beta
- [ ] Reihenfolge der Erweiterungs-Pakete nach Beta-Feedback
- [ ] Kaufcheck-Frage: eigene Frage pro Kamera-Sitzung oder zwei Knöpfe auf der Bestätigungskarte (Prototyp; Nutzertest Phase 1)
- [x] Ob Android ab Phase 0 gleichwertig getestet wird → **Nein:** Prototyp als Webapp, getestet auf dem iPhone; Android gleichwertig ab Teil B (siehe `docs/ENTSCHEIDUNGEN.md`)
- [ ] **Store ja/nein** nach dem Prototyp (Meilenstein nach Phase 6)

---

## Anhang A – Vorlage für `CLAUDE.md`

Siehe `CLAUDE.md` im Repository (aus dieser Vorlage erzeugt).

## Anhang B – Start-Anweisung für die erste Claude-Code-Sitzung

```
Lies KLEIDERSCHRANK_PLAN.md vollständig. Lege dann CLAUDE.md nach Anhang A an und
erstelle docs/FORTSCHRITT.md, docs/ENTSCHEIDUNGEN.md, docs/TESTLISTE.md,
docs/NUTZERTESTS.md, docs/DATENSCHUTZ.md und docs/FEEDBACK.md als Gerüst.
Schlage mir danach einen Plan für Phase 0 in Stichpunkten vor und warte auf meine
Freigabe, bevor du Code schreibst. Ich arbeite nur vom Smartphone ohne Mac;
berücksichtige das bei allen Schritten.
```
