import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  RefObject,
} from 'react';

export default function UseOutsideClick() {
  const [isOutside, setIsOutside] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => setIsOutside(true));
  const handleClick = useCallback(() => setIsOutside(false), []);
  return (
    <div className="click-outside" ref={ref} onClick={handleClick}>
      {isOutside ? 'Clicked outside' : 'Not clicked outside'}
    </div>
  );
}

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: (event: MouseEvent) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    document.addEventListener('click', handle, {capture: true, passive: true});
    return () => {
      document.removeEventListener('click', handle);
    };
  }, []);

  function handle(event: MouseEvent) {
    if (
      !callbackRef.current ||
      !ref.current ||
      ref.current.contains(event.target as Node)
    ) {
      return;
    }
    callbackRef.current(event);
  }
}
