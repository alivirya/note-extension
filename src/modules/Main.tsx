import "typeface-roboto-mono"
import "../static/App.css";

import { getCurrentTab, retrieveAllNotes } from '../utilities/Database';

import Editor from './Editor';
import { Note } from '../objects/Note';
import { NoteTakerDatabase } from '../objects/Database';
import React from 'react';
import Tabs from './Tabs';

type MainState = {
    notes: Note[];
    currentNote: Note;
}

export const db = new NoteTakerDatabase()
db.notes.mapToClass(Note);
const firstNote = new Note();

/*
    THERE MUST BE A BETTER WAY TO DO THIS.
*/
class Main extends React.Component<{}, MainState> {
    constructor(props: any) {
        super(props);
        this.state = {
            notes: [],
            currentNote: firstNote,
        }
        this.updateTabName = this.updateTabName.bind(this);
        this.updateCurrentTab = this.updateCurrentTab.bind(this);
        this.addTab = this.addTab.bind(this);
        this.removeTab = this.removeTab.bind(this);
    }

    async componentDidMount() {
        retrieveAllNotes(db).then(async (notes) => {
            let currentNote: Note;
            if (notes.length === 0) {
                firstNote.setCurrent();
                await this.addTab(firstNote);
                currentNote = firstNote;
            } else {
                currentNote = await getCurrentTab(db) as Note;
            }
            
            this.setState({
                notes,
                currentNote
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    //NOTE: Is there a way to just update one of the note?? as opposed to the entire array
    async updateTabName(id: number, tabName: string) {
        db.notes
            .update(id, {tabName})
            .then(() => {
                const noteUpdate = this.state.notes.find((note) => note.getId() === id);
                if (noteUpdate === undefined) throw new Error("Unable to update note");
                noteUpdate.setTabName(tabName);
                const noteCopy = [...this.state.notes.filter((note) => note.getId() !== id),
                    noteUpdate
                ]
                this.setState({
                    notes: noteCopy
                });
            });
    }

    async addTab(notes?: Note) {
        let note: Note;
        if (notes) {
            note = notes;
        } else {
            note = new Note();
        }

        await db.notes
            .add(note)
            .then((id) => {
                note.setId(id);
                const noteCopy = [...this.state.notes, note];
                this.setState({notes: noteCopy});
            }).then(() => {
                return note;
            }).catch((err) => {
                console.log(err);
            });
        return note;
    }

    async updateCurrentTab(id: number) {
        let currentNoteId = await getCurrentTab(db);
        if (currentNoteId === undefined) throw new Error("Current tab is undefined");
        currentNoteId.removeCurrent();
        db.notes
            .update(currentNoteId.getId()!, {currentNoteId: 0})
            .then(() => {
                return db.notes.update(id, {currentNoteId: 1});
            }).then(() => {
                return db.notes.get(id);
            }).then((tab) => {
                if (tab === undefined) throw new Error("tab could not be found");
                this.setState({
                    currentNote: tab
                });
            });
    }

    removeTab(id: number) {
        db.notes
            .delete(id)
            .then(async () => {
                let noteCopy = [ ...this.state.notes];
                for (let i = 0; i < this.state.notes.length; i++) {
                    if (this.state.notes[i].getId() === id) {
                        noteCopy.splice(i, 1);
                        if (i === 0 && this.state.notes.length !== 1) {
                            this.updateCurrentTab(this.state.notes[i].getId()!);
                        } else if (i === 0) {
                            let tab = await this.addTab();
                            this.updateCurrentTab(tab.getId()!);
                        } else {
                            this.updateCurrentTab(this.state.notes[i-1].getId()!);
                        }
                        this.setState({
                            notes: noteCopy,
                        });
                        return;
                    }
                }
    
            })
    }

    render() {
        return (
            <div className="App">
              <Tabs note={this.state.notes} updateCurrentTab={this.updateCurrentTab} updateTabName={this.updateTabName} removeTab={this.removeTab}
                addTab={this.addTab}/>
              <Editor currentNote={this.state.currentNote}/>
            </div>
        )
    }
}

export default Main;
