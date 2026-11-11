/**
 * Stylized turbocharger built from procedural geometry. A design sculpture, not an
 * engineering model. Loaded lazily on the client only (see HeroVisual).
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export interface TurboSceneProps {
  active: boolean; // animate (in view, tab visible)
  reducedMotion: boolean;
  compact: boolean; // small screens: lighter geometry, no pointer
  onReady: () => void;
}

/* ---------- Feel constants ---------- */
const WHEEL_SPIN = 1.4; // rad/s, compressor wheel
const RING_SPIN = 0.04; // rad/s, background tach ring
const DRIFT_AMPLITUDE = 0.22; // rad, slow body sway
const DRIFT_SPEED = 0.18;
const POINTER_TILT = 0.28; // rad at screen edge
const POINTER_DAMP = 3; // higher = snappier follow
const BASE_YAW = -0.5; // rad, 3/4 profile so housing, bearing and turbine all read
const BASE_PITCH = 0.2;

/* ---------- Geometry builders ---------- */
const SPLIT = 0.8;
class VoluteCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private r0: number,
    private r1: number,
    private outlet: number,
  ) {
    super();
  }
  override getPoint(t: number, target = new THREE.Vector3()) {
    const sweep = Math.PI * 1.88;
    if (t <= SPLIT) {
      const u = t / SPLIT;
      const a = u * sweep;
      const r = this.r0 + (this.r1 - this.r0) * u;
      return target.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    }
    const u = (t - SPLIT) / (1 - SPLIT);
    const a = sweep;
    const r = this.r1;
    const end = new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
    const tangent = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0).normalize();
    return target.copy(end).addScaledVector(tangent, u * this.outlet);
  }
}

function buildVolute(r0: number, r1: number, t0: number, t1: number, outlet: number, seg: number) {
  const curve = new VoluteCurve(r0, r1, outlet);
  const tubular = seg * 4;
  const radial = seg;
  const geo = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = geo.attributes["position"] as THREE.BufferAttribute;
  const p = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, p);
    const s = t0 + (t1 - t0) * Math.min(t / SPLIT, 1);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(p).multiplyScalar(s).add(p);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function quad(a: THREE.Vector2, c: THREE.Vector2, b: THREE.Vector2, t: number) {
  const it = 1 - t;
  return new THREE.Vector2(
    it * it * a.x + 2 * it * t * c.x + t * t * b.x,
    it * it * a.y + 2 * it * t * c.y + t * t * b.y,
  );
}

