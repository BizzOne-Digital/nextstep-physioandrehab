import mongoose, { Schema, type Model } from "mongoose";

export interface StoredUploadDoc {
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<StoredUploadDoc>(
  {
    folder: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export const StoredUpload: Model<StoredUploadDoc> =
  (mongoose.models.StoredUpload as Model<StoredUploadDoc>) ||
  mongoose.model<StoredUploadDoc>("StoredUpload", StoredUploadSchema);
