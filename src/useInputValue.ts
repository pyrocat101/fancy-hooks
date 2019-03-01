import {InputHTMLAttributes, useState, useCallback} from 'react';

export default function useInputValue<
  T extends HTMLInputElement = HTMLInputElement
>(initialValue: string): Pick<InputHTMLAttributes<T>, 'value' | 'onChange'> {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback(
    (event: React.ChangeEvent<T>) => setValue(event.target.value),
    []
  );

  return {
    value,
    onChange,
  };
}
