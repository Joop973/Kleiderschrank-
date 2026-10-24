import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

export type KleidungsArt =
  | 'tshirt'
  | 'hemd'
  | 'pullover'
  | 'jacke'
  | 'jeans'
  | 'hose'
  | 'rock'
  | 'kleid'
  | 'sneaker'
  | 'stiefel'
  | 'halbschuh'
  | 'schal'
  | 'muetze'
  | 'tasche'
  | 'groessenschild'
  | 'pflegeetikett'
  | 'person';

/** Dunklere Variante einer Farbe für Umrisse, damit auch weiße Teile sichtbar bleiben. */
export function abgedunkelt(hex: string, anteil = 0.4): string {
  const n = parseInt(hex.slice(1), 16);
  const kanal = (v: number) => Math.round(v * (1 - anteil));
  const r = kanal((n >> 16) & 255);
  const g = kanal((n >> 8) & 255);
  const b = kanal(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const formen: Record<Exclude<KleidungsArt, 'person'>, string> = {
  tshirt:
    'M30 15 L42 10 Q50 18 58 10 L70 15 L88 32 L76 42 L70 37 L70 90 L30 90 L30 37 L24 42 L12 32 Z',
  hemd: 'M32 14 L44 9 L50 20 L56 9 L68 14 L84 30 L90 76 L80 78 L72 42 L72 92 L28 92 L28 42 L20 78 L10 76 L16 30 Z',
  pullover:
    'M30 14 Q50 26 70 14 L84 26 L92 78 L80 80 L72 42 L72 90 L28 90 L28 42 L20 80 L8 78 L16 26 Z',
  jacke:
    'M30 12 L44 8 L50 18 L56 8 L70 12 L86 26 L94 80 L82 82 L74 44 L74 94 L26 94 L26 44 L18 82 L6 80 L14 26 Z',
  jeans: 'M28 8 L72 8 L77 92 L56 92 L50 36 L44 92 L23 92 Z',
  hose: 'M30 8 L70 8 L74 92 L56 92 L50 38 L44 92 L26 92 Z',
  rock: 'M32 12 L68 12 L84 88 L16 88 Z',
  kleid: 'M38 6 L45 6 Q50 13 55 6 L62 6 L64 30 L58 40 L82 92 L18 92 L42 40 L36 30 Z',
  sneaker: 'M8 62 L13 42 Q30 45 40 34 L52 38 Q64 53 88 57 Q94 64 90 72 L10 72 Z',
  stiefel: 'M30 6 L54 6 L56 56 Q80 58 88 70 L88 82 L28 82 Z',
  halbschuh: 'M6 64 Q10 50 30 50 L46 45 Q70 51 92 60 L92 72 L6 72 Z',
  schal: 'M28 10 L72 10 L72 26 L42 26 L48 86 L32 86 L24 22 Z',
  muetze: 'M20 68 Q20 22 50 20 Q80 22 80 68 Z',
  tasche: 'M20 40 L80 40 L84 88 L16 88 Z',
  groessenschild: 'M22 22 L78 22 L78 78 L22 78 Z',
  pflegeetikett: 'M30 8 L70 8 L70 92 L30 92 Z',
};

/** Schematische Kleidungs-Illustration für Beispieldaten im Klick-Prototyp. */
export function KleidungsBild({
  art,
  farbe,
  groesse = 64,
}: {
  art: KleidungsArt;
  farbe: string;
  groesse?: number;
}) {
  const umriss = abgedunkelt(farbe);
  return (
    <Svg width={groesse} height={groesse} viewBox="0 0 100 100" accessible={false}>
      {art === 'person' ? (
        <Person farbe={farbe} />
      ) : (
        <G>
          {art === 'tasche' ? (
            <Path
              d="M34 40 Q34 18 50 18 Q66 18 66 40"
              stroke={umriss}
              strokeWidth={5}
              fill="none"
            />
          ) : null}
          <Path
            d={formen[art]}
            fill={farbe}
            stroke={umriss}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <Details art={art} umriss={umriss} />
        </G>
      )}
    </Svg>
  );
}

function Details({ art, umriss }: { art: KleidungsArt; umriss: string }) {
  switch (art) {
    case 'hemd':
      return (
        <G fill={umriss}>
          {[32, 46, 60, 74].map((y) => (
            <Circle key={y} cx={50} cy={y} r={2} />
          ))}
        </G>
      );
    case 'jacke':
      return <Line x1={50} y1={18} x2={50} y2={94} stroke={umriss} strokeWidth={2.5} />;
    case 'pullover':
      return <Line x1={28} y1={84} x2={72} y2={84} stroke={umriss} strokeWidth={2} />;
    case 'jeans':
      return (
        <G stroke={umriss} strokeWidth={1.8} fill="none">
          <Line x1={28} y1={16} x2={72} y2={16} />
          <Path d="M34 16 Q36 26 44 26" />
          <Path d="M66 16 Q64 26 56 26" />
        </G>
      );
    case 'sneaker':
      return (
        <Rect x={9} y={66} width={82} height={6} fill="#FFFFFF" stroke={umriss} strokeWidth={1.5} />
      );
    case 'muetze':
      return (
        <G>
          <Rect x={16} y={62} width={68} height={14} rx={4} fill={umriss} />
          <Circle cx={50} cy={16} r={7} fill={umriss} />
        </G>
      );
    case 'schal':
      return (
        <G stroke={umriss} strokeWidth={2}>
          {[34, 38, 42, 46].map((x) => (
            <Line key={x} x1={x} y1={86} x2={x} y2={94} />
          ))}
        </G>
      );
    case 'groessenschild':
      return (
        <G fill={umriss}>
          <Rect x={32} y={32} width={36} height={8} />
          <Rect x={38} y={46} width={24} height={14} />
          <Rect x={30} y={66} width={40} height={4} />
        </G>
      );
    case 'pflegeetikett':
      return (
        <G stroke={umriss} strokeWidth={2.5} fill="none">
          <Path d="M38 20 L62 20 L58 34 L42 34 Z" />
          <Path d="M40 46 L60 46 L50 60 Z" />
          <Rect x={40} y={68} width={20} height={14} />
          <Circle cx={50} cy={75} r={4} />
        </G>
      );
    default:
      return null;
  }
}

/** Figur für das Spiegel-Selfie; der Kopf ist immer verpixelt (Plan K26). */
function Person({ farbe }: { farbe: string }) {
  const pixel = ['#C9A27E', '#B88E6B', '#D8B593', '#A97F5D'];
  return (
    <G>
      {[0, 1, 2, 3].flatMap((zeile) =>
        [0, 1, 2, 3].map((spalte) => (
          <Rect
            key={`${zeile}-${spalte}`}
            x={40 + spalte * 5}
            y={4 + zeile * 5}
            width={5}
            height={5}
            fill={pixel[(zeile + spalte) % 4]}
          />
        )),
      )}
      <Path
        d="M36 28 L64 28 L70 56 L30 56 Z"
        fill={farbe}
        stroke={abgedunkelt(farbe)}
        strokeWidth={2}
      />
      <Path
        d="M34 56 L66 56 L64 88 L54 88 L50 64 L46 88 L36 88 Z"
        fill="#3A5A8C"
        stroke="#22375A"
        strokeWidth={2}
      />
      <Rect x={33} y={88} width={14} height={6} rx={2} fill="#6B4A2E" />
      <Rect x={53} y={88} width={14} height={6} rx={2} fill="#6B4A2E" />
    </G>
  );
}
