import "codemirror/lib/codemirror.css"
import "../themes/todo.css"
import "../code-block/todo"

import CodeMirror from "codemirror"
import React from 'react';

type EditorProps = { 
    currentTab: string;
}

class Editor extends React.Component<EditorProps, {}> {
    private editor!: CodeMirror.Editor;
    private name: string;
    constructor(props: EditorProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.name = props.currentTab;
    }

    componentDidMount() {
        this.editor = CodeMirror.fromTextArea(document.getElementById("editor")! as HTMLTextAreaElement, {
            lineNumbers: true,
            indentUnit: 4,
            theme: "todo",
            mode: "todo",
        });

        if (localStorage.getItem(this.name)) {
            this.editor.setValue(localStorage.getItem(this.name)!);
        }
        this.editor.on("changes", this.handleChange)
        this.editor.refresh()
    }

    componentDidUpdate() {
        this.name = this.props.currentTab;
        if (localStorage.getItem(this.name) !== null) {
            this.editor.setValue(localStorage.getItem(this.name)!);
        }
        this.editor.refresh()
    }

    handleChange() {
        localStorage.setItem(this.name, this.editor.getValue());
    }

    render() {
        return (
            <textarea id="editor"></textarea>
        )
    }
}

class Footer extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div></div>
        )
        
    }
}

export default Editor;

/*
In Javascript, you cannot read from a local file, (without it being user selected), as this results in some security issues. (If the server can read from your local
    computer... who knows what it can access?)
*/
