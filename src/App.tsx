import "./App.css";
import "typeface-roboto-mono"

import Editor from './modules/Editor'
import React from 'react';
import Tabs from './modules/Tabs';

export interface NoteInformation {
    tabName: string;
    editorData: string;
}

type AppState = {
    notes: NoteInformation[];
    currentTab: string;
}

const notes: NoteInformation[] = [];

for ( var i = 0; i < localStorage.length; i++ ) {
    notes[i] = {
        tabName: localStorage.key(i)!,
        editorData: localStorage.getItem(localStorage.key(i)!)!, 
    }
}
/* Things to take note of:
    Current tab...
    Name of tab
    THERE MUST BE A BETTER WAY TO DO THIS.
*/
class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            notes: notes,
            currentTab: notes[0].tabName
        };
        this.updateTabName = this.updateTabName.bind(this);
        this.updateCurrentTab = this.updateCurrentTab.bind(this);
        this.addTab = this.addTab.bind(this);
    }

    //NOTE: Is there a way to just update one of the notes?? as opposed to the entire array
    updateTabName(oldName: string, newName: string) {
        this.setState((state) => {
            let noteCopy = state.notes;
            for (let i = 0; i < state.notes.length; i++) {
                if (state.notes[i].tabName == oldName) {
                    localStorage.removeItem(oldName);
                    noteCopy[i].tabName = newName;
                    localStorage.setItem(newName, noteCopy[i].editorData);
                    return {
                        notes: noteCopy,
                        currentTab: state.currentTab
                    };
                }
            }    
        });
    }

    addTab() {
        this.setState((state) => {
            let noteCopy = state.notes;
            noteCopy.push({
                tabName: "untitled",
                editorData: ""
            });
            
            return {
                notes: noteCopy,
                currentTab: state.currentTab,
            };
        });
    }

    updateCurrentTab(tab: string) {
        this.setState((state) => {
            return {
                notes: state.notes,
                currentTab: tab
            }
        });
    }

    render() {
        return (
            <div className="App">
              <Tabs notes={this.state.notes} updateCurrentTab={this.updateCurrentTab} updateTabName={this.updateTabName} addTab={this.addTab} currentTab={this.state.currentTab}/>
              <Editor currentTab={this.state.currentTab}/>
            </div>
        )
    }
}

export default App;
