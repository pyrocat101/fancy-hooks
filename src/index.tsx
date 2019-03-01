import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import UseOutsideClick from './UseOutsideClick';
import UseDimensions from './UseDimensions';
import UseKeyPress from './UseKeyPress';
import UseAsync from './UseAsync';

function App() {
  return (
    <main>
      <h1>React Hooks</h1>
      <h2>useOutsideClick</h2>
      <UseOutsideClick />
      <h2>useKeyPress</h2>
      <UseKeyPress />
      <h2>useDimensions</h2>
      <UseDimensions />
      <h2>useAsync</h2>
      <UseAsync />
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById('root')!);
