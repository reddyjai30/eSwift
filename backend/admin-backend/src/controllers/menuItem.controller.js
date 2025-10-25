import { ok } from "../utils/ApiResponse.js";
import { createMenuItemSchema, updateMenuItemSchema } from "../validators/menu.validators.js";
import * as svc from "../services/menuItem.service.js";
import ApiError from "../utils/ApiError.js";
import { buildScopedKey, getPresignedUploadUrl, deleteObjectByKey, putObjectBuffer } from "../config/s3.js";

export async function createMenuItem(req, res, next) {
  try {
    const { value, error } = createMenuItemSchema.validate(req.body);
    if (error) return next(error);
    const restaurantId = req.params.restaurantId;
    const item = await svc.addMenuItem(restaurantId, value);
    res.json(ok(item, "Menu item created"));
  } catch (e) { next(e); }
}

export async function uploadMenuItemImage(req, res, next) {
  try {
    const restaurantId = req.params.restaurantId;
    const itemId = req.params.itemId;
    const file = req.file;
    if (!file) return next(ApiError.badRequest("file is required"));
    // Ensure item exists and belongs to restaurant
    const item = await (await import("../models/MenuItem.js")).MenuItem.findOne({ _id: itemId, restaurantId });
    if (!item) return next(ApiError.notFound("Menu item not found for this restaurant"));

    const key = buildScopedKey({
      scope: "menuItemImage",
      restaurantId,
      menuItemId: itemId,
      filename: file.originalname,
      contentType: file.mimetype,
    });
    const { url } = await putObjectBuffer({ key, contentType: file.mimetype, body: file.buffer });

    const deleteOld = (req.query.deleteOld || "false").toString() === "true";
    const oldKey = item.imageKey;
    item.imageKey = key;
    item.imageUrl = url;
    await item.save();

    if (deleteOld && oldKey && oldKey !== key) {
      try { await deleteObjectByKey(oldKey); } catch (_) { /* ignore */ }
    }

    res.json(ok({ itemId: item.id, imageKey: key, imageUrl: url }, "Menu item image uploaded"));
  } catch (e) { next(e); }
}

export async function deleteMenuItemImage(req, res, next) {
  try {
    const restaurantId = req.params.restaurantId;
    const itemId = req.params.itemId;
    const deleteS3 = (req.query.deleteS3 || "true").toString() !== "false";
    const updated = await svc.clearMenuItemImageByRestaurant(restaurantId, itemId, { deleteFromS3: deleteS3 });
    res.json(ok({ itemId: updated.id, imageKey: updated.imageKey || null, imageUrl: updated.imageUrl || null }, "Menu item image removed"));
  } catch (e) { next(e); }
}

export async function listMenuItems(req, res, next) {
  try {
    const restaurantId = req.params.restaurantId;
    const items = await svc.listMenuItems(restaurantId);
    res.json(ok(items));
  } catch (e) { next(e); }
}

export async function updateMenuItem(req, res, next) {
  try {
    const { value, error } = updateMenuItemSchema.validate(req.body);
    if (error) return next(error);
    const updated = await svc.updateMenuItem(req.params.itemId, value);
    res.json(ok(updated, "Menu item updated"));
  } catch (e) { next(e); }
}

export async function deleteMenuItem(req, res, next) {
  try {
    await svc.deleteMenuItem(req.params.itemId);
    res.json(ok(true, "Menu item deleted"));
  } catch (e) { next(e); }
}

export async function presignUpload(req, res, next) {
  try {
    const { key: bodyKey, contentType, scope, restaurantId, menuItemId, filename } = req.body || {};
    if (!contentType) throw ApiError.badRequest("contentType required");
    let key = bodyKey;
    if (!key) {
      if (!scope) throw ApiError.badRequest("scope required when key is not provided");
      key = buildScopedKey({ scope, restaurantId, menuItemId, filename, contentType });
    }
    const out = await getPresignedUploadUrl(key, contentType);
    res.json(ok({ key, ...out }, "Presign generated"));
  } catch (e) { next(e); }
}

export async function deleteUpload(req, res, next) {
  try {
    const { key } = req.body || {};
    if (!key) return next(ApiError.badRequest("key required"));
    await deleteObjectByKey(key);
    res.json(ok(true, "Object deleted"));
  } catch (e) { next(e); }
}
// bulkCreateMenuItems removed per product decision; use single-create endpoint.
