import { Note } from '../objects/Note';
import { NoteTakerDatabase } from './../objects/Database';

export interface INote {
    tabName: string;
    editorData: string;
    currentTab: number;
}

export async function removeNote(db: NoteTakerDatabase, note: Note) {
    return db.notes.where("currentTab").equals(note.currentTab).delete();
}

export function retrieveAllNotes(db: NoteTakerDatabase) {
    return db.notes.toArray();
}

export function getCurrentTab(db: NoteTakerDatabase) {
    return db.notes.where("currentTab").equals(1).first(note => {
        return note
    }).catch((err) => {
        throw new Error(err);
    });
}

export async function updateCurrentTab(db: NoteTakerDatabase, note: Note) {
    await getCurrentTab(db).then(async (tab: Note | undefined) => {
        if (tab === undefined) throw new Error("No current tab");
        return tab.removeCurrent();
    }).then(() => {
        return note.setCurrent();
    }).catch((err) => {
        throw new Error(`Error getting current tab ${err}`);
    });
}
//update databse and then update current tab through database?!
