import "./App.css";
import "typeface-roboto-mono"

import Editor from './modules/Editor'
import React from 'react';
import Tabs from './modules/Tabs';

const App: React.FC = () => {
  return (
    <div className="App">
      <Tabs />
      <Editor />
    </div>
  );
}


export default App;
