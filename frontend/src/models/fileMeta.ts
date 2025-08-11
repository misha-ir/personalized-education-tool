/**
 * Represents metadata about a file.
 */
export interface FileMeta {
  id: string;
  name: string;
  course?: string;
  size?: number;
  uploadDate?: number;
  lastModified?: number;
}
