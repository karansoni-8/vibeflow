import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  displayName: { type: String, default: 'Vibe Coder' },
  photoURL: { type: String },
  provider: { type: String, default: 'firebase' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
