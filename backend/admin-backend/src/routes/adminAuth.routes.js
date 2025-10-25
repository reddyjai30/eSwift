import { Router } from "express";
import { login, me, changePassword } from "../controllers/adminAuth.controller.js";
import { adminAuth } from "../middlewares/auth.js";

const r = Router();
r.post("/login", login);
r.get("/me", adminAuth, me);
r.patch("/password", adminAuth, changePassword);
export default r;

