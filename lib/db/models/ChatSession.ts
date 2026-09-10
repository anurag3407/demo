import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatSession extends Document {
  title: string;
  modelName: string;
  providerId?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "New Chat",
      trim: true,
    },
    modelName: {
      type: String,
      required: true,
      default: "gpt-4o",
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ProviderConfig",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ChatSessionSchema.index({ updatedAt: -1 });

export const ChatSession: Model<IChatSession> =
  mongoose.models.ChatSession ||
  mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
