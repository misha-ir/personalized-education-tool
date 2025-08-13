// DocumentViewer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { Document, Page } from "react-pdf";

interface DocumentViewerProps {
    file: File | null;
}

export default function DocumentViewer({ file }: DocumentViewerProps) {
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(1);
    const [containerWidth, setContainerWidth] = useState<number>(600);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Object URL for the File
    const fileUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file]
    );
    useEffect(
        () => () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        },
        [fileUrl]
    );

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const setW = () => {
            const w = el.clientWidth;
            setContainerWidth(
                Math.max(320, Math.min(1400, Math.floor(w - 32)))
            );
        };
        setW();

        const ro = new ResizeObserver(setW);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    if (!file) {
        return (
            <Box className="flex h-full items-center justify-center text-gray-500">
                Select a PDF file to view
            </Box>
        );
    }

    return (
        <Box className="flex h-full flex-col overflow-hidden">
            <Box className="flex items-center justify-between border-b bg-gray-100 p-2 text-sm">
                <Box>
                    Page {page} of {numPages || "…"}
                </Box>
                <Box className="flex gap-2">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                            setPage((p) => Math.min(numPages, p + 1))
                        }
                        disabled={!numPages || page >= numPages}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
            <Box
                ref={containerRef}
                className="pdf-canvas-center flex-1 min-h-0 overflow-auto"
            >
                <Box className="w-full flex justify-center p-4">
                    <Document
                        file={fileUrl!}
                        onLoadSuccess={({ numPages }) => {
                            setNumPages(numPages);
                            setPage(1);
                        }}
                        onLoadError={(err) =>
                            console.error("PDF load error:", err)
                        }
                        loading={
                            <Box className="p-4 text-gray-500">
                                Loading PDF…
                            </Box>
                        }
                        error={
                            <Box className="p-4 text-red-600">
                                Failed to load PDF.
                            </Box>
                        }
                        noData={
                            <Box className="p-4 text-gray-500">No file.</Box>
                        }
                    >
                        <Box className="p-1  bg-[#C0C0D8] shadow">
                            <Page pageNumber={page} width={containerWidth} />
                        </Box>
                    </Document>
                </Box>
            </Box>
        </Box>
    );
}
