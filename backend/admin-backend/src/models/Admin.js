import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new Schema(
  {
    username: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

AdminSchema.methods.compare = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

export const Admin = mongoose.model("Admin", AdminSchema);

