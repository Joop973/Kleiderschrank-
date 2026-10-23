# Einrichtung (vom Handy aus)

Einmalig nötig, damit die App auf dem iPhone läuft und der Server antwortet. Reihenfolge einhalten.

## 1. Expo
1. Auf expo.dev ein Konto anlegen.
2. Auf expo.dev → **Projects** → **Create a project**, Name `kleiderschrank` (Slug muss genau so heißen).
3. Die **Project ID** kopieren (steht auf der Projektseite).
4. expo.dev → Kontoeinstellungen → **Access tokens** → **Create token**, Name `github`. Token kopieren (wird nur einmal angezeigt).
5. **Expo Go** aus dem App Store installieren und mit demselben Expo-Konto anmelden (ab SDK 57 Pflicht).

## 2. Supabase
1. Auf supabase.com ein Konto anlegen, **New project**, Region **Frankfurt (eu-central-1)**. Datenbank-Passwort sicher aufbewahren.
2. Projekteinstellungen → **API**: **Project URL** und **Publishable key** (beginnt mit `sb_publishable_`) kopieren.
3. Projekt-Referenz = der Teil der URL vor `.supabase.co`.
4. Kontoeinstellungen → **Access Tokens** → **Generate new token**, Name `github`. Token kopieren.

## 3. GitHub (Repository → Settings → Secrets and variables → Actions)
Am Handy: github.com im Browser, Desktop-Ansicht falls nötig.

**Secrets** (Reiter "Secrets"):
| Name | Wert |
|---|---|
| `EXPO_TOKEN` | Expo-Token aus 1.4 |
| `SUPABASE_ACCESS_TOKEN` | Supabase-Token aus 2.4 |

**Variablen** (Reiter "Variables"):
| Name | Wert |
|---|---|
| `EAS_PROJECT_ID` | Project ID aus 1.3 |
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL aus 2.2 |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key aus 2.2 |
| `SUPABASE_PROJECT_REF` | Projekt-Referenz aus 2.3 |

## 4. Erster Lauf
1. GitHub → **Actions** → **Server (Supabase)** → **Run workflow** (Branch wählen).
2. GitHub → **Actions** → **Vorschau in Expo Go** → **Run workflow**.
3. Im fertigen Lauf der Vorschau steht in der Zusammenfassung ein Link zu expo.dev. Auf dem iPhone öffnen → **In Expo Go öffnen** (oder QR-Code mit der Kamera scannen).
4. In der App auf "Heute" sollte stehen: **Server antwortet.**

Ab dann läuft beides bei jedem Push automatisch.

## Wenn etwas nicht klappt
- "Project is incompatible with this version of Expo Go": Expo Go unterstützt eine andere SDK-Version. Version in Expo Go nachsehen und mitteilen.
- "Server noch nicht eingerichtet": Variablen aus 3 fehlen oder die Vorschau wurde vor dem Eintragen gebaut. Vorschau neu starten.
- "Server gerade nicht erreichbar": Lauf "Server (Supabase)" prüfen; Supabase pausiert kostenlose Projekte nach 1 Woche ohne Nutzung (im Dashboard wieder starten).
