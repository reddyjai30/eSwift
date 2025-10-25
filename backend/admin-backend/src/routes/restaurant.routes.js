import { Router } from "express";
import multer from "multer";
import { adminAuth } from "../middlewares/auth.js";
import {
  createRestaurant, listRestaurants, getRestaurant,
  updateRestaurant, deleteRestaurant, uploadRestaurantLogo
} from "../controllers/restaurant.controller.js";

const r = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
r.use(adminAuth);
r.post("/", createRestaurant);
r.get("/", listRestaurants);
r.get("/:id", getRestaurant);
r.patch("/:id", updateRestaurant);
r.delete("/:id", deleteRestaurant);
// Upload/replace logo via multipart file field `file`
r.post("/:id/logo", upload.single("file"), uploadRestaurantLogo);
export default r;
