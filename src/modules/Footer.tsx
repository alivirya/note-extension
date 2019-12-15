import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css"
import "codemirror/theme/abcdef.css"
import "codemirror/theme/ambiance.css"
import "codemirror/theme/base16-dark.css"
import "codemirror/theme/base16-light.css"
import "codemirror/theme/bespin.css"
import "codemirror/theme/blackboard.css"
import "codemirror/theme/cobalt.css"
import "codemirror/theme/colorforth.css"
import "codemirror/theme/darcula.css"
import "codemirror/theme/dracula.css"
import "codemirror/theme/erlang-dark.css"
import "codemirror/theme/gruvbox-dark.css"
import "codemirror/theme/hopscotch.css"
import "codemirror/theme/icecoder.css"
import "codemirror/theme/idea.css"
import "codemirror/theme/isotope.css"
import "codemirror/theme/lesser-dark.css"
import "codemirror/theme/liquibyte.css"
import "codemirror/theme/lucario.css"
import "codemirror/theme/material-darker.css"
import "codemirror/theme/material-ocean.css"
import "codemirror/theme/material-palenight.css"
import "codemirror/theme/material.css"
import "codemirror/theme/mbo.css"

import React from "react";

type FooterProps = {
    updateTheme(theme: string): void;
}

type SelectionProps = {
    updateTheme(): void;
}

class Footer extends React.Component<FooterProps, {}> {
    constructor(props: FooterProps) {
        super(props);
        this.updateTheme = this.updateTheme.bind(this);
    }

    updateTheme() {
        try {
            let selection = document.getElementById("themeSelection") as HTMLInputElement;
            if (selection !== null) {
                let theme = selection.value;
                this.props.updateTheme(theme);
            } else {
                // Need to create an alert for when this happens? 
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div id="footer">
                <Selection updateTheme={this.updateTheme}/>
            </div>
        )
        
    }
}

class Selection extends React.Component<SelectionProps, {}> {
    private themeArray: string[];
    constructor(props: SelectionProps) {
        super(props);
        this.themeArray = ["phoebe", "3024-day", "3024-night", "abcdef", "ambiance", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt",
            "colorforth", "darcula", "dracula", "erlang-dark", "gruvbox-dark", "hopscotch", "icecoder", "idea", "isotope",
            "lesser-dark", "liquibyte", "lucario", "material-darker", "material-ocean", "material-palenight", "material", "mbo.css"];
    }

    createOptions() {
        let optionsArr = [];
        for (let i = 0; i < this.themeArray.length; i++) {
            optionsArr[i] = <option value={this.themeArray[i]}>{this.themeArray[i]}</option>
        }
        return optionsArr;
    }

    render() {
        return (
            <div>
                 <select id="themeSelection" onChange={this.props.updateTheme}>
                    {this.createOptions()}
                </select> 
            </div>
        )
    }
}

export default Footer;
