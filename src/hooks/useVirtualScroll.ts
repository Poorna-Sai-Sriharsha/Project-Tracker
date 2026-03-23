import { useState, useCallback, useRef, useEffect } from 'react';

interface VirtualScrollOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult {
  visibleItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollTop: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useVirtualScroll({
  totalItems,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const totalHeight = totalItems * itemHeight;

  const visibleItems = (() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2);

    const items: { index: number; offsetTop: number }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, offsetTop: i * itemHeight });
    }
    return items;
  })();

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(target.scrollTop);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { visibleItems, totalHeight, onScroll, scrollTop, containerRef };
}
