import { Router } from "express";
const router = Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { complain } from "../controllers/complain.controller.js";

router.route("/complain").post(verifyJWT,upload.single("image"),complain);

export default router;