import {
  blockGroesse,
  freistellenPlausibel,
  kastenErweitern,
  kopfAusPose,
  verpixeln,
  vordergrundAnteil,
  zuMaske,
  zuNetzEingabe,
  type Kasten,
} from '../../core/vision/bildmathe';
import type { FreistellErgebnis, GesichtsErgebnis, Vision } from './vision';

export type { FreistellErgebnis, GesichtsErgebnis, Vision } from './vision';

/** Alles liegt unter /vision (scripts/bereite-vision-vor.mjs), gleiche Adresse wegen COEP. */
const PFAD = '/vision';
const KANTE = 320;
const MAX_SEITE = 1024;

// Laufzeit-Import an Metro vorbei: die Dateien liegen nicht im Bündel, sondern unter /vision.
const importiere = new Function('u', 'return import(u)') as (url: string) => Promise<unknown>;

type OrtTensor = { data: Float32Array };
type Ort = {
  env: { wasm: { wasmPaths: string; numThreads: number } };
  Tensor: new (typ: 'float32', daten: Float32Array, form: number[]) => OrtTensor;
  InferenceSession: {
    create(
      url: string,
      optionen: { executionProviders: string[] },
    ): Promise<{
      inputNames: string[];
      outputNames: string[];
      run(eingaben: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
    }>;
  };
};

type Erkennung = {
  boundingBox?: { originX: number; originY: number; width: number; height: number };
};
type MediaPipe = {
  FilesetResolver: { forVisionTasks(pfad: string): Promise<unknown> };
  FaceDetector: {
    createFromOptions(
      f: unknown,
      o: object,
    ): Promise<{ detect(b: HTMLCanvasElement): { detections: Erkennung[] } }>;
  };
  PoseLandmarker: {
    createFromOptions(
      f: unknown,
      o: object,
    ): Promise<{ detect(b: HTMLCanvasElement): { landmarks: { x: number; y: number }[][] } }>;
  };
};

let sitzung: ReturnType<Ort['InferenceSession']['create']> | null = null;
let ortModul: Promise<Ort> | null = null;
let mediapipe: Promise<{
  gesicht: Awaited<ReturnType<MediaPipe['FaceDetector']['createFromOptions']>>;
  pose: Awaited<ReturnType<MediaPipe['PoseLandmarker']['createFromOptions']>>;
}> | null = null;

function ladeOrt(): Promise<Ort> {
  ortModul ??= importiere(`${PFAD}/ort/ort.wasm.min.mjs`).then((m) => {
    const ort = m as Ort;
    ort.env.wasm.wasmPaths = `${PFAD}/ort/`;
    ort.env.wasm.numThreads = globalThis.crossOriginIsolated
      ? Math.min(4, navigator.hardwareConcurrency || 1)
      : 1;
    return ort;
  });
  return ortModul;
}

function ladeMediaPipe() {
  mediapipe ??= (async () => {
    const mp = (await importiere(`${PFAD}/mediapipe/vision_bundle.mjs`)) as MediaPipe;
    const dateien = await mp.FilesetResolver.forVisionTasks(`${PFAD}/mediapipe`);
    const [gesicht, pose] = await Promise.all([
      mp.FaceDetector.createFromOptions(dateien, {
        baseOptions: {
          modelAssetPath: `${PFAD}/modelle/blaze_face_short_range.tflite`,
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.4,
      }),
      mp.PoseLandmarker.createFromOptions(dateien, {
        baseOptions: {
          modelAssetPath: `${PFAD}/modelle/pose_landmarker_lite.task`,
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        numPoses: 3,
      }),
    ]);
    return { gesicht, pose };
  })();
  return mediapipe;
}

async function ladeBild(url: string): Promise<HTMLImageElement> {
  const bild = new Image();
  bild.src = url;
  await bild.decode();
  return bild;
}

/** Bild auf höchstens MAX_SEITE verkleinert in eine Leinwand; neu zeichnen entfernt auch Metadaten. */
function aufLeinwand(bild: HTMLImageElement): HTMLCanvasElement {
  const faktor = Math.min(1, MAX_SEITE / Math.max(bild.naturalWidth, bild.naturalHeight));
  const leinwand = document.createElement('canvas');
  leinwand.width = Math.round(bild.naturalWidth * faktor);
  leinwand.height = Math.round(bild.naturalHeight * faktor);
  leinwand.getContext('2d')!.drawImage(bild, 0, 0, leinwand.width, leinwand.height);
  return leinwand;
}

function zuUrl(leinwand: HTMLCanvasElement, typ: 'image/png' | 'image/jpeg'): Promise<string> {
  return new Promise((aufloesen, ablehnen) =>
    leinwand.toBlob(
      (blob) => (blob ? aufloesen(URL.createObjectURL(blob)) : ablehnen(new Error('Bild leer'))),
      typ,
      0.9,
    ),
  );
}

async function stelleFrei(bildUrl: string): Promise<FreistellErgebnis> {
  const start = performance.now();
  const ort = await ladeOrt();
  sitzung ??= ort.InferenceSession.create(`${PFAD}/modelle/u2netp.onnx`, {
    executionProviders: ['wasm'],
  });
  const netz = await sitzung;
  const original = aufLeinwand(await ladeBild(bildUrl));

  const klein = document.createElement('canvas');
  klein.width = KANTE;
  klein.height = KANTE;
  const kleinKontext = klein.getContext('2d', { willReadFrequently: true })!;
  kleinKontext.drawImage(original, 0, 0, KANTE, KANTE);
  const eingabe = zuNetzEingabe(kleinKontext.getImageData(0, 0, KANTE, KANTE).data, KANTE);
  const ergebnis = await netz.run({
    [netz.inputNames[0]]: new ort.Tensor('float32', eingabe, [1, 3, KANTE, KANTE]),
  });
  const maske = zuMaske(ergebnis[netz.outputNames[0]].data);

  // Maske als Durchsichtigkeit auf das Original legen.
  const maskenBild = kleinKontext.createImageData(KANTE, KANTE);
  for (let i = 0; i < maske.length; i++) maskenBild.data[i * 4 + 3] = maske[i];
  kleinKontext.putImageData(maskenBild, 0, 0);
  const aus = document.createElement('canvas');
  aus.width = original.width;
  aus.height = original.height;
  const ausKontext = aus.getContext('2d')!;
  ausKontext.drawImage(original, 0, 0);
  ausKontext.globalCompositeOperation = 'destination-in';
  ausKontext.drawImage(klein, 0, 0, aus.width, aus.height);

  const anteil = vordergrundAnteil(maske);
  return {
    ergebnisUrl: await zuUrl(aus, 'image/png'),
    anteil,
    plausibel: freistellenPlausibel(anteil),
    dauerMs: Math.round(performance.now() - start),
  };
}

async function verpixleGesichter(bildUrl: string): Promise<GesichtsErgebnis> {
  const start = performance.now();
  const { gesicht, pose } = await ladeMediaPipe();
  const leinwand = aufLeinwand(await ladeBild(bildUrl));
  const { width: breite, height: hoehe } = leinwand;

  let quelle: GesichtsErgebnis['quelle'] = 'gesicht';
  let kaesten: Kasten[] = gesicht
    .detect(leinwand)
    .detections.flatMap((d) => (d.boundingBox ? [d.boundingBox] : []))
    .map((b) =>
      kastenErweitern(
        { x: b.originX, y: b.originY, breite: b.width, hoehe: b.height },
        1.5,
        breite,
        hoehe,
      ),
    );

  if (kaesten.length === 0) {
    // Kleine Gesichter im Spiegel-Selfie findet die Gesichtserkennung oft nicht; dann über die Körperhaltung.
    quelle = 'koerper';
    kaesten = pose
      .detect(leinwand)
      .landmarks.map((punkte) => kopfAusPose(punkte, breite, hoehe))
      .filter((k): k is Kasten => k !== null);
  }
  if (kaesten.length === 0) quelle = 'keins';

  const kontext = leinwand.getContext('2d', { willReadFrequently: true })!;
  const pixel = kontext.getImageData(0, 0, breite, hoehe);
  for (const k of kaesten) verpixeln(pixel.data, breite, hoehe, k, blockGroesse(k));
  kontext.putImageData(pixel, 0, 0);

  return {
    kaesten,
    quelle,
    verpixeltUrl: await zuUrl(leinwand, 'image/jpeg'),
    dauerMs: Math.round(performance.now() - start),
  };
}

export const vision: Vision | null = { stelleFrei, verpixleGesichter };
