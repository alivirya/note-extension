import $ from 'jquery';
import { NoteInformation } from '../App';
import React from 'react';
import Sortable from 'sortablejs';

// Have to change colors to adjust for colours of themes

interface TabsProps extends TabProps {
    notes: NoteInformation[];
    addTab?(): void;
}

interface TabProps {
    currentTab?: string;
    tabName?: string;
    updateTabName?(oldName: string, newName: string): void;
    updateCurrentTab?(tab: string): void;
    removeTab?(tab: string): void;
}

type TabState = {
    notes: NoteInformation[];
}

class Tabs extends React.Component<TabsProps, TabState> {
    constructor(props: TabsProps) {
        super(props);
        this.state = {
            notes: props.notes,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.addTab!();
    }

    componentDidMount() {
        // Get all parts of the progress bar.
        let tabs = $('.tab');
        // With each one, calculate the percentage and apply the width.
        tabs.each(function() {
            $(this).css('width', ((95 - (0.2 * (tabs.length+1)))/ tabs.length) + '%');
        });

        let tabArea = document.getElementById("tabArea")!;
        Sortable.create(tabArea);
    }

    componentDidUpdate() {
        // Get all parts of the progress bar.
        let tabs = $('.tab');
        // With each one, calculate the percentage and apply the width.
        tabs.each(function() {
            $(this).css('width', ((95 - (0.2 * (tabs.length+1)))/ tabs.length) + '%');
        });
    }

    render() {
        return (
            <div id="tabArea">
                <RenderTabs notes={this.props.notes} updateTabName={this.props.updateTabName} removeTab={this.props.removeTab}
                    updateCurrentTab={this.props.updateCurrentTab} currentTab={this.props.currentTab}/>
                <div id="add" onClick={this.onClick}>+
                </div>
            </div>
        )
    }
};

class RenderTabs extends React.Component<TabsProps, {}> {
    createTabs() {
        let tabArr = [];
        for (let i = 0; i < this.props.notes.length; i++) {
            tabArr[i] = <Tab tabName={this.props.notes[i].tabName} updateCurrentTab={this.props.updateCurrentTab} removeTab={this.props.removeTab}
                updateTabName={this.props.updateTabName} currentTab={this.props.currentTab} />
        }

        return tabArr
    }

    render() {
        return this.createTabs();
    }

}

//Need to make sure that names are unique

class Tab extends React.Component<TabProps, {}> {
    constructor(props: TabProps) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    componentDidMount() {
        try {
            let doc = document.getElementById(this.props.tabName!)!
            if (this.props.tabName! === this.props.currentTab) doc.style.backgroundColor = "#272822";
            else doc.style.backgroundColor = "#3c3d37";
            let docName = document.getElementById(this.props.tabName! + "Name")!
            // TODO: This needs to be extended so that the name is also updated on the event of pressing something outside of the text area
            docName.addEventListener("keydown", (e) => {
                if (e.keyCode === 13 ) {
                    e.preventDefault();
                    this.props.updateTabName!(this.props.tabName!, docName.textContent ? docName.textContent : "");
                }
            })
        } catch(err) {
            console.log(err);
        }
    }

    componentDidUpdate() {
        try {
            let doc = document.getElementById(this.props.tabName!)!
            if (this.props.tabName! === this.props.currentTab) doc.style.backgroundColor = "#272822";
            else doc.style.backgroundColor = "#3c3d37";
        } catch(err) {
            console.log(err);
        }

    }

    onTabClick() {
        this.props.updateCurrentTab!(this.props.tabName!);
    }
    
    onCloseClick() {
        this.props.removeTab!(this.props.tabName!);
    }

    //Make this textbox that is editable smaller and not the entire tab
    render() {
        return (
            <div className="tab" id={this.props.tabName} onClick={this.onTabClick}>
                <div className="filler"></div>
                <div className="tabContent" id={this.props.tabName+"Name"} contentEditable="true">
                    {this.props.tabName}
                </div>
                <div className="filler"></div>
                <div className="close" onClick={this.onCloseClick}>x</div>
            </div>
        )
    }
}

export default Tabs;
