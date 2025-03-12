import { Schema, Document } from 'mongoose';

export const ClaimSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  claimAmount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submissionDate: { type: Date, default: Date.now },
  approvedAmount: { type: Number },
  insurerComments: { type: String },
  documentUrl: { type: String }, // File URL from Cloudinary
});

export interface Claim extends Document {
  name: string;
  email: string;
  claimAmount: number;
  description: string;
  status: string;
  submissionDate: Date;
  approvedAmount?: number;
  insurerComments?: string;
  documentUrl?: string;
}