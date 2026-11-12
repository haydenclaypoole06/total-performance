import type { ServiceGraphic as G } from "@/config/site";

/** Round SVG coordinates so server and browser render identical markup. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Technical line illustrations for each service. Lines draw in when the parent has
 * data-active="true" (hover / keyboard focus / current selection).
 */
export function ServiceGraphic({ type, className }: { type: G; className?: string }) {
  const stroke = "var(--ice)";
  const dim = "var(--border-strong)";
  const common = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  const grid = (
    <g stroke={dim} strokeWidth="0.5" opacity="0.6">
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1="0" x2="400" y1={i * 50} y2={i * 50} />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} y1="0" y2="400" x1={i * 50} x2={i * 50} />
      ))}
    </g>
  );

  let art: React.ReactNode = null;
  switch (type) {
          case "wiring":
      art = (
        <g {...common}>
          {/* Main harness connector */}
          <rect
            x="42" y="154" width="76" height="92" rx="8"
            stroke={stroke} strokeWidth="3"
          />
          <rect
            x="52" y="166" width="26" height="68" rx="3"
            stroke="var(--steel)" strokeWidth="2"
          />
          <path
            d="M64 154 V144 H96 V154"
            stroke="var(--electric)" strokeWidth="3"
          />

          {/* Four individually routed wires */}
          {[
            "M118 176 H164 Q184 176 184 156 V100 Q184 80 204 80 H286",
            "M118 192 H212 Q232 192 232 172 V160 H286",
            "M118 208 H212 Q232 208 232 228 V240 H286",
            "M118 224 H164 Q184 224 184 244 V300 Q184 320 204 320 H286",
          ].map((d, i) => (
            <path
              key={d}
              d={d}
              className="draw-line"
              style={{
                ["--len" as string]: 320,
                transitionDelay: `${i * 90}ms`,
              }}
              stroke={i % 2 === 0 ? "var(--electric)" : stroke}
              strokeWidth="3"
            />
          ))}

          {/* Harness sleeve */}
          <path
            d="M128 164 H158 M128 236 H158"
            stroke="var(--steel)" strokeWidth="2"
          />
          {[132, 142, 152].map((x) => (
            <line
              key={x}
              x1={x} y1="166" x2={x} y2="234"
              stroke="var(--steel)"
              strokeWidth="2"
              opacity="0.65"
            />
          ))}

          {/* Branch connectors and terminal pins */}
          {[80, 160, 240, 320].map((y) => (
            <g key={y}>
              <rect
                x="286" y={y - 20}
                width="52" height="40" rx="5"
                stroke={stroke} strokeWidth="2.5"
              />
              <path
                d={`M298 ${y - 20} V${y - 27} H320 V${y - 20}`}
                stroke="var(--steel)" strokeWidth="2"
              />
              <line
                x1="338" y1={y - 8} x2="356" y2={y - 8}
                stroke="var(--white)" strokeWidth="3"
              />
              <line
                x1="338" y1={y + 8} x2="356" y2={y + 8}
                stroke="var(--white)" strokeWidth="3"
              />
              <circle
                cx="310" cy={y} r="4"
                fill="var(--electric)" stroke="none"
              />
            </g>
          ))}

          {/* Main connector terminals */}
          {[178, 194, 210, 226].map((y) => (
            <line
              key={y}
              x1="58" y1={y} x2="70" y2={y}
              stroke="var(--white)" strokeWidth="3"
            />
          ))}
        </g>
      );
      break;
    case "tach": {
      const ticks = 41;
      art = (
        <g {...common}>
          <path d="M70 280 A140 140 0 1 1 330 280" stroke={dim} strokeWidth="2" />
          <path className="draw-line" style={{ ["--len" as string]: 700 }} d="M70 280 A140 140 0 1 1 330 280" stroke={stroke} strokeWidth="3" />
          {Array.from({ length: ticks }).map((_, i) => {
            const a = (-215 + (i / (ticks - 1)) * 250) * (Math.PI / 180);
            const major = i % 5 === 0;
            const r1 = 128;
            const rIn = major ? 104 : 116;
            return (
              <line
                key={i}
                x1={r2(200 + Math.cos(a) * r1)}
                y1={r2(200 + Math.sin(a) * r1)}
                x2={r2(200 + Math.cos(a) * rIn)}
                y2={r2(200 + Math.sin(a) * rIn)}
                stroke={i > 32 ? "var(--electric)" : "var(--steel)"}
                strokeWidth={major ? 2.5 : 1}
              />
            );
          })}
          <line className="draw-line" style={{ ["--len" as string]: 130 }} x1="200" y1="200" x2="292" y2="128" stroke="var(--electric)" strokeWidth="4" />
          <circle cx="200" cy="200" r="10" fill="var(--white)" stroke="none" />
        </g>
      );
      break;
    }
    case "camshaft":
      art = (
        <g {...common}>
          <circle cx="140" cy="200" r="50" stroke={dim} strokeWidth="2" />
          <path className="draw-line" style={{ ["--len" as string]: 520 }} d="M140 150 C 200 150 250 175 262 200 C 250 225 200 250 140 250 A50 50 0 0 1 140 150 Z" stroke={stroke} strokeWidth="3" />
          <circle cx="140" cy="200" r="12" stroke="var(--steel)" strokeWidth="2" />
          <path d="M40 330 L360 330" stroke={dim} strokeWidth="1.5" />
          <path className="draw-line" style={{ ["--len" as string]: 520 }} d="M40 330 C 120 330 140 250 200 250 C 260 250 280 330 360 330" stroke="var(--electric)" strokeWidth="3" />
          <text x="40" y="358" fill="var(--steel)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2">LIFT / DURATION</text>
        </g>
      );
      break;
    case "compressor": {
      const blades = 12;
      art = (
        <g {...common}>
          <circle cx="200" cy="200" r="150" stroke={dim} strokeWidth="2" />
          <circle className="draw-line" style={{ ["--len" as string]: 960 }} cx="200" cy="200" r="150" stroke={stroke} strokeWidth="3" />
          <circle cx="200" cy="200" r="118" stroke={dim} strokeWidth="1" />
          {Array.from({ length: blades }).map((_, i) => (
            <path
              key={i}
              transform={`rotate(${(i / blades) * 360} 200 200)`}
              className="draw-line"
              style={{ ["--len" as string]: 200, transitionDelay: `${i * 40}ms` }}
              d="M200 200 Q 250 150 235 85"
              stroke={i % 2 ? "var(--steel)" : "var(--white)"}
              strokeWidth="2"
            />
          ))}
          <circle cx="200" cy="200" r="20" stroke="var(--electric)" strokeWidth="3" />
        </g>
      );
      break;
    }
    case "waveform":
      art = (
        <g {...common}>
          <rect x="30" y="80" width="340" height="240" stroke={dim} strokeWidth="1.5" rx="4" />
          <line x1="30" y1="200" x2="370" y2="200" stroke={dim} strokeWidth="1" strokeDasharray="4 6" />
          <path
            className="draw-line"
            style={{ ["--len" as string]: 900 }}
            d="M30 200 L70 200 L80 130 L95 270 L110 200 L150 200 L160 130 L175 270 L190 200 L230 200 L240 150 L255 250 L270 200 L310 200 L320 130 L335 270 L350 200 L370 200"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <circle cx="240" cy="150" r="8" stroke="var(--electric)" strokeWidth="2" />
          <text x="30" y="350" fill="var(--steel)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2">SIGNAL / TRACE</text>
        </g>
      );
      break;
    case "suspension":
      art = (
        <g {...common}>
          <circle cx="250" cy="210" r="110" stroke={dim} strokeWidth="2" />
          <circle className="draw-line" style={{ ["--len" as string]: 700 }} cx="250" cy="210" r="110" stroke={stroke} strokeWidth="3" />
          <circle cx="250" cy="210" r="40" stroke="var(--steel)" strokeWidth="2" />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={r2(250 + Math.cos(a) * 78)} cy={r2(210 + Math.sin(a) * 78)} r="4" stroke="var(--steel)" strokeWidth="1.5" />;
          })}
          <path d="M80 60 L80 100" stroke="var(--steel)" strokeWidth="3" />
          <path
            className="draw-line"
            style={{ ["--len" as string]: 600 }}
            d="M80 100 L110 115 L50 130 L110 145 L50 160 L110 175 L50 190 L110 205 L50 220 L110 235 L80 250"
            stroke="var(--electric)"
            strokeWidth="3"
          />
          <path d="M80 250 L80 340" stroke="var(--steel)" strokeWidth="6" />
        </g>
      );
      break;
    case "torque": {
      const lugs = 5;
      const order = [0, 2, 4, 1, 3];
      const pts: [number, number][] = Array.from({ length: lugs }).map((_, i) => {
        const a = -Math.PI / 2 + (i / lugs) * Math.PI * 2;
        return [r2(200 + Math.cos(a) * 110), r2(200 + Math.sin(a) * 110)] as [number, number];
      });
      const d = order.map((o, i) => { const p = pts[o]!; return `${i ? "L" : "M"}${p[0]} ${p[1]}`; }).join(" ") + " Z";
      art = (
        <g {...common}>
          <circle cx="200" cy="200" r="150" stroke={dim} strokeWidth="2" />
          <path className="draw-line" style={{ ["--len" as string]: 1100 }} d={d} stroke="var(--electric)" strokeWidth="2" strokeDasharray="0" />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="18" stroke={stroke} strokeWidth="2.5" />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="var(--white)"
                stroke="none"
                fontFamily="var(--font-mono)"
                fontSize="12"
              >
                {order.indexOf(i) + 1}
              </text>
            </g>
          ))}
          <circle cx="200" cy="200" r="34" stroke="var(--steel)" strokeWidth="2" />
          <text x="20" y="390" fill="var(--steel)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2">SEQUENCE / SPEC</text>
        </g>
      );
      break;
    }
  }

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      {grid}
      {art}
    </svg>
  );
}
