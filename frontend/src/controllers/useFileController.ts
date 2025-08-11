import { useState, useMemo, useCallback } from "react";
import type { FileMeta } from "../models/fileMeta";

export function useFileController() {
    const [files, setFiles] = useState<FileMeta[]>([]);
    const [fileObjectById, setFileObjectById] = useState<Record<string, File>>(
        {}
    );
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const addFile = useCallback((file: File, course?: string) => {
        // Only allow PDF files for the current build
        if (file.type !== "application/pdf") return;

        const id = crypto.randomUUID();
        // Create a new FileMeta object
        const newFileMeta: FileMeta = {
            id,
            name: file.name.replace(/\.pdf$/i, ""),
            course: course?.trim() || undefined,
            size: file.size,
            uploadDate: Date.now(),
            lastModified: file.lastModified,
        };
        setFiles((prevFiles) => [newFileMeta, ...prevFiles]);
        setFileObjectById((prev) => ({ ...prev, [id]: file }));
        setSelectedFileId(id);
    }, []);

    const renameFile = useCallback((id: string, newName: string) => {
        newName = newName.trim();
        if (!id || !newName) return;
        setFiles((prevFiles) =>
            prevFiles.map((file) =>
                file.id === id ? { ...file, name: newName } : file
            )
        );
    }, []);

    const removeFile = useCallback((id: string) => {
        if (!id) return;
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
        setFileObjectById((prev) => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
        setSelectedFileId((curr) => (curr === id ? null : curr));
    }, []);

    const select = useCallback((id: string) => {
        setSelectedFileId(id);
    }, []);

    const selectedFile = useMemo(
        () => (selectedFileId ? fileObjectById[selectedFileId] ?? null : null),
        [selectedFileId, fileObjectById]
    );

    return {
        addFile,
        renameFile,
        removeFile,
        select,
        files,
        selectedFile,
        selectedFileId,
    };
}
