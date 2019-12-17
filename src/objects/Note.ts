import { INote } from '../utilities/Database';

export class Note implements INote {
    tabName: string;
    editorData: string;
    currentTab: number;
    id?: number;
    
    constructor(tabName?: string, editorData?: string, id?: number) {
        this.tabName = tabName ? tabName : "untitled";
        this.editorData = editorData ? editorData : "";
        this.currentTab = 0;
        if (id) this.id = id;
    }

    setId(id: number) {
        this.id = id;
    }

    setTabName(tabName: string) {
        this.tabName = tabName;
    }

    setEditorData(editorData: string) {
        this.editorData = editorData;
    }

    setCurrent() {
        this.currentTab = 1;
    }

    getTabName() {
        return this.tabName;
    }

    getEditorData() {
        return this.editorData;
    }

    getId() {
        return this.id;
    }

    removeCurrent() {
        this.currentTab = 0;
    }
}
