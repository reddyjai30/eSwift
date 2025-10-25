import { Restaurant } from "../models/Restaurant.js";
import ApiError from "../utils/ApiError.js";
import { s3PublicUrl } from "../config/s3.js";

export async function createRestaurant(ownerAdminId, payload) {
  const toSave = { ...payload, ownerAdminId };
  if (toSave.logoKey && !toSave.logoUrl) {
    toSave.logoUrl = s3PublicUrl(toSave.logoKey);
  }
  const doc = await Restaurant.create(toSave);
  return doc;
}
export async function listRestaurants(ownerAdminId) {
  return Restaurant.find({ ownerAdminId }).sort({ createdAt: -1 });
}
export async function getRestaurant(ownerAdminId, id) {
  const r = await Restaurant.findOne({ _id: id, ownerAdminId });
  if (!r) throw ApiError.notFound("Restaurant not found");
  return r;
}
export async function updateRestaurant(ownerAdminId, id, payload) {
  const toSet = { ...payload };
  if (toSet.logoKey && !toSet.logoUrl) {
    toSet.logoUrl = s3PublicUrl(toSet.logoKey);
  }
  const r = await Restaurant.findOneAndUpdate(
    { _id: id, ownerAdminId },
    { $set: toSet },
    { new: true }
  );
  if (!r) throw ApiError.notFound("Restaurant not found");
  return r;
}
export async function deleteRestaurant(ownerAdminId, id) {
  const r = await Restaurant.findOneAndDelete({ _id: id, ownerAdminId });
  if (!r) throw ApiError.notFound("Restaurant not found");
  return true;
}
