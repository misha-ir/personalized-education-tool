import { useState, useCallback, useEffect } from "react";
import type { FileMeta } from "../models/fileMeta";
import { FileService, type BackendFileResponse } from "../services/fileService";

export function useFileController() {
    const [files, setFiles] = useState<FileMeta[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Convert backend response to FileMeta format
    const convertBackendFileToFileMeta = useCallback(
        (backendFile: BackendFileResponse): FileMeta => {
            return {
                id: backendFile.id,
                name: backendFile.name,
                size: backendFile.size,
                createdAt: backendFile.createdAt,
                url: backendFile.url,
                course: backendFile.course,
            };
        },
        []
    );

    // Load all files from backend
    const loadFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const backendFiles = await FileService.getAllFiles();
            const fileMetas = backendFiles.map(convertBackendFileToFileMeta);
            setFiles(fileMetas);
        } catch (err) {
            console.error("Failed to load files:", err);
            setError("Failed to load files from server");
        } finally {
            setIsLoading(false);
        }
    }, [convertBackendFileToFileMeta]);

    // Load files on component mount
    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const addFile = useCallback(
        async (file: File, course?: string) => {
            // Only allow PDF files for the current build
            if (file.type !== "application/pdf") {
                setError("Only PDF files are allowed");
                return;
            }

            setIsUploading(true);
            setError(null);

            try {
                const finalCourse = course?.trim() || "Uncategorized";
                const backendFile = await FileService.uploadFile(
                    file,
                    finalCourse
                );
                const newFileMeta = convertBackendFileToFileMeta(backendFile);

                // Add new file to list
                setFiles((prevFiles) => [newFileMeta, ...prevFiles]);

                // Auto-select the newly uploaded file
                setSelectedFileId(newFileMeta.id);
            } catch (err) {
                console.error("Failed to upload file:", err);
                setError("Failed to upload file to server");
            } finally {
                setIsUploading(false);
            }
        },
        [convertBackendFileToFileMeta]
    );

    const renameFile = useCallback((id: string, newName: string) => {
        newName = newName.trim();

        if (!id || !newName) return;

        // Update local state immediately (optimistic update)
        // TODO: Implement backend API for renaming files
        setFiles((prevFiles) =>
            prevFiles.map((file) =>
                file.id === id ? { ...file, name: newName } : file
            )
        );
    }, []);

    const removeFile = useCallback(async (id: string) => {
        if (!id) return;

        setError(null);

        try {
            await FileService.deleteFile(id);

            // Remove from local state
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));

            // Clear selection if deleted file was selected
            setSelectedFileId((curr) => (curr === id ? null : curr));
        } catch (err) {
            console.error("Failed to delete file:", err);
            setError("Failed to delete file from server");
        }
    }, []);

    const select = useCallback((id: string) => {
        setSelectedFileId(id);
    }, []);

    // Get current file URL for viewing
    const currentFileUrl = selectedFileId
        ? FileService.getFileContentUrl(selectedFileId)
        : null;

    // Clear error message
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        addFile,
        renameFile,
        removeFile,
        select,
        loadFiles,
        clearError,
        files,
        selectedFileId,
        currentFileUrl,
        isLoading,
        isUploading,
        error,
    };
}
