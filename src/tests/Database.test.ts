import { getCurrentTab, retrieveAllNotes } from '../utilities/Database';

import { Note } from "../objects/Note";
import { NoteTakerDatabase } from './../objects/Database';

const indexedDB = require("fake-indexeddb");
const IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

const db = new NoteTakerDatabase({indexedDB: indexedDB, IDBKeyRange: IDBKeyRange});
db.notes.mapToClass(Note);
const notes = [new Note("test1", "", 1), new Note("test2", "", 2), new Note("test3", "", 3)];

beforeAll(async () => {
    notes[1].setCurrent();
    db.notes.bulkAdd(notes);

});

it("Returns the correct current tab", async () => {
    const currentTab = await getCurrentTab(db);
    expect(currentTab).toMatchObject(notes[1]);
});

it("Returns all the items in the database", async () => {
    const allDB = await retrieveAllNotes(db);
    expect(allDB).toMatchObject(notes);
});
