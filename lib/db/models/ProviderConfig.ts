import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProviderConfig extends Document {
  name: string;
  baseUrl: string;
  encryptedApiKey?: string;
  defaultModel: string;
  isDefault: boolean;
  parameters: {
    temperature: number;
    topP: number;
    maxTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProviderConfigSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    baseUrl: {
      type: String,
      required: true,
      trim: true,
    },
    encryptedApiKey: {
      type: String,
      default: null,
    },
    defaultModel: {
      type: String,
      default: "gpt-4o",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    parameters: {
      temperature: { type: Number, default: 0.7 },
      topP: { type: Number, default: 1.0 },
      maxTokens: { type: Number, default: 2048 },
    },
  },
  {
    timestamps: true,
  }
);

export const ProviderConfig: Model<IProviderConfig> =
  mongoose.models.ProviderConfig ||
  mongoose.model<IProviderConfig>("ProviderConfig", ProviderConfigSchema);
