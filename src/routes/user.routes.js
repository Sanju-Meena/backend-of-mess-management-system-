import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
    } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
     upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
     ]),
    registerUser);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-accessToken").post(refreshAccessToken);
router.route("/changepassword").post(verifyJWT, changeCurrentPassword);
router.route("/current_user").post(verifyJWT, getCurrentUser);
router.route("/change-fullname-email").post(verifyJWT, updateAccountDetails);
router.route("/change-avatar").post(verifyJWT, upload.single("avatar"),updateUserAvatar);

export default router;