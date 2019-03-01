import React, {useEffect, useRef, useState} from 'react';
import useIsMounted from './useIsMounted';
import useInputValue from './useInputValue';
import pDebounce from 'p-debounce';

async function searchMovie(keyword: string): Promise<string> {
  const url = new URL('http://www.omdbapi.com/?apiKey=4e274bef');
  url.searchParams.append('t', keyword);
  const res = await fetch(url.toString());
  const json = await res.json();
  if (json.Title) {
    return `${json.Title} (${json.Year})`;
  } else {
    return 'Not found :(';
  }
}

const debouncedSearchMovie = pDebounce(searchMovie, 500);

export default function UseAsync() {
  const inputProps = useInputValue('');
  return (
    <div className="movie-search">
      <input type="text" {...inputProps} placeholder="Enter a movie name" />
      {inputProps.value ? (
        <SearchMovie keyword={String(inputProps.value)} />
      ) : (
        <p>(Type to search)</p>
      )}
    </div>
  );
}

export function SearchMovie(props: {keyword: string}) {
  const asyncState: AsyncState<string> = useAsync(debouncedSearchMovie, [
    props.keyword,
  ]);
  switch (asyncState.status) {
    case 'PENDING':
      return <p>Loading...</p>;
    case 'RESOLVED':
      return <p>Search result: {asyncState.value}</p>;
    case 'REJECTED':
      console.log(asyncState.error);
      return <p>Oops!</p>;
  }
}

export function useAsync<
  T,
  F extends (...args: any[]) => Promise<T>,
  P extends FuncParams<F>
>(asyncFn: F, params: P): AsyncState<T> {
  const [asyncState, setAsyncState] = useState<AsyncState<T>>({
    status: 'PENDING',
  });
  const promiseRef = useRef<Promise<T> | null>(null);
  const isMounted = useIsMounted();
  const shouldHandlePromise = (promise: Promise<T>): boolean => {
    return isMounted() && promise === promiseRef.current;
  };

  useEffect(() => {
    try {
      const promise = asyncFn(...params);
      promiseRef.current = promise;
      promise.then(
        value => {
          if (shouldHandlePromise(promise)) {
            setAsyncState({status: 'RESOLVED', value});
          }
        },
        error => {
          if (shouldHandlePromise(promise)) {
            setAsyncState({status: 'REJECTED', error});
          }
        }
      );
    } catch (error) {
      setAsyncState({status: 'REJECTED', error});
    }
    return () => {
      // Prevent memory leak
      promiseRef.current = null;
    };
  }, [asyncFn, ...params]);
  return asyncState;
}

export type AsyncState<T> =
  | {status: 'PENDING'}
  | {status: 'REJECTED'; error: any}
  | {status: 'RESOLVED'; value: T};

export type FuncParams<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : any;

export async function sleep(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
