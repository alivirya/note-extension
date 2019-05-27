import React from 'react';
import ReactDOM from 'react-dom';
import 'codemirror/lib/codemirror.css'
import './index.css';
import App from './App';
import CodeMirror from 'codemirror'
import * as serviceWorker from './serviceWorker';
ReactDOM.render(<App />, document.getElementById('root'));
let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
})
editor.refresh()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
