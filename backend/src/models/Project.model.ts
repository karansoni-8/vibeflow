import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  language: string;
  code: string;
  lastFlowchart?: string;
  lastExplainReport?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.Mixed, required: true },
    title: { type: String, required: true, default: 'Untitled Algorithm' },
    language: { type: String, required: true, default: 'python' },
    code: { type: String, required: true, default: '' },
    lastFlowchart: { type: String },
    lastExplainReport: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
