/**
 * Spielt alle Abläufe des Klick-Prototyps im Browser durch und zählt die Tipps (Plan 3.2).
 * Aufruf: npm run build:web && npm run test:browser [bildordner]
 * Braucht Playwright mit Chromium (in der Claude-Code-Cloud vorinstalliert).
 */
const path = require('path');
const { spawn } = require('child_process');

function ladePlaywright() {
  try {
    return require('playwright');
  } catch {
    return require('/opt/node22/lib/node_modules/playwright');
  }
}
const { chromium, devices } = ladePlaywright();
const ordner = process.argv[2] || path.join(__dirname, 'bilder');
require('fs').mkdirSync(ordner, { recursive: true });
const URL = 'http://localhost:4174';
const server = spawn(
  process.execPath,
  [path.join(__dirname, 'server.cjs'), path.join(__dirname, '../../dist'), '4174'],
  { stdio: 'ignore' },
);
let fehlgeschlagen = 0;
(async () => {
  await new Promise((r) => setTimeout(r, 500));
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'] });
  await c.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: URL });
  const p = await c.newPage();
  const fehler = [];
  p.on('pageerror', (e) => fehler.push('pageerror: ' + e.message));
  // MediaPipe meldet harmlose Infos über console.error ("INFO: Created TensorFlow Lite ...").
  p.on(
    'console',
    (m) =>
      m.type() === 'error' &&
      !m.text().startsWith('INFO:') &&
      fehler.push('console: ' + m.text().slice(0, 200)),
  );
  let tipps = 0;
  const tippe = async (name, opts = {}) => {
    const el = p.getByRole(opts.rolle || 'button', { name, exact: opts.exact ?? false }).first();
    await el.click({ timeout: 5000 });
    tipps++;
    await p.waitForTimeout(350);
  };
  const sieht = async (text) => {
    await p
      .getByText(text, { exact: false })
      .filter({ visible: true })
      .first()
      .waitFor({ timeout: 5000 });
  };
  const bild = (n) => p.screenshot({ path: `${ordner}/${n}.png` });
  const ablauf = async (name, fn) => {
    tipps = 0;
    try {
      await fn();
      console.log(`OK   ${name} (${tipps} Tipps)`);
    } catch (e) {
      fehlgeschlagen++;
      console.log(`FEHL ${name}: ${e.message.split('\n')[0]}`);
      await bild('fehler-' + name.replace(/\W+/g, '-'));
    }
  };
  const aufgabe = async (text) => {
    await p.goto(URL + '/mehr/testleitung', { waitUntil: 'networkidle' });
    await p.getByRole('button', { name: text }).first().click();
    await p.waitForTimeout(1200);
    tipps = 0;
  };

  await p.goto(URL + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await bild('01-heute');

  await ablauf('Morgens: Anziehen', async () => {
    await tippe('Anziehen');
    await sieht('Heute angezogen.');
    await bild('02-angezogen');
    await p.getByRole('button', { name: 'Rückgängig' }).click();
    await sieht('Anziehen');
  });
  await ablauf('Teil tauschen: Schuhe', async () => {
    await aufgabe('andere Schuhe');
    await tippe('Weiße Sneaker. Tippen');
    await p.getByRole('button', { name: 'Braune Lederschuhe. Tippen' }).waitFor({ timeout: 3000 });
  });
  await ablauf('Anderes Outfit', async () => {
    await tippe('Anderes Outfit zeigen');
    await p
      .getByRole('button', { name: 'Dunkelblauer Pullover. Tippen' })
      .waitFor({ timeout: 3000 });
  });
  await ablauf('Abends: Outfit für morgen', async () => {
    await aufgabe('Es ist Abend');
    await bild('03-abend-benachrichtigung');
    await tippe('Dein Outfit für morgen');
    await bild('04-abend');
    await tippe('Passt', { exact: true });
    await sieht('Für morgen festgelegt.');
  });
  await ablauf('Neues Teil', async () => {
    await aufgabe('neue Jeans');
    await tippe('Fotografieren');
    await bild('05-kamera');
    await tippe('Foto machen');
    await bild('06-bestaetigung');
    await tippe('Ja, in den Schrank');
    await sieht('Im Schrank: Blaue Jeans.');
    await bild('07-schrank-neu');
  });
  await ablauf('Neues Teil mit Etiketten und Größe ändern', async () => {
    await aufgabe('neue Jeans');
    await tippe('Fotografieren');
    await tippe('Foto machen');
    await tippe('Foto machen');
    await tippe('Foto machen');
    await bild('08-bestaetigung-etiketten');
    await tippe('W32/L34, unsicher');
    await bild('09-groesse-auswahl');
    await tippe('W33/L34', { exact: true });
    await sieht('W33/L34');
    await tippe('Ja, in den Schrank');
    await sieht('Im Schrank:');
  });
  await ablauf('Galerie-Stapel', async () => {
    await aufgabe('mehrere Teile');
    await tippe('Fotografieren');
    await tippe('Aus deinen Fotos wählen');
    await tippe('Foto 1', { exact: true });
    await tippe('Foto 4', { exact: true });
    await bild('10-galerie');
    await tippe('2 hinzufügen');
    await bild('11-stapel');
    await tippe('Ja, in den Schrank');
    await tippe('Ja, in den Schrank');
    await sieht('2 Teile im Schrank.');
  });
  await ablauf('Kaufcheck', async () => {
    await aufgabe('im Laden');
    await tippe('Fotografieren');
    await tippe('Foto machen');
    await tippe('Nur prüfen');
    await sieht('Passt zu 9 Outfits');
    await bild('12-kaufcheck');
    await tippe('Fertig');
  });
  await ablauf('Spiegel-Selfie', async () => {
    await aufgabe('Spiegel-Selfie');
    await tippe('Fotografieren');
    await tippe('Foto machen');
    await sieht('verpixelt');
    await bild('13-selfie');
    await tippe('Ja, eintragen');
    await sieht('Eingetragen: heute getragen.');
  });
  await ablauf('Wäsche', async () => {
    await aufgabe('Wäsche ist voll');
    await bild('14-hinweis-waesche');
    await tippe('Waschgänge ansehen');
    await bild('15-waesche');
    await tippe('Fertig gewaschen');
    await sieht('Gewaschen.');
  });
  await ablauf('Verkaufen', async () => {
    await aufgabe('Verkauf den Mantel');
    await bild('16-hinweis-verkaufen');
    await tippe('Verkaufen', { exact: true });
    await sieht('Anzeigentext ist kopiert');
    console.log(
      '     Zwischenablage:',
      (await p.evaluate(() => navigator.clipboard.readText())).slice(0, 40),
    );
    await bild('17-verkaufen');
  });
  await ablauf('Farbtyp', async () => {
    await aufgabe('welche Farben');
    await tippe('Ja, zeig mir');
    await tippe('Selfie machen');
    await tippe('Tippe auf deine Haare.');
    await tippe('Tippe auf ein Auge.');
    await bild('18-regler');
    await tippe('Weiter');
    await sieht('Diese Farben stehen dir');
    await bild('19-palette');
    await tippe('Fertig');
  });
  await ablauf('Erweiterung ein und aus', async () => {
    await aufgabe('Test-Erweiterung');
    await p.goto(URL + '/mehr/erweiterungen', { waitUntil: 'networkidle' });
    await p.getByRole('switch', { name: 'Test-Erweiterung' }).click();
    await p.waitForTimeout(500);
    await p.goto(URL + '/', { waitUntil: 'networkidle' });
    await sieht('12 Teile in der Wäsche');
    console.log('     Heute bleibt die schon gezeigte Wäsche-Karte (1 pro Tag).');
    await p.goto(URL + '/mehr', { waitUntil: 'networkidle' });
    await sieht('Test-Bildschirm');
    await p.goto(URL + '/mehr/testleitung', { waitUntil: 'networkidle' });
    await p.getByRole('button', { name: 'Alles zurücksetzen' }).click();
    await p.waitForTimeout(500);
    await p.goto(URL + '/', { waitUntil: 'networkidle' });
    await sieht('Die Test-Erweiterung ist eingeschaltet.');
    await bild('20-erweiterung-hinweis');
    await p.goto(URL + '/mehr/erweiterungen', { waitUntil: 'networkidle' });
    await p.getByRole('switch', { name: 'Test-Erweiterung' }).click();
    await p.waitForTimeout(500);
    await p.goto(URL + '/mehr', { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    if (await p.getByText('Test-Bildschirm').count())
      throw new Error('Bildschirm nach Ausschalten noch da');
  });
  await ablauf('Schrank-Suche', async () => {
    await aufgabe('vorgeschlagene Outfit');
    await p.goto(URL + '/schrank', { waitUntil: 'networkidle' });
    await p.getByRole('textbox').fill('blaue Jeans');
    await p.waitForTimeout(300);
    await sieht('1 Teil');
    await bild('21-suche');
  });
  await ablauf('Dunkelmodus bleibt nach Neuladen', async () => {
    await p.goto(URL + '/mehr/einstellungen', { waitUntil: 'networkidle' });
    await p.getByRole('radio', { name: 'Dunkel' }).click();
    await p.waitForTimeout(500);
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const farbe = await p
      .getByRole('heading', { name: 'Einstellungen' })
      .evaluate((e) => getComputedStyle(e).color);
    if (farbe !== 'rgb(236, 237, 235)') throw new Error('Nach Neuladen nicht dunkel: ' + farbe);
    await p.goto(URL + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    await bild('22-dunkel');
  });
  await ablauf('Neues Teil bleibt nach Neuladen', async () => {
    await aufgabe('neue Jeans');
    await tippe('Fotografieren');
    await tippe('Foto machen');
    await tippe('Ja, in den Schrank');
    await sieht('17 Teile');
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    await sieht('17 Teile');
  });
  await ablauf('Anziehen bleibt nach Neuladen', async () => {
    await aufgabe('vorgeschlagene Outfit');
    await tippe('Anziehen');
    await p.waitForTimeout(500);
    await p.goto(URL + '/teil/t1', { waitUntil: 'networkidle' });
    await sieht('23-mal getragen');
  });
  await ablauf('Start ohne Netz', async () => {
    await p.goto(URL + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    await c.setOffline(true);
    await p.reload({ waitUntil: 'load' });
    await p.waitForTimeout(1500);
    await sieht('Anziehen');
    await c.setOffline(false);
  });
  await ablauf('Machbarkeitstest Freistellen und Gesichter', async () => {
    await p.goto(URL + '/mehr/machbarkeit', { waitUntil: 'networkidle' });
    const [auswahl] = await Promise.all([
      p.waitForEvent('filechooser'),
      p.getByRole('button', { name: 'Testfotos wählen' }).click(),
    ]);
    await auswahl.setFiles([
      path.join(__dirname, 'fotos', 'tshirt.jpg'),
      path.join(__dirname, 'fotos', 'leer.jpg'),
    ]);
    await p.getByText('Freigestellt in').nth(1).waitFor({ timeout: 120000 });
    const zeilen = await p.getByText(/Freigestellt in|Gesichter:/).allInnerTexts();
    zeilen.forEach((z) => console.log('     ' + z));
    // Freigestelltes T-Shirt prüfen: Mitte undurchsichtig, Ecke durchsichtig
    const pruefung = await p.evaluate(async () => {
      const bilder = [...document.querySelectorAll('img')].filter((b) => b.src.startsWith('blob:'));
      const quelle = bilder[1];
      const leinwand = document.createElement('canvas');
      leinwand.width = quelle.naturalWidth;
      leinwand.height = quelle.naturalHeight;
      const k = leinwand.getContext('2d');
      k.drawImage(quelle, 0, 0);
      const alpha = (x, y) =>
        k.getImageData(Math.round(x * leinwand.width), Math.round(y * leinwand.height), 1, 1)
          .data[3];
      return { mitte: alpha(0.5, 0.55), ecke: alpha(0.03, 0.03) };
    });
    console.log('     Durchsichtigkeit Mitte/Ecke:', pruefung.mitte, pruefung.ecke);
    if (pruefung.mitte < 200 || pruefung.ecke > 50) throw new Error('Freistellen falsch');
    await p.getByRole('button', { name: 'Ja' }).first().click();
    await sieht('Freistellen brauchbar: 100 %');
    await bild('23-machbarkeit');
  });
  console.log('Fehler im Browser:', fehler);
  await b.close();
  server.kill();
  process.exit(fehlgeschlagen > 0 || fehler.length > 0 ? 1 : 0);
})();
