// Service Worker: App startet auch ohne Netz (Plan 7.1 "Offline zuerst").
// Seiten: zuerst Netz, sonst Ablage. Dateien mit Hash im Namen: zuerst Ablage.
// Alles andere: aus der Ablage zeigen und im Hintergrund erneuern.
const ABLAGE = 'schrank-v1';
const START = '/';

self.addEventListener('install', (ereignis) => {
  ereignis.waitUntil(caches.open(ABLAGE).then((a) => a.add(START)));
  self.skipWaiting();
});

self.addEventListener('activate', (ereignis) => {
  ereignis.waitUntil(
    caches
      .keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== ABLAGE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

function unveraenderlich(url) {
  return url.pathname.startsWith('/_expo/static/') || url.pathname.startsWith('/modelle/');
}

self.addEventListener('fetch', (ereignis) => {
  const anfrage = ereignis.request;
  const url = new URL(anfrage.url);
  if (anfrage.method !== 'GET' || url.origin !== self.location.origin) return;

  if (anfrage.mode === 'navigate') {
    ereignis.respondWith(
      fetch(anfrage)
        .then((antwort) => {
          const kopie = antwort.clone();
          caches.open(ABLAGE).then((a) => a.put(START, kopie));
          return antwort;
        })
        .catch(() => caches.match(START)),
    );
    return;
  }

  ereignis.respondWith(
    caches.open(ABLAGE).then(async (a) => {
      const vorhanden = await a.match(anfrage);
      if (vorhanden && unveraenderlich(url)) return vorhanden;
      const neu = fetch(anfrage)
        .then((antwort) => {
          if (antwort.ok) a.put(anfrage, antwort.clone());
          return antwort;
        })
        .catch(() => vorhanden);
      return vorhanden ?? neu;
    }),
  );
});
