import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FileMeta } from "../models/fileMeta";
import { sortByCourse } from "../utils/sortByCourse";
import { useMemo, useCallback } from "react";

// Props for the file tree component
interface SidebarFileTreeProps {
    files: FileMeta[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onRemove?: (id: string) => void;
}

// Sidebar file tree component
export default function SidebarFileTree({
    files,
    onSelect,
    selectedId,
    onRemove,
}: SidebarFileTreeProps) {
    // Group files by course. only updated when needed.
    const groupedFiles = useMemo(() => sortByCourse(files), [files]);

    // Handle item selection changes in tree.
    const handleSelectedItemChange = useCallback(
        (_event: React.SyntheticEvent | null, id: string | null) => {
            if (id && !id.startsWith("course:")) {
                onSelect(id);
            }
        },
        [onSelect]
    );

    // Handle file deletion
    const handleDelete = useCallback(
        (fileId: string, event: React.MouseEvent) => {
            event.stopPropagation(); // Prevent tree item selection
            if (onRemove) {
                onRemove(fileId);
            }
        },
        [onRemove]
    );

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
                            label={
                                <div className="group flex items-center justify-between w-full">
                                    <span className="truncate">
                                        {file.name}
                                    </span>
                                    {onRemove && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) =>
                                                handleDelete(file.id, e)
                                            }
                                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete file"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </div>
                            }
                        />
                    ))}
                </TreeItem>
            ))}
        </SimpleTreeView>
    );
}
