import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description?: string;
  image?: string;
  price: number;
  category?: mongoose.Types.ObjectId;
  isActive: boolean;
  company: mongoose.Types.ObjectId;
}

const ItemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    price: { type: Number, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required:true
    },
    isActive: { type: Boolean, default: true },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item ||
  mongoose.model<IItem>("Item", ItemSchema);
