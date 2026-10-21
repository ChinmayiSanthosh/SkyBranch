import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import type { Bounds } from "../utils/tree";

export interface View {
  x: number;
  y: number;
  k: number;
}

const MAX_K = 2.5;
const FIT_PAD = 48; // breathing room when the whole tree is fitted
const EDGE_MARGIN = 24; // how close the tree's edge may get to the canvas edge

// The smallest zoom allowed: the one where the whole tree fits in the canvas
function fitScale(b: Bounds, w: number, h: number) {
  const bw = Math.max(b.maxX - b.minX, 1);
  const bh = Math.max(b.maxY - b.minY, 1);
  return Math.max(0.05, Math.min((w - FIT_PAD * 2) / bw, (h - FIT_PAD * 2) / bh, 1));
}

// Keeps the tree inside the canvas on one axis. If it is smaller than the canvas, it is centred.
function clampAxis(offset: number, k: number, min: number, max: number, viewport: number) {
  const contentMin = min * k;
  const contentMax = max * k;
  if (contentMax - contentMin <= viewport - EDGE_MARGIN * 2) {
    return viewport / 2 - (contentMin + contentMax) / 2;
  }
  const lowest = viewport - EDGE_MARGIN - contentMax;
  const highest = EDGE_MARGIN - contentMin;
  return Math.min(highest, Math.max(lowest, offset));
}

function constrainView(v: View, b: Bounds, w: number, h: number): View {
  if (!w || !h) return v;
  const k = Math.min(MAX_K, Math.max(fitScale(b, w, h), v.k));
  return {
    k,
    x: clampAxis(v.x, k, b.minX, b.maxX, w),
    y: clampAxis(v.y, k, b.minY, b.maxY, h),
  };
}

export function usePanZoom(containerRef: RefObject<HTMLDivElement | null>, bounds: Bounds) {
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const [animate, setAnimate] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const sizeRef = useRef(size);
  const boundsRef = useRef(bounds);
  const last = useRef<{ x: number; y: number } | null>(null);

  const constrain = useCallback(
    (v: View) => constrainView(v, boundsRef.current, sizeRef.current.w, sizeRef.current.h),
    []
  );

  // When the tree changes shape, make sure the current view is still inside it
  useEffect(() => {
    boundsRef.current = bounds;
    setView((v) => constrain(v));
  }, [bounds, constrain]);

  // Track the canvas size, and keep the view inside the tree when it changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const next = { w: el.clientWidth, h: el.clientHeight };
      sizeRef.current = next;
      setSize(next);
      setView((v) => constrain(v));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, constrain]);

  // Ctrl + scroll (or a trackpad pinch) zooms towards the pointer. Plain scroll scrolls the page.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const factor = Math.exp(-event.deltaY * 0.01);
      const minK = fitScale(boundsRef.current, sizeRef.current.w, sizeRef.current.h);
      setAnimate(false);
      setView((v) => {
        const k = Math.min(MAX_K, Math.max(minK, v.k * factor));
        const ratio = k / v.k;
        return constrain({ k, x: px - (px - v.x) * ratio, y: py - (py - v.y) * ratio });
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [containerRef, constrain]);

  const fit = useCallback(
    (b: Bounds) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      const k = fitScale(b, w, h);
      setAnimate(true);
      setView(
        constrain({
          k,
          x: w / 2 - ((b.minX + b.maxX) / 2) * k,
          y: h / 2 - ((b.minY + b.maxY) / 2) * k,
        })
      );
    },
    [constrain]
  );

  // Glide so that the given point is in the middle of the canvas (as far as the edges allow)
  const focus = useCallback(
    (x: number, y: number, scale?: number) => {
      const { w, h } = sizeRef.current;
      setAnimate(true);
      setView((v) => {
        const k = scale ?? v.k;
        return constrain({ k, x: w / 2 - x * k, y: h / 2 - y * k });
      });
    },
    [constrain]
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const { w, h } = sizeRef.current;
      const minK = fitScale(boundsRef.current, w, h);
      setAnimate(true);
      setView((v) => {
        const k = Math.min(MAX_K, Math.max(minK, v.k * factor));
        const ratio = k / v.k;
        return constrain({ k, x: w / 2 - (w / 2 - v.x) * ratio, y: h / 2 - (h / 2 - v.y) * ratio });
      });
    },
    [constrain]
  );

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    last.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setAnimate(false);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!last.current) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    last.current = { x: event.clientX, y: event.clientY };
    setView((v) => constrain({ ...v, x: v.x + dx, y: v.y + dy }));
  };

  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    if (!last.current) return;
    last.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    view,
    animate,
    dragging,
    size,
    fit,
    focus,
    zoomBy,
    bind: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag },
  };
}