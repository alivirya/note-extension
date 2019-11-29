import "codemirror/lib/codemirror.css"
import "./themes/todo.css"
import "./code-block/todo"
import "./index.css";

import * as serviceWorker from "./serviceWorker";

import App from "./App";
import CodeMirror from "codemirror"
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("root"));
let editor = CodeMirror.fromTextArea(document.getElementById("editor")! as HTMLTextAreaElement, {
    lineNumbers: true,
    indentUnit: 4,
    theme: "todo",
    mode: "todo"
});
editor.refresh()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
