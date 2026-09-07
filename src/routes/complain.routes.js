import { Router } from "express";
const router = Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { complain, updateComplainStatus, showComplain, resolvedComplain, getMyComplaints} from "../controllers/complain.controller.js";

router.route("/complains").post(verifyJWT, upload.single("image"), complain);
router.route("/update-status/:id").patch(verifyJWT, checkPermission(["admin"]), updateComplainStatus);
router.route("/show-complains").get(verifyJWT, showComplain );
router.route("/resolved-complains").get(verifyJWT, resolvedComplain );
router.route("/getmycomplain").get(verifyJWT, getMyComplaints);

export default router;