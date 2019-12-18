import { NoteTakerDatabase } from './../objects/Database';

export function retrieveAllNotes(db: NoteTakerDatabase) {
    return db.notes.toArray().then((notes) => {
        notes.forEach((note: any) => note.setId(note.id));
        return notes;
    });
    
}

export function getCurrentTab(db: NoteTakerDatabase) {
    return db.notes.where("currentTab").equals(1).first(note => {
        if (note === undefined) return undefined;
        note.setId((note as any).id);
        return note
    }).catch((err) => {
        throw new Error(err);
    });
}
//update databse and then update current tab through database?!
