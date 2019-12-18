import "./static/App.css";

import Main from "./modules/Main"
import { Note } from './objects/Note';
import { NoteTakerDatabase } from './objects/Database';
import React from 'react';

const db = new NoteTakerDatabase();
db.notes.mapToClass(Note);

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Main db={db}/>
            </div>
        )
    }
}

export default App;
