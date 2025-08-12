import { useState, useMemo } from "react";
import type { FileMeta } from "../models/fileMeta";
import UploadFileButton from "./UploadFileButton";
import SidebarFileTree from "./SidebarFileTree";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface SidebarProps {
    files: FileMeta[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    fileUpload: (file: File, course?: string) => void;
    className?: string;
}

export default function Sidebar({
    files,
    onSelect,
    selectedId,
    fileUpload,
    className = "",
}: SidebarProps) {
    // State for course input option
    const [courseInput, setCourseInput] = useState("");

    const courseOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    files
                        .map((f) => f.course?.trim())
                        .filter((s): s is string => !!s && s.length > 0)
                )
            ).sort((a, b) => a.localeCompare(b)),
        [files]
    );

    return (
        <Stack
            className={`flex flex-col border-r border-gray-800 ${className}`}
        >
            <Box className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white p-2">
                <Autocomplete
                    freeSolo
                    options={courseOptions}
                    inputValue={courseInput}
                    onInputChange={(_, val) => setCourseInput(val)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Course Name"
                            placeholder="e.g. CS 3744"
                        />
                    )}
                    className="flex-1"
                />
                <UploadFileButton
                    fileUpload={(file) => {
                        fileUpload(file, courseInput || undefined);
                        setCourseInput("");
                    }}
                />
                <span className="text-xs text-gray-500">
                    {files.length} file{files.length === 1 ? "" : "s"}
                </span>
            </Box>
            <Box className="min-h-0 flex-1 overflow-y-auto p-2">
                <SidebarFileTree
                    files={files}
                    onSelect={onSelect}
                    selectedId={selectedId}
                />
            </Box>
        </Stack>
    );
}
