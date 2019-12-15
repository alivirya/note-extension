import "codemirror/lib/codemirror.css"
import "../code-block/todo"
import "../themes/phoebe.css"

import { getLighter, invertRGB } from '../utilities/color';

import $ from 'jquery';
import CodeMirror from "codemirror"
import Footer from './Footer'
import React from 'react';

type EditorProps = { 
    currentTab: string;
}

type EditorState = {
    theme: string;
}

class Editor extends React.Component<EditorProps, EditorState> {
    private editor!: CodeMirror.Editor;
    private name: string;
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            theme: "phoebe",
        };
        this.handleChange = this.handleChange.bind(this);
        this.updateTheme =  this.updateTheme.bind(this);
        this.name = props.currentTab;
    }

    componentDidMount() {
        this.editor = CodeMirror.fromTextArea(document.getElementById("editor")! as HTMLTextAreaElement, {
            lineNumbers: true,
            indentUnit: 4,
            theme: "phoebe",
            mode: "todo",
        });

        if (localStorage.getItem(this.name)) {
            this.editor.setValue(localStorage.getItem(this.name)!);
        }

        this.updateStyle();
        this.editor.on("changes", this.handleChange)
        this.editor.refresh()
    }

    componentDidUpdate() {
        this.name = this.props.currentTab;
        if (localStorage.getItem(this.name) !== null) {
            this.editor.setValue(localStorage.getItem(this.name)!);
        }
        this.editor.setOption("theme", this.state.theme);
        this.updateStyle();
        this.editor.refresh()
    }

    handleChange() {
        localStorage.setItem(this.name, this.editor.getValue());
    }

    updateTheme(theme: string) {
        this.setState({
            theme: theme
        });
    }

    updateStyle() {
        let doc = document.querySelector(`.cm-s-${this.state.theme}.CodeMirror`) as HTMLElement;
        let color = getComputedStyle(doc).backgroundColor;
        let complement = invertRGB(color);
        let otherColors = getLighter(color);
        let tabs = $('.tab');
        let tabArea = $('#tabArea');
        let footer = $('#footer');
        footer.css("background-color", otherColors);
        tabArea.css("background-color", otherColors);
        
        // With each one, calculate the percentage and apply the width.
        tabs.each(function() {
            $(this).css('background-color', color);
            $(this).css('color', complement);
        });

        
    }

    render() {
        return (
            <div id="editorArea">
                <textarea id="editor"></textarea>
                <Footer updateTheme={this.updateTheme}/>
            </div>
        )
    }
}

export default Editor;

/*
In Javascript, you cannot read from a local file, (without it being user selected), as this results in some security issues. (If the server can read from your local
    computer... who knows what it can access?)
*/
