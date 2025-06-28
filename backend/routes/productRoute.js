import express from "express";
import { addProduct, getAllProducts , getProductsByFarmer , getProductsByTitle , getProductsByFarmerName}  
from "../productListing/productlisting.js";
import authenticateUser from "../middleware/authUser.js";
import authenticateFarmer from "../middleware/authFarmer.js";
import authenticateAdmin from "../middleware/authAdmin.js";
import { deleteProductFarmer, deleteProductAdmin } from "../controllers/productController.js    ";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/add", authenticateFarmer, upload.single("image"), addProduct);
router.get("/getAll", getAllProducts);
router.get('/by-title/:title', getProductsByTitle);
router.get("/getByFarmer/:farmerId", getProductsByFarmer);
router.get("/by-farmer-name/:name", getProductsByFarmerName);

router.delete(
  "/delete/:productId",
  authenticateUser,
  authenticateFarmer,
  deleteProductFarmer
);

/* Admin deletes any listing */
router.delete(
  "/admin/delete/:productId",
  authenticateUser,
  authenticateAdmin,
  (req, res, next) => {
    console.log(">>> reached admin delete route", req.params.productId);
    next();
  },
  deleteProductAdmin
);

export default router;
