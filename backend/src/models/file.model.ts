import { Schema, model, InferSchemaType } from "mongoose";

const FileSchema = new Schema({
  originalName: { type: String, required: true },
  storedName:   { type: String, required: true, unique: true },
  size:         { type: Number, required: true },
  mimeType:     { type: String, required: true },
  path:         { type: String, required: true },
}, { timestamps: true });

export type FileDoc = InferSchemaType<typeof FileSchema> & { _id: string };
export default model("File", FileSchema);
