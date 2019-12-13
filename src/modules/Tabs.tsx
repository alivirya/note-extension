import $ from 'jquery';
import { NoteInformation } from '../App';
import PropTypes from 'prop-types';
import React from 'react';

type MainTabProps = {
    notes: NoteInformation[];
    updateTabName?(name: string): void;
    updateCurrentTab?(tab: string) : void;
    addTab?(): void;
}

type TabState = {
    notes: NoteInformation[];
}

class Tabs extends React.Component<MainTabProps, TabState> {
    constructor(props: MainTabProps) {
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
    }

    componentDidUpdate() {
        // Get all parts of the progress bar.
        let tabs = $('.tab');
        console.log(tabs);
        // With each one, calculate the percentage and apply the width.
        tabs.each(function() {
            $(this).css('width', ((95 - (0.2 * (tabs.length+1)))/ tabs.length) + '%');
        });
    }

    render() {
        return (
            <div id="tabArea">
                <RenderTabs notes={this.props.notes}/><div id="add" onClick={this.onClick}>+</div>
            </div>
        )
    }
};

class RenderTabs extends React.Component<MainTabProps, {}> {
    constructor(props: MainTabProps) {
        super(props);
    }

    createTabs() {
        let tabArr = [];
        for (let i = 0; i < this.props.notes.length; i++) {
            tabArr[i] = <Tab name={this.props.notes[i].tabName}/>
        }

        return tabArr
    }

    render() {
        return this.createTabs();
    }

}


//Have to add handlechange
const Tab = (props: any) => {
    return (
        <div className="tab" contentEditable="true">
            {props.name}
        </div>
    )
}

Tab.propTypes = {
    name: PropTypes.string.isRequired
}

export default Tabs;
