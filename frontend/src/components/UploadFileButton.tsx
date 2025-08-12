import type { ChangeEvent } from "react";
import { IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface UploadFileProps {
    fileUpload: (file: File, course?: string) => void;
}

export default function UploadFileButton({ fileUpload }: UploadFileProps) {
    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            fileUpload(file);
            event.target.value = "";
        }
    };

    return (
        <IconButton component="label">
            <UploadFileIcon />
            <input type="file" hidden onChange={handleUpload} />
        </IconButton>
    );
}
