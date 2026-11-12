/**
 * Hero centerpiece: the owner's TRP monogram as machined 3D billet (chrome T, candy-blue R and P)
 * in front of a tachometer ring. Every ~10s the scene "revs": the needle sweeps to redline,
 * the monogram spins once and a light streak runs across the chrome.
 * Loaded lazily on the client only (see HeroVisual).
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { P_OUTLINES, R_OUTLINES, T_OUTLINES } from "./trp-outline";

export interface MonogramSceneProps {
  active: boolean; // animate (in view, tab visible)
  reducedMotion: boolean;
  compact: boolean; // small screens
  onReady: () => void;
}

/* ---------- Feel constants ---------- */
const REV_PERIOD = 10; // s between rev cycles
const REV_SPIN_TIME = 1.7; // s for the monogram's full turn
const INTRO_TIME = 2.2; // s for the entrance turn
const IDLE_YAW = 0.32; // rad, slow sway
const IDLE_SPEED = 0.35;
const FLOAT = 0.05;
const POINTER_TILT = 0.22; // rad at screen edge
const POINTER_DAMP = 3;
const DEPTH = 0.2;
const TICKS = 48;
const RING_R = 2.05;
// Gauge sweeps 270° clockwise from lower-left (idle) to lower-right (redline).
const GAUGE_START = Math.PI * 1.25;
const GAUGE_SWEEP = Math.PI * 1.5;
const ARC_SEGMENTS = 96;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** 0 → 1 → 0 needle position over one rev cycle: idle, rev up, hold at redline, drop back. */
function revCurve(phase: number) {
  if (phase < 0.55) return 0.08 + Math.sin(phase * 40) * 0.006;
  if (phase < 0.68) return 0.08 + easeInOutCubic((phase - 0.55) / 0.13) * 0.92;
  if (phase < 0.74) return 1 - Math.sin((phase - 0.68) * 160) * 0.015;
  if (phase < 0.92) return 1 - easeOutCubic((phase - 0.74) / 0.18) * 0.92;
  return 0.08;
}

