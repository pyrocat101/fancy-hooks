import React, {useState, useEffect} from 'react';
import cx from 'classnames';

export default function UseKeyPress() {
  const hasPressedQ = useKeyPress('q');
  const hasPressedW = useKeyPress('w');
  const hasPressedE = useKeyPress('e');
  const hasPressedR = useKeyPress('r');
  const hasPressedT = useKeyPress('t');
  return (
    <div className="keypress-box">
      <span className={cx({pressed: hasPressedQ})}>Q</span>
      <span className={cx({pressed: hasPressedW})}>W</span>
      <span className={cx({pressed: hasPressedE})}>E</span>
      <span className={cx({pressed: hasPressedR})}>R</span>
      <span className={cx({pressed: hasPressedT})}>T</span>
    </div>
  );
}

export function useKeyPress(key: string) {
  const [state, setState] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [key]);

  return state;

  function downHandler(event: KeyboardEvent) {
    if (event.key === key) {
      setState(true);
    }
  }

  function upHandler(event: KeyboardEvent) {
    if (event.key === key) {
      setState(false);
    }
  }
}
