import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";

import { TurboFallback } from "./TurboFallback";

const TurboScene = lazy(() => import("./TurboScene"));

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.warn("3D hero unavailable, showing static illustration.", error);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Mode = "pending" | "3d" | "static";

function canRender3D(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("static")) return false;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return false;
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
    if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 2) return false;
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Hero 3D centerpiece. The static illustration renders on the server and stays until the
 * 3D scene has drawn its first frame, so the headline and buttons never wait on WebGL.
 */
export function HeroVisual() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sm = window.matchMedia("(max-width: 767px)");
    setReducedMotion(mq.matches);
    setCompact(sm.matches);
    const onMq = () => setReducedMotion(mq.matches);
    const onSm = () => setCompact(sm.matches);
    mq.addEventListener("change", onMq);
    sm.addEventListener("change", onSm);

    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    // Let the headline paint first, then decide on 3D.
    const idle =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => setMode(canRender3D() ? "3d" : "static"), { timeout: 1200 });

    return () => {
      mq.removeEventListener("change", onMq);
      sm.removeEventListener("change", onSm);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry && setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fallback = (
    <TurboFallback className="h-full w-full max-h-[min(80vh,640px)] object-contain opacity-90" />
  );

  return (
    <div
      ref={wrapper}
      className="relative h-full w-full"
      data-scene-mode={mode}
      data-scene-ready={ready || mode === "static" ? "true" : undefined}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        {fallback}
      </div>
      {mode === "3d" && (
        <SceneBoundary fallback={null}>
          <Suspense fallback={null}>
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
            >
              <TurboScene
                active={inView && tabVisible}
                reducedMotion={reducedMotion}
                compact={compact}
                onReady={() => setReady(true)}
              />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
