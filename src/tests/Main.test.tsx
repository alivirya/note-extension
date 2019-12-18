import App from "../modules/Main";
import { Note } from "../objects/Note";
import { NoteTakerDatabase } from "../objects/Database";
import React from "react";
import ReactDOM from "react-dom";

const indexedDB = require("fake-indexeddb");
const IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

const db = new NoteTakerDatabase({indexedDB: indexedDB, IDBKeyRange: IDBKeyRange});
db.notes.mapToClass(Note);

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App db={db}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

