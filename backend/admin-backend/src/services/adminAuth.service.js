import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

export async function login(username, password) {
  const admin = await Admin.findOne({ username, isActive: true });
  if (!admin) throw ApiError.unauthorized("Invalid credentials");
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw ApiError.unauthorized("Invalid credentials");
  const token = jwt.sign({ sub: admin.id, role: "admin", username }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  return { token, admin: { id: admin.id, username: admin.username } };
}

export async function changePassword(adminId, oldPwd, newPwd) {
  const admin = await Admin.findById(adminId);
  if (!admin) throw ApiError.unauthorized("Admin not found");
  const ok = await bcrypt.compare(oldPwd, admin.passwordHash);
  if (!ok) throw ApiError.unauthorized("Old password incorrect");
  const hash = await bcrypt.hash(newPwd, 10);
  admin.passwordHash = hash;
  await admin.save();
  return true;
}

