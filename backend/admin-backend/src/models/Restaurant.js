import mongoose, { Schema } from "mongoose";

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    address: String,
    isActive: { type: Boolean, default: true },
    ownerAdminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    printer: {
      agentKey: String,
      connection: { type: String, enum: ["usb", "lan", "bt"], default: "usb" },
      escposProfile: { type: String, default: "80mm" }
    },
    logoUrl: String,
    logoKey: String
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
