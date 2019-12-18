import $ from 'jquery';
import { Note } from '../objects/Note';
import React from 'react';
import Sortable from 'sortablejs';
import { compareValues } from '../utilities/Util';

interface StandardTabProps {
    updateTabName(id: number, tabName: string): void;
    updateCurrentTab(id: number): void;
    removeTab(id: number): void;
}

interface TabsProps extends RenderTabProps {
    addTab(): void;
}

interface RenderTabProps extends StandardTabProps {
    note: Note[];
}

interface TabProps extends StandardTabProps {
    note: Note;
}

type TabState = {
    note: Note[];
}

class Tabs extends React.Component<TabsProps, TabState> {
    constructor(props: TabsProps) {
        super(props);
        this.state = {
            note: props.note,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.addTab!();
    }

    componentDidMount() {
        this.updateTabWidth();
        let tabArea = document.getElementById("tabArea")!;
        Sortable.create(tabArea);
    }

    componentDidUpdate() {
        this.updateTabWidth();
    }

    updateTabWidth() {
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
                <RenderTabs note={this.props.note} updateTabName={this.props.updateTabName} removeTab={this.props.removeTab}
                    updateCurrentTab={this.props.updateCurrentTab}/>
                <div id="add" onClick={this.onClick}>+
                </div>
            </div>
        )
    }
};

class RenderTabs extends React.Component<RenderTabProps, {}> {
    createTabs() {
        let tabArr = [];
        this.props.note.sort(compareValues());
        for (let i = 0; i < this.props.note.length; i++) {
            tabArr[i] = <Tab note={this.props.note[i]} updateCurrentTab={this.props.updateCurrentTab} removeTab={this.props.removeTab}
                updateTabName={this.props.updateTabName}/>
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
            let docName = document.getElementById(this.props.note.getId()! + "Name")!
            // TODO: This needs to be extended so that the name is also updated on the event of pressing something outside of the text area
            if (docName !== null) {
                docName.addEventListener("keydown", (e) => {
                    if (e.keyCode === 13 ) {
                        e.preventDefault();
                        this.props.updateTabName(this.props.note.getId()!, docName.textContent ? docName.textContent : this.props.note.getTabName());
                    }
                })
            }
        } catch(err) {
            console.log(err);
        }
    }


    async onTabClick() {
        await this.props.updateCurrentTab(this.props.note.getId()!);
    }
    
    async onCloseClick() {
        await this.props.removeTab(this.props.note.getId()!);
    }

    // TODO: Change this so that the id is a number maybe instead..? Need to format with addTab and removeTab as well
    //Make this textbox that is editable smaller and not the entire tab
    render() {
        return (
            <div className="tab" id={`${this.props.note.getId()!}`}>
                <div className="filler" onClick={this.onTabClick}>emptyemptyemptyempty</div>
                <div className="tabContent" id={this.props.note.getId()+"Name"} onClick={this.onTabClick} contentEditable="true">
                    {this.props.note.getTabName()}
                </div>
                <div className="filler" onClick={this.onTabClick}>emptyemptyemptyemptyempty</div>
                <div className="close" onClick={this.onCloseClick}>x</div>
            </div>
        )
    }
}

export default Tabs;
