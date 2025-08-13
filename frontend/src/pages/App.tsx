import Box from "@mui/material/Box";
import { useFileController } from "../controllers/useFileController";
import Sidebar from "../components/SideBar";
import DocumentViewer from "../components/DocumentViewer";

function App() {
    const { files, currentFile, selectedFileId, select, addFile } =
        useFileController();

    return (
        <Box className="h-[100dvh] w-full flex flex-col overflow-hidden bg-surface">
            <Box component="header" className="shrink-0 border-b bg-surface">
                <Box className="text-center font-bold py-4">
                    Personalized Education Tool
                </Box>
            </Box>
            <Box component="main" className="flex-1 min-h-0">
                <Box className="min-w-[1280px] h-full grid grid-cols-[300px_1fr]">
                    <Sidebar
                        className="min-h-[100dvh] w-[300px] bg-gray-50"
                        files={files}
                        onSelect={select}
                        selectedId={selectedFileId}
                        fileUpload={addFile}
                    />
                    <Box className="min-h-0 h-full overflow-auto rounded border border-gray-200 bg-[#EDEDF4]">
                        <DocumentViewer file={currentFile} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default App;
