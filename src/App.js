import "codemirror";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/markdown-fold";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import React from "react";

import * as HyperMD from "qik-hypermd-fork";
// import "hypermd-mermaid"

import 'qik-hypermd-fork/addon/hide-token';
import 'qik-hypermd-fork/addon/cursor-debounce';
import 'qik-hypermd-fork/addon/fold';
import 'qik-hypermd-fork/addon/read-link';
import 'qik-hypermd-fork/addon/click';
import 'qik-hypermd-fork/addon/hover';
import 'qik-hypermd-fork/addon/paste';
import 'qik-hypermd-fork/addon/insert-file';
import 'qik-hypermd-fork/addon/mode-loader';
import 'qik-hypermd-fork/addon/table-align';

import './Toolbar/toolbar.js';

import './App.css';

// import BoldSVG from './images/bold.svg';

// import "./styles.css";

var suggestedEditorConfig = {
  lineNumbers: false,
  lineWrapping: true,
  theme: "hypermd-light",
  mode: "text/x-hypermd",
  tabSize: 4,
  autoCloseBrackets: true,
  matchBrackets: true,
  foldGutter: false,
};

export default function App() {
  const textNode = React.useRef();
  React.useEffect(() => {
    const editor = HyperMD.fromTextArea(textNode.current, {
    });
    HyperMD.switchToHyperMD(editor, suggestedEditorConfig);
  }, []);

  return (
    <div id="App">
      <div id="toolbar-wrapper">
        <input id="fileInput" type="file" /*style={{ display: "none" }}*/ />
      </div>
      <textarea id="main-editor" ref={textNode} />
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
