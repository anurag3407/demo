import mongoose, { Schema, Document, Model } from "mongoose";

export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface IToolCall {
  toolName: string;
  args: Record<string, unknown>;
  output?: Record<string, unknown> | string;
  isError?: boolean;
}

export interface IMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  parentMessageId?: mongoose.Types.ObjectId | null;
  role: MessageRole;
  content: string;
  reasoningContent?: string;
  tokenCount?: number;
  modelName?: string;
  toolCalls?: IToolCall[];
  createdAt: Date;
  updatedAt: Date;
}

const ToolCallSchema = new Schema(
  {
    toolName: { type: String, required: true },
    args: { type: Schema.Types.Mixed, default: {} },
    output: { type: Schema.Types.Mixed },
    isError: { type: Boolean, default: false },
  },
  { _id: false }
);

const MessageSchema: Schema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    role: {
      type: String,
      enum: ["system", "user", "assistant", "tool"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    reasoningContent: {
      type: String,
      default: null,
    },
    tokenCount: {
      type: Number,
      default: 0,
    },
    modelName: {
      type: String,
    },
    toolCalls: [ToolCallSchema],
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ sessionId: 1, createdAt: 1 });

export const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
