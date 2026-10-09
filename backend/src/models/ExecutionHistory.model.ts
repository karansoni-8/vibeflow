import mongoose, { Document, Schema } from 'mongoose';

export interface IExecutionHistory extends Document {
  userId?: mongoose.Types.ObjectId | string;
  projectId?: mongoose.Types.ObjectId | string;
  language: string;
  code: string;
  stdin: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  createdAt: Date;
}

const ExecutionHistorySchema: Schema = new Schema({
  userId: { type: Schema.Types.Mixed },
  projectId: { type: Schema.Types.Mixed },
  language: { type: String, required: true },
  code: { type: String, required: true },
  stdin: { type: String, default: '' },
  stdout: { type: String, default: '' },
  stderr: { type: String, default: '' },
  exitCode: { type: Number, default: 0 },
  durationMs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const ExecutionHistory = mongoose.model<IExecutionHistory>(
  'ExecutionHistory',
  ExecutionHistorySchema
);
