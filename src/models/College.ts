import mongoose, { Schema, Document } from "mongoose";

export interface ICollege extends Document {
  country: string;
  collegeName: string;
  researchLabs: string[];
}

const CollegeSchema: Schema = new Schema({
  country: { type: String, required: true },
  collegeName: { type: String, required: true },
  researchLabs: { type: [String], default: [] },
});

// Compound index to ensure uniqueness of collegeName within a country
CollegeSchema.index({ country: 1, collegeName: 1 }, { unique: true });

if (mongoose.models.College) {
  delete mongoose.models.College;
}

export const College = mongoose.model<ICollege>("College", CollegeSchema);
