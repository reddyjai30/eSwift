import { login as loginSvc, changePassword as changePwdSvc } from "../services/adminAuth.service.js";
import { loginSchema, changePasswordSchema } from "../validators/auth.validators.js";
import { ok } from "../utils/ApiResponse.js";

export async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return next(error);
    const result = await loginSvc(value.username, value.password);
    res.json(ok(result, "Login successful"));
  } catch (e) { next(e); }
}

export async function me(req, res) {
  const admin = req.admin;
  res.json(ok({ admin }));
}

export async function changePassword(req, res, next) {
  try {
    const { value, error } = changePasswordSchema.validate(req.body);
    if (error) return next(error);
    const admin = req.admin;
    await changePwdSvc(admin.sub, value.oldPassword, value.newPassword);
    res.json(ok(true, "Password updated"));
  } catch (e) { next(e); }
}

