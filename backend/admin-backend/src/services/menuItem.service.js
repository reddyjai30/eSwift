import { MenuItem } from "../models/MenuItem.js";
import ApiError from "../utils/ApiError.js";
import { s3PublicUrl } from "../config/s3.js";
import { deleteObjectByKey } from "../config/s3.js";

export async function addMenuItem(restaurantId, payload) {
  const toSave = { restaurantId, ...payload };
  return MenuItem.create(toSave);
}
export async function listMenuItems(restaurantId) {
  return MenuItem.find({ restaurantId }).sort({ createdAt: -1 });
}
export async function updateMenuItem(itemId, payload) {
  const toSet = { ...payload };
  const i = await MenuItem.findByIdAndUpdate(itemId, { $set: toSet }, { new: true });
  if (!i) throw ApiError.notFound("Menu item not found");
  return i;
}
export async function deleteMenuItem(itemId) {
  const i = await MenuItem.findByIdAndDelete(itemId);
  if (!i) throw ApiError.notFound("Menu item not found");
  return true;
}

export async function setMenuItemImageByRestaurant(restaurantId, itemId, { imageKey, deleteOld }) {
  const item = await MenuItem.findOne({ _id: itemId, restaurantId });
  if (!item) throw ApiError.notFound("Menu item not found for this restaurant");
  const oldKey = item.imageKey;
  item.imageKey = imageKey;
  item.imageUrl = s3PublicUrl(imageKey);
  await item.save();
  if (deleteOld && oldKey && oldKey !== imageKey) {
    try { await deleteObjectByKey(oldKey); } catch { /* ignore delete errors */ }
  }
  return item;
}

export async function clearMenuItemImageByRestaurant(restaurantId, itemId, { deleteFromS3 = true } = {}) {
  const item = await MenuItem.findOne({ _id: itemId, restaurantId });
  if (!item) throw ApiError.notFound("Menu item not found for this restaurant");
  const oldKey = item.imageKey;
  item.imageKey = undefined;
  item.imageUrl = undefined;
  await item.save();
  if (deleteFromS3 && oldKey) {
    try { await deleteObjectByKey(oldKey); } catch { /* ignore */ }
  }
  return item;
}
