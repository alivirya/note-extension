import "typeface-roboto-mono"

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

type MainProps = {
    db: NoteTakerDatabase;
}
const firstNote = new Note();

/*
    THERE MUST BE A BETTER WAY TO DO THIS.
*/
class Main extends React.Component<MainProps, MainState> {
    private db: NoteTakerDatabase;
    private created: boolean;
    private deleted: boolean;
    constructor(props: MainProps) {
        super(props);
        this.state = {
            notes: [],
            currentNote: firstNote,
        }
        this.db = props.db;
        this.updateTabName = this.updateTabName.bind(this);
        this.updateCurrentNote = this.updateCurrentNote.bind(this);
        this.addTab = this.addTab.bind(this);
        this.removeTab = this.removeTab.bind(this);
        this.created = true;
        this.deleted = true;
    }

    componentDidMount() {
        retrieveAllNotes(this.db).then(async (notes) => {
            let currentNote: Note;
            if (notes.length === 0) {
                firstNote.setCurrent();
                let current = await this.addTab(firstNote);
                currentNote = current;
                notes.push(currentNote);
            } else {
                currentNote = await getCurrentTab(this.db) as Note;
            }
            
            this.setState({
                notes,
                currentNote
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidUpdate() {
        this.keyboardShortcuts();
    }

    //NOTE: Is there a way to just update one of the note?? as opposed to the entire array
    async updateTabName(id: number, tabName: string) {
        this.db.notes
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

    async addTab(newNote?: Note) {
        let note: Note;
        if (newNote) {
            note = newNote;
        } else {
            note = new Note();
        }

        await this.db.notes
            .add(note)
            .then((id) => {
                note.setId(id);
                const noteCopy = [...this.state.notes, note];
                this.setState({notes: noteCopy});
            }).catch((err) => {
                console.log(err);
            });
        console.log(`Added new tab with id ${note.getId()}`)
        return note;
    }

    async updateCurrentNote(id: number) {
        console.log(`Updating the current tab to ${id}`);
        let currentNote = await getCurrentTab(this.db);
        if (currentNote === undefined) currentNote = this.state.currentNote; 

        currentNote.removeCurrent();
        return this.db.notes
            .update(currentNote.getId()!, {currentTab: 0})
            .then(() => {
                return this.db.notes.update(id, {currentTab: 1});
            }).then(() => {
                return this.db.notes.get(id);
            }).then((tab) => {
                if (tab === undefined) throw new Error("tab could not be found");
                tab.setId((tab as any).id);
                tab.setCurrent();
                const noteCopy = [...this.state.notes.filter((note) => note.getId() !== id),
                    tab
                ]
                this.setState({
                    currentNote: tab,
                    notes: noteCopy
                });
                return tab;
            }).catch((err) => {
                console.log(err);
            });
    }

    removeTab(id: number) {
        console.log(`Deleting tab with id ${id}`);
        this.db.notes
            .delete(id)
            .then(async () => {
                let noteCopy = [ ...this.state.notes];
                for (let i = 0; i < this.state.notes.length; i++) {
                    if (this.state.notes[i].getId() === id) {
                        noteCopy.splice(i, 1);
                        let tabToUpdate : number;
                        if (i === 0 && this.state.notes.length !== 1) {
                            tabToUpdate = noteCopy[i].getId()!
                        } else if (i === 0) {
                            let tab = await this.addTab();
                            noteCopy.push(tab);
                            tabToUpdate = tab.getId()!;
                        } else {
                            tabToUpdate = this.state.notes[i-1].getId()!
                        }
                        await this.updateCurrentNote(tabToUpdate).then(async (tab) => {
                            if (tab === undefined) throw new Error("unable to update tab while removing");
                            await this.setState({
                                notes: noteCopy,
                                currentNote: tab
                            });
                        })
                    }
                }
    
            })
    }

    keyboardShortcuts() {
        let page = document.getElementById("app");
        page?.addEventListener("keydown", async (e) => {
            if (e.keyCode === 84 && e.ctrlKey && this.created === true) {
                this.created = false;
                await this.addTab();
                this.created = true;
            }
        });
        page?.addEventListener("keydown", async (e) => {
            if (e.keyCode === 87 && e.ctrlKey && this.deleted === true) {
                this.deleted = false;
                await this.removeTab(this.state.currentNote.getId());
                this.deleted = true;
            }
        });
    }

    render() {
        return (
            <div className="App" id="app">
              <Tabs notes={this.state.notes} updateCurrentNote={this.updateCurrentNote} updateTabName={this.updateTabName} removeTab={this.removeTab}
                addTab={this.addTab}/>
              <Editor currentNote={this.state.currentNote} db={this.db}/>
            </div>
        )
    }
}

export default Main;
