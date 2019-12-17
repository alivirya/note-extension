import Dexie from 'dexie';
import { Note } from './Note';

export interface INote {
    tabName: string;
    editorData: string;
    currentTab: number;
}

export class NoteTakerDatabase extends Dexie {
    notes: Dexie.Table<Note, number>;

    constructor(options?: {
        addons?: Array<(db: Dexie) => void>,
        autoOpen?: boolean,
        indexedDB?: IDBFactory,
        IDBKeyRange?: {new(): IDBKeyRange}
    }) {
        super("NoteTakerDatabase", options);
        this.version(1).stores({
            notes: 'id++, tabName, editorData, currentTab',
        });
        this.notes = this.table('notes');
    }
}
