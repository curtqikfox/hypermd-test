import React from 'react';
import logo from './logo.svg';
import './App.css';

import Editor from './Editor';

function App() {
  return (
    <div className="App">
      <div style={{border: "1px solid lightgrey"}} className="EditorContainer">
        <Editor />
      </div>
    </div>
  );
}

export default App;
