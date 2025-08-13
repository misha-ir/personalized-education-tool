/**
 * Represents metadata about a file.
 */
export interface FileMeta {
  id: string;
  name: string;
  course: string; // Required - frontend will provide "Uncategorized" if empty
  size: number;
  createdAt: string;
  url: string;
  // Legacy fields for backward compatibility during migration
  uploadDate?: number;
  lastModified?: number;
}
