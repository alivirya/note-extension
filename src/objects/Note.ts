export class Note {
    tabName: string;
    editorData: string;
    noteId: number;
    currentTab: number;
    
    constructor(tabName?: string, editorData?: string, id?: number) {
        this.tabName = tabName ? tabName : "untitled";
        this.editorData = editorData ? editorData : "";
        this.currentTab = 0;
        if (id) this.noteId = id;
        else this.noteId = 0;
    }

    setId(id: number) {
        this.noteId = id;
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
        if (this.noteId === 0) throw new Error("Id for note has not been set by database");
        return this.noteId;
    }

    removeCurrent() {
        this.currentTab = 0;
    }
}
