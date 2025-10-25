import { Router } from "express";
import adminAuthRoutes from "./adminAuth.routes.js";
import restaurantRoutes from "./restaurant.routes.js";
import menuItemRoutes from "./menuItem.routes.js";

const r = Router();
r.use("/admin/auth", adminAuthRoutes);
r.use("/admin/restaurants", restaurantRoutes);
r.use("/admin/menu", menuItemRoutes);

export default r;

