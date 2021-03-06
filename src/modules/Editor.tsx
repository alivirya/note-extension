import "codemirror/lib/codemirror.css"
import "../code-block/todo"
import "../themes/phoebe.css"

import { getLighter, getSlightlyLighter, invertRGB } from '../utilities/Color';

import $ from 'jquery';
import CodeMirror from "codemirror"
import Footer from './Footer'
import { Note } from "../objects/Note"
import { NoteTakerDatabase } from '../objects/Database';
import React from 'react';

type EditorProps = { 
    currentNote: Note;
    db: NoteTakerDatabase;
}

type EditorState = {
    theme: string;
}

let theme: string;
if (localStorage.getItem("theme") === null)  localStorage.setItem("theme", "phoebe");
theme = localStorage.getItem("theme") !== null ? localStorage.getItem("theme")! : "phoebe";

class Editor extends React.Component<EditorProps, EditorState> {
    private editor!: CodeMirror.Editor;
    private currentNote: Note;
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            theme,
        };
        this.handleChange = this.handleChange.bind(this);
        this.updateTheme =  this.updateTheme.bind(this);
        this.currentNote = props.currentNote;
    }

    componentDidMount() {
        let editor = document.getElementById("editor");
        if (editor === null) return;
        this.editor = CodeMirror.fromTextArea(editor as HTMLTextAreaElement, {
            lineNumbers: true,
            indentUnit: 4,
            mode: "todo",
        });
        this.editor.setValue(this.currentNote.getEditorData());
        this.editor.setOption("theme", this.state.theme);
        this.updateStyle();
        this.editor.on("changes", this.handleChange)
        this.editor.refresh()
    }

    componentDidUpdate() {
        this.currentNote = this.props.currentNote;
        this.editor.setValue(this.currentNote.getEditorData());
        this.editor.setOption("theme", this.state.theme);
        this.updateStyle();
        this.editor.refresh()
    }

    handleChange() {
        this.props.db.notes
            .update(this.currentNote.getId(), {editorData: this.editor.getValue()})
    }

    updateTheme(theme: string) {
        localStorage.setItem("theme", theme);
        this.setState({
            theme: theme
        });
    }

    updateStyle() {
        try {
            console.log(`updating style with currentTab of ${this.props.currentNote.getId()}`);
            let doc = document.querySelector(`.cm-s-${this.state.theme}.CodeMirror`) as HTMLElement;
            let color = getComputedStyle(doc).backgroundColor;
            let complement = invertRGB(color);
            let slight = getSlightlyLighter(color);
            let otherColors = getLighter(color);
            let tabs = $('.tab');
            $('#tabArea').css("background-color", slight);
            $('#footer').css("background-color", color);
            $('#add').css("background-color", color);
            $('#add').css("color", complement);
            $('#themeSelector').css("color", "#FFF");
            $('#themeSelector').css("background-color", otherColors);
            
            tabs.each(function() {
                $(this).css('background-color', otherColors);
                $(this).css('color', complement);
            });
            $(`#${this.props.currentNote.getId()}`).css("background-color", color);
        } catch (err) {
            console.log(err);
        }
        
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
