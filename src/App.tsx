import "./App.css";
import "typeface-roboto-mono"

import PropTypes from 'prop-types';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="App">
      <div id="tabArea"><Tab name="test"/><Tab name="test2" /></div>
      <textarea id="editor"></textarea>
    </div>
  );
}

const Tab = (props: any) => {
    return (
        <div className="tab">
            {props.name}
        </div>
    )
}

Tab.propTypes = {
    name: PropTypes.string.isRequired
}

export default App;
