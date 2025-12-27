import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  item: mongoose.Types.ObjectId;
  quantity: number;
  note?: string;
}

export interface IOrder extends Document {
  company: mongoose.Types.ObjectId;
  tableCode: string;
  items: IOrderItem[];
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    tableCode: { type: String, required: true },
    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, required: true, default: 1 },
        note: { type: String, trim: true },
      },
    ],
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "DONE"], default: "PENDING" },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
