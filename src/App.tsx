import "./App.css";
import "typeface-roboto-mono"

import React from 'react';
import Tabs from './Tabs';

const App: React.FC = () => {
  return (
    <div className="App">
      <Tabs />
      <textarea id="editor"></textarea>
    </div>
  );
}


export default App;
