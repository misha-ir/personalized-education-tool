// API service for backend file operations
const API_BASE_URL = "http://localhost:3001/api";

export interface BackendFileResponse {
    id: string;
    name: string;
    size: number;
    createdAt: string;
    url: string;
    course: string;
}

export class FileService {
    //Fetch all files from backend
    static async getAllFiles(): Promise<BackendFileResponse[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/files`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching files:", error);
            throw error;
        }
    }

    // Upload a file to the backend
    static async uploadFile(
        file: File,
        course: string
    ): Promise<BackendFileResponse> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("course", course);

            const response = await fetch(`${API_BASE_URL}/files`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    // Delete a file from the backend
    static async deleteFile(fileId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }

    // Get the content URL for a file
    static getFileContentUrl(fileId: string): string {
        return `${API_BASE_URL}/files/${fileId}/content`;
    }
}
