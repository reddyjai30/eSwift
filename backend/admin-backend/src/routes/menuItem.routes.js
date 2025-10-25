import { Router } from "express";
import multer from "multer";
import { adminAuth } from "../middlewares/auth.js";
import {
  createMenuItem, listMenuItems, updateMenuItem, deleteMenuItem, presignUpload, deleteUpload,
  deleteMenuItemImage, uploadMenuItemImage
} from "../controllers/menuItem.controller.js";

const r = Router();
r.use(adminAuth);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
r.post("/uploads/presign", presignUpload);
r.post("/uploads/delete", deleteUpload);
r.get("/:restaurantId", listMenuItems);
r.post("/:restaurantId", createMenuItem);
r.patch("/item/:itemId", updateMenuItem);
r.post("/:restaurantId/item/:itemId/image", upload.single("file"), uploadMenuItemImage);
r.patch("/:restaurantId/item/:itemId/image", upload.single("file"), uploadMenuItemImage);
r.delete("/:restaurantId/item/:itemId/image", deleteMenuItemImage);
r.delete("/item/:itemId", deleteMenuItem);
export default r;
