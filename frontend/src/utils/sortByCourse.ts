// Note: update later to more sophisticated sorting (inserting single file to
// structure rather than sorting the entire file array) when backend is added.
import type { FileMeta } from "../models/fileMeta";

export function sortByCourse(files: FileMeta[]): Array<[string, FileMeta[]]> {
    const sets = new Map<string, FileMeta[]>();

    files.forEach((file) => {
        const course = file.course?.trim() || "Uncategorized";

        if (!sets.has(course)) {
            sets.set(course, []);
        }

        sets.get(course)!.push(file);
    });

    // Have each course grouping be sorted
    for (const [, courseFiles] of sets) {
        courseFiles.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Take out uncategorized file group as we want to force it at end of list.
    const uncategorizedSet = sets.get("Uncategorized");
    sets.delete("Uncategorized");

    // Sort the sets of courses in the array
    const sortedSets = Array.from(sets.entries()).sort(([a], [b]) =>
        a.localeCompare(b)
    );

    if (uncategorizedSet) {
        sortedSets.push(["Uncategorized", uncategorizedSet]);
    }

    return sortedSets;
}
