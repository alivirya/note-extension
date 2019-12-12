import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';

type TabProps = {
    tabs: number;
}

class Tabs extends React.Component<{}, TabProps> {
    constructor(props: any) {
        super(props);
        this.state = {
            tabs: 1,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState(state => ({
            tabs: state.tabs + 1
        }));
    }

    componentDidMount() {
        // Get all parts of the progress bar.
        let tabs = $('.tab');
        console.log(tabs);
        // With each one, calculate the percentage and apply the width.
        tabs.each(function() {
            $(this).css('width', ((95 - (0.2 * (tabs.length+1)))/ tabs.length) + '%');
        });
    }

    componentDidUpdate() {
        console.log("test");
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
                <RenderTabs tabs={this.state.tabs}/><div id="add" onClick={this.onClick}>+</div>
            </div>
        )
    }
};

class RenderTabs extends React.Component<TabProps, {}> {
    constructor(props: TabProps) {
        super(props);
    }

    createTabs() {
        let tabArr = [];
        for (let i = 0; i < this.props.tabs; i++) {
            tabArr[i] = <Tab name="untitled"/>
        }

        return tabArr
    }

    render() {
        return this.createTabs();
    }

}

const Tab = (props: any) => {
    return (
        <div className="tab">
            {props.name}
        </div>
    )
}

Tab.propTypes = {
    name: PropTypes.string.isRequired
}

export default Tabs;
