import React from 'react';
import ReactDOM from 'react-dom';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/go/go'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import "./todoLang"
import './index.css';
import App from './App';
import CodeMirror from 'codemirror'
import * as serviceWorker from './serviceWorker';
ReactDOM.render( <App /> , document.getElementById('root'));
let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    indentUnit: 4,
    theme: "monokai",
    mode: "todoLang"
})
editor.refresh()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//TODO: Need to create on mode
//TODO: Need to see if its possible to create a new settings page which allows for creating a mode interactively - STRETCH