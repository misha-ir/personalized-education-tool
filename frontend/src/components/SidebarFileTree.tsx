
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import type { FileMeta } from "../models/fileMeta";
import { sortByCourse } from "../utils/sortByCourse";
import { useMemo } from "react";

// Props for the file tree component
interface SidebarFileTreeProps {
    files: FileMeta[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

// Sidebar file tree component
export default function SidebarFileTree({
    files,
    onSelect,
    selectedId,
}: SidebarFileTreeProps) {
    // Group files by course. only updated when needed.
    const groupedFiles = useMemo(() => sortByCourse(files), [files]);

    // Handle item selection changes in tree.
    const handleSelectedItemChange = (_event: React.SyntheticEvent | null, id: string | null) => {
        if (!id || !id.startsWith("course:")) return;
        onSelect(id);
    };

    return (
        // Render the file tree
        <SimpleTreeView
            selectedItems={selectedId ?? null}
            onSelectedItemsChange={handleSelectedItemChange}
        >
            {groupedFiles.map(([course, list]) => (
                <TreeItem
                    key={course}
                    itemId={`course:${course}`}
                    label={course}
                >
                    {list.map((file) => (
                        <TreeItem
                            key={file.id}
                            itemId={file.id}
                            label={file.name}
                        />
                    ))}
                </TreeItem>
            ))}
        </SimpleTreeView>
    );
}
