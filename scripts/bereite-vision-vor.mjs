// Legt alles für die Bildverarbeitung im Browser unter public/vision ab (Plan 7.10):
// Laufzeiten aus node_modules und Modelle aus dem Netz (geprüft per SHA-256).
// Alles kommt danach von der eigenen Adresse (nötig wegen Cross-Origin-Embedder-Policy).
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const ziel = join(wurzel, 'public', 'vision');

const MODELLE = [
  {
    // U²-Net klein, Apache-2.0 (github.com/xuebinqin/U-2-Net), ONNX-Fassung aus rembg (MIT)
    datei: 'u2netp.onnx',
    url: 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx',
    sha256: '309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8',
  },
  {
    // MediaPipe Gesichtserkennung, Apache-2.0
    datei: 'blaze_face_short_range.tflite',
    url: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
    sha256: 'b4578f35940bf5a1a655214a1cce5cab13eba73c1297cd78e1a04c2380b0152f',
  },
  {
    // MediaPipe Körperhaltung (findet den Kopf auch bei kleinen Gesichtern), Apache-2.0
    datei: 'pose_landmarker_lite.task',
    url: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
    sha256: '59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a',
  },
];

const KOPIEN = [
  ['node_modules/onnxruntime-web/dist/ort.wasm.min.mjs', 'ort/ort.wasm.min.mjs'],
  [
    'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs',
    'ort/ort-wasm-simd-threaded.mjs',
  ],
  [
    'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
    'ort/ort-wasm-simd-threaded.wasm',
  ],
  ['node_modules/@mediapipe/tasks-vision/vision_bundle.mjs', 'mediapipe/vision_bundle.mjs'],
  [
    'node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js',
    'mediapipe/vision_wasm_internal.js',
  ],
  [
    'node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.wasm',
    'mediapipe/vision_wasm_internal.wasm',
  ],
  [
    'node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_nosimd_internal.js',
    'mediapipe/vision_wasm_nosimd_internal.js',
  ],
  [
    'node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_nosimd_internal.wasm',
    'mediapipe/vision_wasm_nosimd_internal.wasm',
  ],
];

const pruefsumme = (puffer) => createHash('sha256').update(puffer).digest('hex');

for (const [von, nach] of KOPIEN) {
  const zielDatei = join(ziel, nach);
  mkdirSync(dirname(zielDatei), { recursive: true });
  copyFileSync(join(wurzel, von), zielDatei);
}

for (const modell of MODELLE) {
  const zielDatei = join(ziel, 'modelle', modell.datei);
  mkdirSync(dirname(zielDatei), { recursive: true });
  if (existsSync(zielDatei) && pruefsumme(readFileSync(zielDatei)) === modell.sha256) continue;
  const antwort = await fetch(modell.url);
  if (!antwort.ok) throw new Error(`${modell.datei}: HTTP ${antwort.status}`);
  const puffer = Buffer.from(await antwort.arrayBuffer());
  const summe = pruefsumme(puffer);
  if (summe !== modell.sha256) throw new Error(`${modell.datei}: Prüfsumme falsch (${summe})`);
  writeFileSync(zielDatei, puffer);
  console.log(`geladen: ${modell.datei} (${(puffer.length / 1e6).toFixed(1)} MB)`);
}
console.log('Bildverarbeitung vorbereitet in public/vision');
