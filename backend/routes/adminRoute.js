import express from "express";
import {getAllConsumers, getAllFarmers, getAllProducts , restrictUserOneDay,
  restrictUserSevenDays, banUser,  getAllUsers , unbanUser }  from "../controllers/adminControl.js";
import authenticateAdmin from "../middleware/authAdmin.js";
import authenticateUser from "../middleware/authUser.js";


const router = express.Router();

router.get("/allConsumers", authenticateAdmin , getAllConsumers);
router.get("/allFarmers", authenticateAdmin , getAllFarmers);
router.get("/allProducts", authenticateAdmin , getAllProducts);

router.get("/users", authenticateUser, authenticateAdmin, getAllUsers);

router.patch("/users/:userId/restrict/1d", authenticateUser, authenticateAdmin, restrictUserOneDay);
router.patch("/users/:userId/restrict/7d", authenticateUser, authenticateAdmin, restrictUserSevenDays);
router.patch("/users/:userId/unban", authenticateUser, authenticateAdmin, unbanUser);
router.delete("/users/:userId/ban", authenticateUser, authenticateAdmin, banUser);

export default router;
