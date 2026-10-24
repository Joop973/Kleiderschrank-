# Einrichtung (vom Handy aus)

Einmalig nötig, damit die Webapp auf dem iPhone läuft und der Server antwortet. Reihenfolge einhalten.

## 1. Supabase (Server)
1. Auf supabase.com ein Konto anlegen, **New project**, Region **Frankfurt (eu-central-1)**. Datenbank-Passwort sicher aufbewahren.
2. Projekteinstellungen → **API**: **Project URL** und **Publishable key** (beginnt mit `sb_publishable_`) kopieren.
3. Projekt-Referenz = der Teil der URL zwischen `https://` und `.supabase.co`.
4. Kontoeinstellungen → **Access Tokens** → **Generate new token**, Name `github`. Token kopieren (wird nur einmal angezeigt).

## 2. GitHub (Repository → Settings → Secrets and variables → Actions)
Am Handy: github.com im Browser, ggf. Desktop-Ansicht.

**Secret** (Reiter "Secrets"):
| Name | Wert |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Token aus 1.4 |

**Variable** (Reiter "Variables"):
| Name | Wert |
|---|---|
| `SUPABASE_PROJECT_REF` | Projekt-Referenz aus 1.3 |

Danach: **Actions** → **Server (Supabase)** → **Run workflow**. Der Lauf muss grün werden.

## 3. Netlify (Webapp)
1. Auf netlify.com mit **GitHub** anmelden.
2. **Add new project** → **Import an existing project** → **GitHub** → Repository `Kleiderschrank-` wählen (ggf. Netlify den Zugriff auf das Repository erlauben).
3. **Branch to deploy:** `main`. Build-Einstellungen nicht ändern (kommen aus `netlify.toml`).
4. **Environment variables** hinzufügen:
   | Name | Wert |
   |---|---|
   | `EXPO_PUBLIC_SUPABASE_URL` | Project URL aus 1.2 |
   | `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key aus 1.2 |
5. **Deploy** drücken.
6. Projekt → **Project configuration** → **Build & deploy** → **Branches and deploy contexts**: **Branch deploys: All** und **Deploy Previews: an**. Dann bekommt jeder Arbeitsstand eine eigene Vorschau-Adresse.
7. Optional: Projektname ändern (z. B. `mein-kleiderschrank`), dann lautet die Adresse `mein-kleiderschrank.netlify.app`.

## 4. Auf dem iPhone
1. Den Pull Request von Claude in der GitHub-App mergen (sonst ist `main` noch leer).
2. Die Netlify-Adresse in **Safari** öffnen.
3. Teilen-Symbol → **Zum Home-Bildschirm** → **Hinzufügen**.
4. App vom Home-Bildschirm starten, oben rechts auf **Mehr** (drei Punkte) tippen. Ganz unten sollte stehen: **Server: Server antwortet.**

Hinweis: Die App speichert Daten im Browser mit SQLite. Das braucht iOS 17 oder neuer. Zeigt die App "Deine Daten konnten nicht geöffnet werden", bitte iOS-Version mitteilen.

## Wenn etwas nicht klappt
- "Server noch nicht eingerichtet": Netlify-Variablen aus 3.4 fehlen oder wurden nach dem Build eingetragen. In Netlify **Deploys** → **Trigger deploy** → **Clear cache and deploy**.
- "Server gerade nicht erreichbar": Lauf "Server (Supabase)" prüfen; Supabase pausiert kostenlose Projekte nach 1 Woche ohne Nutzung (im Dashboard wieder starten).
- Netlify-Build rot: Fehlermeldung aus dem Deploy-Protokoll an Claude schicken.
