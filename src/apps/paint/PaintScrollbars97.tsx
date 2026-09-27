'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { getScrollbarThumbOffset97, getScrollPositionFromThumbDrag97 } from './paint-scrollbar-geometry97';

interface PaintScrollMetrics97 {
  left: number;
  top: number;
  maxLeft: number;
  maxTop: number;
  trackWidth: number;
  trackHeight: number;
}

type ScrollAxis97 = 'horizontal' | 'vertical';

interface PaintScrollDrag97 {
  axis: ScrollAxis97;
  pointerId: number;
  start: number;
  initialScroll: number;
  trackLength: number;
  scrollRange: number;
}

interface PaintScrollbars97Props {
  viewportRef: RefObject<HTMLDivElement | null>;
}

const EMPTY_METRICS: PaintScrollMetrics97 = { left: 0, top: 0, maxLeft: 0, maxTop: 0, trackWidth: 0, trackHeight: 0 };
const clamp = (value: number, maximum: number) => Math.max(0, Math.min(maximum, value));

export default function PaintScrollbars97({ viewportRef }: PaintScrollbars97Props) {
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const verticalTrackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<PaintScrollDrag97 | null>(null);
  const [metrics, setMetrics] = useState(EMPTY_METRICS);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const horizontalTrack = horizontalTrackRef.current;
      const verticalTrack = verticalTrackRef.current;
      setMetrics({
        left: viewport.scrollLeft,
        top: viewport.scrollTop,
        maxLeft: Math.max(0, viewport.scrollWidth - viewport.clientWidth),
        maxTop: Math.max(0, viewport.scrollHeight - viewport.clientHeight),
        trackWidth: Math.max(0, (horizontalTrack?.clientWidth ?? 0) - 40),
        trackHeight: Math.max(0, (verticalTrack?.clientHeight ?? 0) - 40),
      });
    };
    viewport.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(viewport);
    if (viewport.firstElementChild instanceof HTMLElement) observer?.observe(viewport.firstElementChild);
    if (horizontalTrackRef.current) observer?.observe(horizontalTrackRef.current);
    if (verticalTrackRef.current) observer?.observe(verticalTrackRef.current);
    measure();
    return () => {
      viewport.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [viewportRef]);

  const scrollBy = (axis: ScrollAxis97, amount: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (axis === 'horizontal') viewport.scrollLeft = clamp(viewport.scrollLeft + amount, Math.max(0, viewport.scrollWidth - viewport.clientWidth));
    else viewport.scrollTop = clamp(viewport.scrollTop + amount, Math.max(0, viewport.scrollHeight - viewport.clientHeight));
  };

  const beginDrag = (axis: ScrollAxis97, event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const track = axis === 'horizontal' ? horizontalTrackRef.current : verticalTrackRef.current;
    if (!viewport || !track) return;
    event.preventDefault();
    event.stopPropagation();
    const metricsNow = axis === 'horizontal' ? metrics.maxLeft : metrics.maxTop;
    const trackLength = axis === 'horizontal' ? metrics.trackWidth : metrics.trackHeight;
    dragRef.current = {
      axis,
      pointerId: event.pointerId,
      start: axis === 'horizontal' ? event.clientX : event.clientY,
      initialScroll: axis === 'horizontal' ? viewport.scrollLeft : viewport.scrollTop,
      trackLength,
      scrollRange: metricsNow,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport || drag.pointerId !== event.pointerId) return;
    const coordinate = drag.axis === 'horizontal' ? event.clientX : event.clientY;
    const thumbLength = drag.axis === 'horizontal' ? 70 : 60;
    const next = getScrollPositionFromThumbDrag97(drag.initialScroll, coordinate - drag.start, drag.scrollRange, drag.trackLength, thumbLength);
    if (drag.axis === 'horizontal') viewport.scrollLeft = next;
    else viewport.scrollTop = next;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const pageTrack = (axis: ScrollAxis97, event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (axis === 'horizontal') {
      const local = event.clientX - rect.left - 20;
      const thumbStart = metrics.maxLeft ? metrics.left / metrics.maxLeft * Math.max(0, metrics.trackWidth - 70) : 0;
      scrollBy(axis, local < thumbStart ? -Math.max(40, viewportRef.current?.clientWidth ?? 40) : Math.max(40, viewportRef.current?.clientWidth ?? 40));
    } else {
      const local = event.clientY - rect.top - 20;
      const thumbStart = metrics.maxTop ? metrics.top / metrics.maxTop * Math.max(0, metrics.trackHeight - 60) : 0;
      scrollBy(axis, local < thumbStart ? -Math.max(32, viewportRef.current?.clientHeight ?? 32) : Math.max(32, viewportRef.current?.clientHeight ?? 32));
    }
  };

  const onThumbKeyDown = (axis: ScrollAxis97, event: ReactKeyboardEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const horizontal = axis === 'horizontal';
    const step = event.key.startsWith('Page') ? (horizontal ? viewport.clientWidth : viewport.clientHeight) : 24;
    const key = event.key;
    const isAxisKey = horizontal ? key === 'ArrowLeft' || key === 'ArrowRight' : key === 'ArrowUp' || key === 'ArrowDown';
    if (isAxisKey || key === 'PageUp' || key === 'PageDown' || key === 'Home' || key === 'End') event.preventDefault();
    if (key === 'Home') scrollBy(axis, -Infinity);
    else if (key === 'End') scrollBy(axis, Infinity);
    else if (key === 'PageUp' || key === 'ArrowLeft' || key === 'ArrowUp') scrollBy(axis, -step);
    else if (key === 'PageDown' || key === 'ArrowRight' || key === 'ArrowDown') scrollBy(axis, step);
  };

  const horizontalOffset = getScrollbarThumbOffset97(metrics.left, metrics.maxLeft, metrics.trackWidth, 70);
  const verticalOffset = getScrollbarThumbOffset97(metrics.top, metrics.maxTop, metrics.trackHeight, 60);

  return <>
    <div className="win97-paint-scrollbar-h" aria-label="Horizontal drawing scrollbar">
      <button type="button" aria-label="Scroll drawing left" onClick={() => scrollBy('horizontal', -24)}>◀</button>
      <div ref={horizontalTrackRef} className="win97-paint-scroll-track-x" onPointerDown={event => pageTrack('horizontal', event)}>
        <div className="win97-paint-scroll-thumb-x" role="scrollbar" aria-label="Horizontal drawing position" aria-orientation="horizontal" aria-valuemin={0} aria-valuemax={metrics.maxLeft} aria-valuenow={Math.round(metrics.left)} tabIndex={0} style={{ transform: `translateX(${horizontalOffset}px)` }} onPointerDown={event => beginDrag('horizontal', event)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={event => onThumbKeyDown('horizontal', event)} />
      </div>
      <button type="button" aria-label="Scroll drawing right" onClick={() => scrollBy('horizontal', 24)}>▶</button><div className="win97-paint-scrollbar-blank" aria-hidden="true" />
    </div>
    <div className="win97-paint-scrollbar-v" aria-label="Vertical drawing scrollbar">
      <button type="button" aria-label="Scroll drawing up" onClick={() => scrollBy('vertical', -24)}>▲</button>
      <div ref={verticalTrackRef} className="win97-paint-scroll-track-y" onPointerDown={event => pageTrack('vertical', event)}>
        <div className="win97-paint-scroll-thumb-y" role="scrollbar" aria-label="Vertical drawing position" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={metrics.maxTop} aria-valuenow={Math.round(metrics.top)} tabIndex={0} style={{ transform: `translateY(${verticalOffset}px)` }} onPointerDown={event => beginDrag('vertical', event)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={event => onThumbKeyDown('vertical', event)} />
      </div>
      <button type="button" aria-label="Scroll drawing down" onClick={() => scrollBy('vertical', 24)}>▼</button>
    </div>
  </>;
}
