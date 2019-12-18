import { Note } from '../objects/Note';

export function compareValues() {
    return function innerSort(a: Note, b: Note) {
        if (a.getId()! > b.getId()!) {
            return 1;
        };
        return -1;
    }
}
