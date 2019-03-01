import ResizeObserver from 'resize-observer-polyfill';
import React, {
  RefObject,
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';

export default function UseDimensions() {
  const ref = useRef<HTMLDivElement | null>(null);
  const dimensions = useDimensions(ref);
  return (
    <div className="dimensions-box" ref={ref}>
      {dimensions.width} x {dimensions.height}
    </div>
  );
}

export function useDimensions(
  ref: RefObject<HTMLElement | null | undefined>
): Dimensions {
  const [dimensions, setDimensions] = useState(getSize(ref.current));

  const handleResize = useCallback(() => {
    if (ref.current) {
      setDimensions(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    handleResize();

    let resizeObserver: ResizeObserver | null = new ResizeObserver(
      handleResize
    );
    resizeObserver.observe(ref.current);

    return () => {
      if (resizeObserver != null) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
  }, [ref.current]);

  return dimensions;
}

interface Dimensions {
  width: number;
  height: number;
}

function getSize(el: HTMLElement | undefined | null): Dimensions {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}
