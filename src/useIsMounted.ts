import {useEffect, useRef} from 'react';

export default function useIsMounted(): () => boolean {
  const ref = useRef<boolean>(false);
  useEffect(() => {
    ref.current = true;
    return () => void (ref.current = false);
  }, []);
  return () => ref.current;
}
