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

/*
In Javascript, you cannot read from a local file, (without it being user selected), as this results in some security issues. (If the server can read from your local
    computer... who knows what it can access?)
*/

let editor = CodeMirror.fromTextArea(document.getElementById("editor")! as HTMLTextAreaElement, {
    lineNumbers: true,
    indentUnit: 4,
    theme: "todo",
    mode: "todo",
});
editor.refresh()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
