import { Router } from "express";
import authController from "../controllers/auth.js";
import healthController from "../controllers/health.js";
import urlController from "../controllers/url_generate.js";
import viewUrl from "../controllers/urlauth/view.js";
import createUrl from "../controllers/urlauth/create.js";
import editUrl from "../controllers/urlauth/edit.js";
import deleteUrl from "../controllers/urlauth/delete.js";
import isAuth from "../middlewares/isAuth.js";
import redirectUrl from "../controllers/urlauth/redirect.js";

const router = Router();

router.get("/", healthController.getHealth);
router.post("/", healthController.postHealth);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/url", urlController.shortUrl);
router.get("/redirect", redirectUrl);

// urlAuth router
router.get("/urlauth", isAuth, viewUrl);
router.post("/urlauth", isAuth, createUrl);
router.put("/urlauth/:id", isAuth, editUrl);
router.delete("/urlauth/:id", isAuth, deleteUrl);

export default router;