/** Procedural brushed-metal grain, used as roughness + bump so the flat faces don't read as plastic. */
function brushedTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2600; i++) {
    const y = rand() * size;
    const v = Math.floor(90 + rand() * 90);
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.25 + rand() * 0.35})`;
    ctx.lineWidth = rand() * 1.4 + 0.3;
    const x = rand() * size;
    ctx.beginPath();
    ctx.moveTo(x - 200, y);
    ctx.lineTo(x + 200 + rand() * 200, y + (rand() - 0.5) * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.2, 1.2);
  tex.anisotropy = 4;
  return tex;
}

function buildGeometry(outlines: [number, number][][]) {
  const shapes = outlines.map((pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))));
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.016,
    bevelSegments: 4,
    curveSegments: 1,
  });
  geo.translate(0, 0, -DEPTH / 2);
  geo.computeVertexNormals();
  return geo;
}

function Monogram({ active, reducedMotion, compact, onReady }: MonogramSceneProps) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const needle = useRef<THREE.Group>(null);
  const arc = useRef<THREE.Mesh>(null);
  const streaks = useRef<THREE.InstancedMesh>(null);
  const sweepLight = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const clock = useRef({ t: 0, frames: 0, ready: false });

  // Dev-only: ?heroT=<seconds> starts the animation at that moment (e.g. 8.4 = mid-rev).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const v = Number(new URLSearchParams(window.location.search).get("heroT"));
    if (v > 0) clock.current.t = v;
  }, []);

  const geo = useMemo(
    () => ({
      t: buildGeometry(T_OUTLINES),
      r: buildGeometry(R_OUTLINES),
      p: buildGeometry(P_OUTLINES),
      tick: new THREE.BoxGeometry(0.018, 0.16, 0.02),
      tickMajor: new THREE.BoxGeometry(0.03, 0.28, 0.02),
      ring: new THREE.TorusGeometry(RING_R + 0.22, 0.008, 6, 160),
      ringInner: new THREE.TorusGeometry(RING_R - 0.28, 0.005, 6, 160),
      arc: new THREE.RingGeometry(RING_R + 0.1, RING_R + 0.16, ARC_SEGMENTS, 1, 0, GAUGE_SWEEP),
      needle: new THREE.BoxGeometry(0.035, RING_R * 0.92, 0.02),
      streak: new THREE.PlaneGeometry(1, 0.012),
    }),
    [],
  );

  const brushed = useMemo(() => brushedTexture(), []);
  const mats = useMemo(
    () => ({
      chrome: new THREE.MeshPhysicalMaterial({
        color: "#eef2f7",
        metalness: 1,
        roughness: 0.32,
        roughnessMap: brushed,
        bumpMap: brushed,
        bumpScale: 0.6,
        envMapIntensity: 1.5,
      }),
      blue: new THREE.MeshPhysicalMaterial({
        color: "#0a5cff",
        metalness: 0.65,
        roughness: 0.4,
        roughnessMap: brushed,
        bumpMap: brushed,
        bumpScale: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.2,
      }),
      billet: new THREE.MeshPhysicalMaterial({ color: "#8d99a8", metalness: 1, roughness: 0.32, envMapIntensity: 1 }),
      tick: new THREE.MeshBasicMaterial({ color: "#3a4655", transparent: true, opacity: 0.9 }),
      tickRed: new THREE.MeshBasicMaterial({ color: "#63CFFF" }),
      line: new THREE.MeshBasicMaterial({ color: "#2a3542", transparent: true, opacity: 0.8 }),
      arc: new THREE.MeshBasicMaterial({
        color: "#63CFFF",
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      needle: new THREE.MeshBasicMaterial({ color: "#006BFF" }),
      streak: new THREE.MeshBasicMaterial({
        color: "#63CFFF",
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    }),
    [brushed],
  );

  const streakData = useMemo(() => {
    const n = compact ? 10 : 18;
    return Array.from({ length: n }, (_, i) => ({
      y: ((i * 0.618) % 1) * 3.6 - 1.8,
      z: -1.2 - ((i * 0.37) % 1) * 1.4,
      len: 0.6 + ((i * 0.71) % 1) * 1.6,
      speed: 1.2 + ((i * 0.53) % 1) * 2.2,
      offset: (i * 0.29) % 1,
    }));
  }, [compact]);

  useEffect(() => {
    if (compact || reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [compact, reducedMotion]);

  useLayoutEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
      brushed.dispose();
    },
    [geo, mats, brushed],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const c = clock.current;
    if (active && !reducedMotion) c.t += dt;
    const t = reducedMotion ? INTRO_TIME + 1 : c.t;

    // --- rev cycle (starts after the intro)
    const cycleT = Math.max(0, t - INTRO_TIME);
    const phase = (cycleT % REV_PERIOD) / REV_PERIOD;
    const rev = reducedMotion ? 0.62 : revCurve(phase);

    // --- monogram pose
    if (spin.current && root.current) {
      const intro = Math.min(1, t / INTRO_TIME);
      let yaw = (1 - easeOutCubic(intro)) * -Math.PI * 1.1;
      yaw += Math.sin(cycleT * IDLE_SPEED) * IDLE_YAW * easeOutCubic(intro);
      // one full turn as the needle hits redline
      const spinStart = 0.62 * REV_PERIOD;
      const local = (cycleT % REV_PERIOD) - spinStart;
      if (cycleT > 0 && local > 0 && local < REV_SPIN_TIME) {
        yaw += easeInOutCubic(local / REV_SPIN_TIME) * Math.PI * 2;
      }
      spin.current.rotation.y = reducedMotion ? -0.28 : yaw;
      spin.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.6) * FLOAT;

      const k = 1 - Math.exp(-POINTER_DAMP * dt);
      root.current.rotation.y += (pointer.current.x * POINTER_TILT - root.current.rotation.y) * k;
      root.current.rotation.x += (pointer.current.y * POINTER_TILT * 0.6 - root.current.rotation.x) * k;
    }

    // --- tach needle + glowing arc
    const angle = GAUGE_START - rev * GAUGE_SWEEP;
    if (needle.current) needle.current.rotation.z = angle - Math.PI / 2;
    if (arc.current) {
      arc.current.rotation.z = angle;
      const m = arc.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + rev * 0.75;
      // arc trails from idle up to the needle
      arc.current.geometry.setDrawRange(0, Math.max(1, Math.round(rev * ARC_SEGMENTS)) * 6);
    }

    // --- light streak across the chrome during the rev
    if (sweepLight.current) {
      const s = THREE.MathUtils.clamp((phase - 0.6) / 0.2, 0, 1);
      sweepLight.current.position.x = reducedMotion ? 2 : -8 + s * 16;
    }

    // --- speed streaks, faster near redline
    if (streaks.current) {
      streakData.forEach((d, i) => {
        const travel = ((d.offset + t * d.speed * (0.25 + rev * 1.2) * 0.12) % 1) * 9 - 4.5;
        dummy.position.set(-travel, d.y, d.z);
        dummy.scale.set(d.len * (0.6 + rev), 1, 1);
        dummy.updateMatrix();
        streaks.current!.setMatrixAt(i, dummy.matrix);
      });
      streaks.current.instanceMatrix.needsUpdate = true;
      (streaks.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + rev * 0.45;
    }

    if (!c.ready && ++c.frames > 2) {
      c.ready = true;
      onReady();
    }
    if (reducedMotion && c.frames < 4) state.invalidate();
  });

  const scale = compact ? 1.15 : 1.25;
  return (
    <>
      {/* moving light: drives the streak reflected in the chrome */}
      <Environment resolution={128} frames={reducedMotion ? 1 : Infinity}>
        <Lightformer intensity={2.2} position={[0, 5, 2]} scale={[10, 3, 1]} color="#F5F7FA" />
        <Lightformer intensity={1.2} position={[0, 0, 7]} scale={[8, 3, 1]} color="#9CA9B8" />
        <Lightformer intensity={2} position={[-2, 2.5, 5]} rotation-z={0.5} scale={[10, 0.35, 1]} color="#F5F7FA" />
        <Lightformer intensity={1.4} position={[2, -2, 5]} rotation-z={0.5} scale={[10, 0.25, 1]} color="#F5F7FA" />
        <Lightformer intensity={1.1} position={[-6, 0, 1]} rotation-y={Math.PI / 2} scale={[12, 1.5, 1]} color="#006BFF" />
        <Lightformer intensity={1.6} position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 0.8, 1]} color="#63CFFF" />
        <Lightformer intensity={0.5} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#141A23" />
        <Lightformer ref={sweepLight} intensity={6} position={[-8, 0.5, 5]} scale={[0.6, 10, 1]} color="#F5F7FA" />
      </Environment>

      <group ref={root} position={[compact ? 0 : 0.3, 0, 0]}>
        {/* tachometer ring */}
        <group position={[0, 0, -0.9]}>
          <mesh geometry={geo.ring} material={mats.line} />
          <mesh geometry={geo.ringInner} material={mats.line} />
          {Array.from({ length: TICKS + 1 }).map((_, i) => {
            const a = GAUGE_START - (i / TICKS) * GAUGE_SWEEP;
            const major = i % 6 === 0;
            const red = i / TICKS > 0.84;
            return (
              <mesh
                key={i}
                geometry={major ? geo.tickMajor : geo.tick}
                material={red ? mats.tickRed : mats.tick}
                position={[Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0]}
                rotation={[0, 0, a - Math.PI / 2]}
              />
            );
          })}
          <mesh ref={arc} geometry={geo.arc} material={mats.arc} />
          <group ref={needle}>
            <mesh geometry={geo.needle} material={mats.needle} position={[0, RING_R * 0.46, 0.02]} />
          </group>
        </group>

        <instancedMesh ref={streaks} args={[geo.streak, mats.streak, streakData.length]} />

        {/* the monogram */}
        <group ref={spin} scale={scale}>
          <mesh geometry={geo.t} material={[mats.chrome, mats.billet]} />
          <mesh geometry={geo.r} material={[mats.blue, mats.billet]} position={[0, 0, 0.035]} />
          <mesh geometry={geo.p} material={[mats.blue, mats.billet]} position={[0, 0, 0.07]} />
        </group>
      </group>
    </>
  );
}

export default function MonogramScene(props: MonogramSceneProps) {
  const frameloop = props.reducedMotion ? "demand" : props.active ? "always" : "never";
  return (
    <Canvas
      frameloop={frameloop}
      dpr={props.compact ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.6], fov: 34 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#F5F7FA" />
      <pointLight position={[-4, 1, -2]} intensity={10} color="#006BFF" distance={14} />
      <pointLight position={[4, -2, -3]} intensity={10} color="#63CFFF" distance={12} />
      <Monogram {...props} />
    </Canvas>
  );
}
