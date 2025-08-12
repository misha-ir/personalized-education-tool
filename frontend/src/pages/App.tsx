import Box from "@mui/material/Box";
import { useFileController } from "../controllers/useFileController";
import Sidebar from "../components/SideBar";

function App() {
    const { files, selectedFileId, select, addFile } = useFileController();

    return (
        <Box className="min-h-[100dvh] w-full flex flex-col bg-gray-50">
            <Box component="header" className="border-b bg-white">
                <Box className="mx-auto max-w-7xl text-center px-4 py-2">
                    Personalized Education Tool
                </Box>
            </Box>
            <Box component="main" className="flex-1 min-h-0">
                <Box className="mx-auto max-w-7xl h-full grid grid-cols-[300px_1fr] gap-4">
                    <Sidebar
                        className="h-full w-[300px] bg-gray-50"
                        files={files}
                        onSelect={select}
                        selectedId={selectedFileId}
                        fileUpload={addFile}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default App;
