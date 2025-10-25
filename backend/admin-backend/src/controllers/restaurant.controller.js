import { ok } from "../utils/ApiResponse.js";
import { createRestaurantSchema, updateRestaurantSchema } from "../validators/restaurant.validators.js";
import * as svc from "../services/restaurant.service.js";
import ApiError from "../utils/ApiError.js";
import { buildScopedKey, putObjectBuffer, deleteObjectByKey } from "../config/s3.js";

export async function createRestaurant(req, res, next) {
  try {
    const { value, error } = createRestaurantSchema.validate(req.body);
    if (error) return next(error);
    const admin = req.admin;
    const doc = await svc.createRestaurant(admin.sub, value);
    res.json(ok(doc, "Restaurant created"));
  } catch (e) { next(e); }
}

export async function listRestaurants(req, res, next) {
  try {
    const admin = req.admin;
    const docs = await svc.listRestaurants(admin.sub);
    res.json(ok(docs));
  } catch (e) { next(e); }
}

export async function getRestaurant(req, res, next) {
  try {
    const admin = req.admin;
    const doc = await svc.getRestaurant(admin.sub, req.params.id);
    res.json(ok(doc));
  } catch (e) { next(e); }
}

export async function updateRestaurant(req, res, next) {
  try {
    const { value, error } = updateRestaurantSchema.validate(req.body);
    if (error) return next(error);
    const admin = req.admin;
    const doc = await svc.updateRestaurant(admin.sub, req.params.id, value);
    res.json(ok(doc, "Restaurant updated"));
  } catch (e) { next(e); }
}

export async function deleteRestaurant(req, res, next) {
  try {
    const admin = req.admin;
    await svc.deleteRestaurant(admin.sub, req.params.id);
    res.json(ok(true, "Restaurant deleted"));
  } catch (e) { next(e); }
}

export async function uploadRestaurantLogo(req, res, next) {
  try {
    const admin = req.admin;
    const id = req.params.id;
    const file = req.file;
    if (!file) return next(ApiError.badRequest("file is required"));
    const restaurant = await svc.getRestaurant(admin.sub, id);

    const key = buildScopedKey({
      scope: "restaurantLogo",
      restaurantId: id,
      filename: file.originalname,
      contentType: file.mimetype,
    });
    const { url } = await putObjectBuffer({ key, contentType: file.mimetype, body: file.buffer });

    // optional: delete old key if requested
    const deleteOld = (req.query.deleteOld || "false").toString() === "true";
    if (deleteOld && restaurant.logoKey && restaurant.logoKey !== key) {
      try { await deleteObjectByKey(restaurant.logoKey); } catch (_) { /* ignore */ }
    }

    restaurant.logoKey = key;
    restaurant.logoUrl = url;
    await restaurant.save();

    res.json(ok({ logoKey: key, logoUrl: url, restaurantId: restaurant.id }, "Logo uploaded"));
  } catch (e) { next(e); }
}
