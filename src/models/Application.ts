import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  fullName: string;
  country: string;
  collegeName: string;
  researchLab: string;
  department?: string;
  message?: string;
  fileName: string;
  submittedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  country: { type: String, required: true },
  collegeName: { type: String, required: true },
  researchLab: { type: String, required: true },
  department: { type: String }, // Keep optional for backward compatibility
  message: { type: String },
  fileName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Force recreation of the Mongoose model to clear old cache rules
if (mongoose.models.Application) {
  delete mongoose.models.Application;
}

export const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
