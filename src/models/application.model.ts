
import mongoose, { Document, Schema, model, Types } from "mongoose";

 
export interface IApplication extends Document {
  applicantId: Types.ObjectId;
  jobId: Types.ObjectId;
  resumePath: string;
  coverLetterPath?: string;
  submittedAt: Date;
  updatedAt?: Date;
  status: "pending" | "shortlisted" | "rejected";
}

 
const ApplicationSchema = new Schema<IApplication>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resumePath: {
      type: String,
      required: true,
      match: /\.(pdf|docx?)$/i,
    },
    coverLetterPath: {
      type: String,
      required: false,
      match: /\.(pdf|docx?)$/i,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "submittedAt", updatedAt: true },
  }
);

 
ApplicationSchema.index({ applicantId: 1 });
ApplicationSchema.index({ jobId: 1 });
ApplicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });
 
export default model<IApplication>("Application", ApplicationSchema);
