import "typeface-roboto-mono"
import "../static/App.css";

import Editor from './Editor'
import React from 'react';
import Tabs from './Tabs';

export interface NoteInformation {
    tabName: string;
    editorData: string;
}

type MainState = {
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

// TODO: A default way of dealing with new files...
if (notes.length === 0) {
    notes[0] = {
        tabName: "untitled",
        editorData: ""
    }
}

/*
    THERE MUST BE A BETTER WAY TO DO THIS.
*/
class Main extends React.Component<{}, MainState> {
    constructor(props: any) {
        super(props);
        this.state = {
            notes: notes,
            currentTab: notes[0].tabName
        };
        this.updateTabName = this.updateTabName.bind(this);
        this.updateCurrentTab = this.updateCurrentTab.bind(this);
        this.addTab = this.addTab.bind(this);
        this.removeTab = this.removeTab.bind(this);
    }

    //NOTE: Is there a way to just update one of the notes?? as opposed to the entire array
    updateTabName(oldName: string, newName: string) {
        this.setState((state) => {
            let noteCopy = state.notes;
            for (let i = 0; i < state.notes.length; i++) {
                if (state.notes[i].tabName === oldName) {
                    localStorage.removeItem(oldName);
                    noteCopy[i].tabName = newName;
                    localStorage.setItem(newName, noteCopy[i].editorData);
                    this.updateCurrentTab(newName);
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
            let newTab = "untitled";
            let newTabContent = "";
            noteCopy.push({
                tabName: newTab,
                editorData: newTabContent
            });

            localStorage.setItem(newTab, newTabContent);
        
            return {
                notes: noteCopy,
                currentTab: state.currentTab,
            };
        });
    }

    updateCurrentTab(tab: string) {
        this.setState({
            currentTab: tab
        });
    }

    removeTab(tab: string) {
        this.setState((state) => {
            let noteCopy = state.notes;
            for (let i = 0; i < state.notes.length; i++) {
                if (state.notes[i].tabName === tab) {
                    noteCopy.splice(i, 1);
                    localStorage.removeItem(tab);

                    // TODO: Need to fix this for when the length is 0
                    if (i === 0 && state.notes.length !== 1) {
                        this.updateCurrentTab(state.notes[i].tabName);
                    } else if (i === 0) {
                        this.addTab();
                        this.updateCurrentTab(state.notes[i].tabName);
                    } else {
                        this.updateCurrentTab(state.notes[i-1].tabName);
                    }
                    return {
                        notes: noteCopy,
                        currentTab: state.currentTab,
                    }
                }
            }
        })
    }

    render() {
        return (
            <div className="App">
              <Tabs notes={this.state.notes} updateCurrentTab={this.updateCurrentTab} updateTabName={this.updateTabName} removeTab={this.removeTab}
                addTab={this.addTab} currentTab={this.state.currentTab}/>
              <Editor currentTab={this.state.currentTab}/>
            </div>
        )
    }
}

export default Main;
