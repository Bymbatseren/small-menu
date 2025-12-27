import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from "nanoid";

interface ITable {
  name?: string;
  tableCode: string;
}

export interface ICompany extends Document {
  name: string;
  email: string;
  password: string;
  logo: string;
  items: mongoose.Types.ObjectId[];
  tables: ITable[];
  plan: "FREE" | "PAID";
  isActive: boolean;
  otp: string;
  otpExpires: Date;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TableSubSchema = new Schema<ITable>({
  name: { type: String },
  tableCode: {
    type: String,
    default: () => nanoid(10)

  },
});

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    logo: { type: String, default: "" },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    tables: [TableSubSchema],
    plan: {
      type: String,
      enum: ["FREE", "PAID"],
      default: "FREE",
    },
    isActive: { type: Boolean, default: true },
    otp: {
      type: String,

    },
    otpExpires: {
      type: Date,
    },
    subscriptionExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);