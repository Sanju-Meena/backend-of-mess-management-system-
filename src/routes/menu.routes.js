import { Router } from "express";
import { createMenu, updateMenu,getMenu } from "../controllers/menu.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { checkPermission } from "../middlewares/permission.middleware.js"
const router = Router();

router.route("/createmenu").post(verifyJWT, checkPermission(["admin"]), createMenu);
router.route("/updatemenu").post(verifyJWT, checkPermission(["admin"]), updateMenu);
router.route("/getmenu").get(getMenu);

export default router;