/** Smooth twisted blade surface between hub and shroud curves (meridional r/z plane). */
function buildBlade(splitter: boolean) {
  const top = splitter ? 0.55 : 1.0;
  const hubA = new THREE.Vector2(splitter ? 0.3 : 0.14, top);
  const hubC = new THREE.Vector2(0.32, 0.12);
  const hubB = new THREE.Vector2(0.95, 0.04);
  const tipA = new THREE.Vector2(splitter ? 0.62 : 0.7, top);
  const tipC = new THREE.Vector2(0.74, 0.4);
  const tipB = new THREE.Vector2(0.95, 0.2);
  const U = 20;
  const V = 6;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= U; i++) {
    const u = i / U;
    const h = quad(hubA, hubC, hubB, u);
    const t = quad(tipA, tipC, tipB, u);
    for (let j = 0; j <= V; j++) {
      const v = j / V;
      const r = h.x + (t.x - h.x) * v;
      const z = h.y + (t.y - h.y) * v;
      const phi = 0.95 * z - 0.4 * Math.max(0, r - 0.55);
      positions.push(r * Math.cos(phi), r * Math.sin(phi), z);
      uvs.push(u, v);
    }
  }
  for (let i = 0; i < U; i++) {
    for (let j = 0; j < V; j++) {
      const a = i * (V + 1) + j;
      const b = a + V + 1;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

function buildHub(seg: number) {
  const pts = [
    [0.0, 1.12],
    [0.07, 1.12],
    [0.1, 1.04],
    [0.14, 0.95],
    [0.22, 0.62],
    [0.4, 0.3],
    [0.7, 0.1],
    [0.97, 0.02],
    [0.97, -0.06],
    [0.0, -0.06],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(pts, seg * 2);
  geo.rotateX(Math.PI / 2); // lathe Y-axis -> Z-axis
  return geo;
}

function buildShroud(seg: number) {
  // inner wall of compressor cover, from inlet to volute
  const pts = [
    [0.74, 1.5],
    [0.76, 1.05],
    [0.8, 0.7],
    [1.02, 0.25],
    [1.2, 0.08],
    [1.3, 0.0],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(pts, seg * 2);
  geo.rotateX(Math.PI / 2);
  return geo;
}

function buildTicks(radius: number, count: number) {
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const major = i % 10 === 0;
    const len = major ? 0.32 : i % 5 === 0 ? 0.2 : 0.1;
    pts.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    pts.push(Math.cos(a) * (radius + len), Math.sin(a) * (radius + len), 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

function OutletFlange({
  curve,
  radius,
  material,
  body,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  radius: number;
  material: THREE.Material;
  body: THREE.Material;
}) {
  const { position, quaternion } = useMemo(() => {
    const p = curve.getPointAt(1);
    const t = curve.getTangentAt(1).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), t);
    return { position: p, quaternion: q };
  }, [curve]);
  return (
    <group position={position} quaternion={quaternion}>
      <mesh material={material}>
        <torusGeometry args={[radius, 0.05, 12, 48]} />
      </mesh>
      <mesh position={[0, 0, -0.06]} material={body}>
        <torusGeometry args={[radius + 0.02, 0.035, 10, 48]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
        <cylinderGeometry args={[radius - 0.01, radius - 0.01, 0.02, 48]} />
        <meshStandardMaterial color="#080B10" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

/* ---------- Model ---------- */
function Turbo({ active, reducedMotion, compact, onReady }: TurboSceneProps) {
  const body = useRef<THREE.Group>(null);
  const wheel = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const ready = useRef(false);
  const seg = compact ? 18 : 32;

  const compCurve = useMemo(() => new VoluteCurve(1.25, 1.5, 1.5), []);
  const turbCurve = useMemo(() => new VoluteCurve(1.0, 1.25, 1.0), []);
  const geo = useMemo(() => {
    return {
      compVolute: buildVolute(1.25, 1.5, 0.2, 0.46, 1.5, seg),
      turbVolute: buildVolute(1.0, 1.25, 0.18, 0.38, 1.0, seg),
      blade: buildBlade(false),
      splitter: buildBlade(true),
      hub: buildHub(seg),
      shroud: buildShroud(seg),
      ticks: buildTicks(2.55, 120),
      ticksInner: buildTicks(2.25, 60),
    };
  }, [seg]);

  useLayoutEffect(() => {
    return () => Object.values(geo).forEach((g) => g.dispose());
  }, [geo]);

  const mats = useMemo(
    () => ({
      housing: new THREE.MeshStandardMaterial({ color: "#b9c2ce", metalness: 0.92, roughness: 0.34, side: THREE.DoubleSide }),
      cast: new THREE.MeshStandardMaterial({ color: "#2a313b", metalness: 0.85, roughness: 0.55 }),
      graphite: new THREE.MeshStandardMaterial({ color: "#1b222c", metalness: 0.9, roughness: 0.4 }),
      wheel: new THREE.MeshStandardMaterial({ color: "#e4ebf2", metalness: 1, roughness: 0.24, side: THREE.DoubleSide }),
      blue: new THREE.MeshStandardMaterial({
        color: "#006BFF",
        metalness: 0.7,
        roughness: 0.28,
        emissive: "#003a99",
        emissiveIntensity: 0.35,
      }),
      tick: new THREE.LineBasicMaterial({ color: "#63CFFF", transparent: true, opacity: 0.35 }),
      tickDim: new THREE.LineBasicMaterial({ color: "#9CA9B8", transparent: true, opacity: 0.18 }),
    }),
    [],
  );
  useLayoutEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  useLayoutEffect(() => {
    if (compact || reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [compact, reducedMotion]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    if (reducedMotion || !active) return;
    const t = state.clock.elapsedTime;
    if (wheel.current) wheel.current.rotation.z -= WHEEL_SPIN * dt;
    if (ring.current) ring.current.rotation.z += RING_SPIN * dt;
    if (body.current) {
      const targetY = BASE_YAW + Math.sin(t * DRIFT_SPEED) * DRIFT_AMPLITUDE + pointer.current.x * POINTER_TILT;
      const targetX = BASE_PITCH + pointer.current.y * POINTER_TILT * 0.6;
      const k = 1 - Math.exp(-POINTER_DAMP * dt);
      body.current.rotation.y += (targetY - body.current.rotation.y) * k;
      body.current.rotation.x += (targetX - body.current.rotation.x) * k;
    }
  });

  const blades = 7;
  const bolts = 10;

  return (
    <group>
      {/* Background technical rings */}
      <group ref={ring} position={[0, 0, -2.6]}>
        <lineSegments geometry={geo.ticks} material={mats.tick} />
        <lineSegments geometry={geo.ticksInner} material={mats.tickDim} />
        <mesh>
          <torusGeometry args={[2.55, 0.006, 6, 160]} />
          <meshBasicMaterial color="#63CFFF" transparent opacity={0.4} />
        </mesh>
        <mesh>
          <torusGeometry args={[3.1, 0.004, 6, 160]} />
          <meshBasicMaterial color="#006BFF" transparent opacity={0.5} />
        </mesh>
      </group>

      <group ref={body} rotation={[BASE_PITCH, BASE_YAW, 0.05]} scale={compact ? 0.86 : 0.88} position={[-0.15, -0.05, 0]}>
        {/* Compressor side */}
        <mesh geometry={geo.compVolute} material={mats.housing} />
        <mesh geometry={geo.shroud} material={mats.housing} />
        {/* back plate */}
        <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]} material={mats.graphite}>
          <cylinderGeometry args={[1.62, 1.62, 0.12, seg * 2]} />
        </mesh>
        {/* inlet machined rings */}
        <mesh position={[0, 0, 1.5]} material={mats.blue}>
          <torusGeometry args={[0.8, 0.07, 16, seg * 2]} />
        </mesh>
        <mesh position={[0, 0, 1.33]} material={mats.housing}>
          <torusGeometry args={[0.8, 0.04, 12, seg * 2]} />
        </mesh>
        <mesh position={[0, 0, 1.18]} material={mats.housing}>
          <torusGeometry args={[0.8, 0.03, 12, seg * 2]} />
        </mesh>
        {/* v-band clamp */}
        <mesh position={[0, 0, -0.22]} material={mats.blue}>
          <torusGeometry args={[1.6, 0.05, 12, seg * 2]} />
        </mesh>
        {Array.from({ length: bolts }).map((_, i) => {
          const a = (i / bolts) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 1.42, Math.sin(a) * 1.42, -0.03]}
              rotation={[Math.PI / 2, 0, 0]}
              material={mats.graphite}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.08, 6]} />
            </mesh>
          );
        })}

        <OutletFlange curve={compCurve} radius={0.46} material={mats.blue} body={mats.housing} />

        {/* Compressor wheel */}
        <group ref={wheel} position={[0, 0, 0.02]}>
          <mesh geometry={geo.hub} material={mats.wheel} />
          {Array.from({ length: blades }).map((_, i) => (
            <group key={i} rotation={[0, 0, (i / blades) * Math.PI * 2]}>
              <mesh geometry={geo.blade} material={mats.wheel} />
              <mesh
                geometry={geo.splitter}
                material={mats.wheel}
                rotation={[0, 0, Math.PI / blades]}
              />
            </group>
          ))}
          {/* nut */}
          <mesh position={[0, 0, 1.17]} rotation={[Math.PI / 2, 0, 0]} material={mats.blue}>
            <cylinderGeometry args={[0.075, 0.075, 0.1, 6]} />
          </mesh>
        </group>

        {/* Center bearing housing */}
        <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]} material={mats.graphite}>
          <cylinderGeometry args={[0.62, 0.7, 1.1, seg]} />
        </mesh>
        {[-0.45, -0.75, -1.05].map((z) => (
          <mesh key={z} position={[0, 0, z]} material={mats.cast}>
            <torusGeometry args={[0.7, 0.035, 8, seg * 2]} />
          </mesh>
        ))}
        {/* oil feed */}
        <mesh position={[0, 0.85, -0.75]} material={mats.housing}>
          <cylinderGeometry args={[0.09, 0.09, 0.45, 12]} />
        </mesh>

        {/* Turbine side */}
        <group position={[0, 0, -1.55]} rotation={[0, Math.PI, Math.PI * 0.6]}>
          <mesh geometry={geo.turbVolute} material={mats.cast} />
          <OutletFlange curve={turbCurve} radius={0.38} material={mats.graphite} body={mats.cast} />
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={mats.cast}>
            <cylinderGeometry args={[1.25, 1.25, 0.18, seg * 2]} />
          </mesh>
          <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]} material={mats.graphite}>
            <cylinderGeometry args={[0.55, 0.62, 0.6, seg]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function TurboScene(props: TurboSceneProps) {
  const frameloop = props.reducedMotion ? "demand" : props.active ? "always" : "never";
  return (
    <Canvas
      frameloop={frameloop}
      dpr={props.compact ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8.4], fov: 34 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#F5F7FA" />
      <pointLight position={[-4, 1, -2]} intensity={10} color="#006BFF" distance={14} />
      <pointLight position={[4, -2, -3]} intensity={12} color="#63CFFF" distance={12} />
      <Environment resolution={128}>
        <Lightformer intensity={2.6} position={[0, 5, 2]} scale={[10, 3, 1]} color="#F5F7FA" />
        <Lightformer intensity={1.4} position={[2, 1, 6]} scale={[6, 2, 1]} color="#F5F7FA" />
        <Lightformer intensity={0.9} position={[-6, 0, 0]} rotation-y={Math.PI / 2} scale={[12, 1.2, 1]} color="#006BFF" />
        <Lightformer intensity={1.6} position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 0.6, 1]} color="#63CFFF" />
        <Lightformer intensity={0.6} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#141A23" />
      </Environment>
      <Turbo {...props} />
    </Canvas>
  );
}
