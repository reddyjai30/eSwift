import mongoose, { Schema } from "mongoose";

const MenuItemSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, min: 0 },
    category: String,
    imageUrl: String,
    imageKey: String
  },
  { timestamps: true }
);

MenuItemSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
