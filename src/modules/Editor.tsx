import "codemirror/lib/codemirror.css"
import "../themes/todo.css"
import "../code-block/todo"

import CodeMirror from "codemirror"
import React from 'react';

class Editor extends React.Component {
    private editor!: CodeMirror.Editor;
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.editor = CodeMirror.fromTextArea(document.getElementById("editor")! as HTMLTextAreaElement, {
            lineNumbers: true,
            indentUnit: 4,
            theme: "todo",
            mode: "todo",
        });
        this.editor.on("change", this.handleChange)
        this.editor.refresh()
    }

    handleChange() {
        console.log(this.editor.getValue())
    }

    render() {
        return (
            <textarea id="editor"></textarea>
        )
    }
}

//TODO: fix error with null in todo.js. Screenshot at desktop

export default Editor;

/*
In Javascript, you cannot read from a local file, (without it being user selected), as this results in some security issues. (If the server can read from your local
    computer... who knows what it can access?)
*/
