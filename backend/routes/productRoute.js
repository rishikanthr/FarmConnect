import express from "express";
import { addProduct, getAllProducts , getProductsByFarmer , getProductsByTitle , getProductsByFarmerName}  
from "../productListing/productlisting.js";
import authenticateUser from "../middleware/authUser.js";
import authenticateFarmer from "../middleware/authFarmer.js";
import authenticateAdmin from "../middleware/authAdmin.js";
import { deleteProductFarmer, deleteProductAdmin } from "../controllers/productController.js    ";
import upload from "../middleware/upload.js";
import Product from "../models/product.js";

const router = express.Router();

//router.post("/add", authenticateFarmer, upload.single("image"), addProduct);
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


router.post("/add", authenticateFarmer , upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      category,
      certifiedOrganic,
      farmerId,
      farmerName,
      farmerEmail,
      farmerLocation,
    } = req.body;

    const imageURL = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      certifiedOrganic,
      farmerId,
      farmerName,
      farmerEmail,
      farmerLocation,
      imageURL,
    });

    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ error: "Error adding product" });
  }
});


/* Admin deletes any listing */
router.delete(
  "/admin/delete/:productId",
  authenticateUser,
  authenticateAdmin,
  (req, res, next) => {
    next();
  },
  deleteProductAdmin
);

export default router;
