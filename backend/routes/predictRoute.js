import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), {
      filename: originalName,
      contentType: mimeType,
    });

    const response = await axios.post("http://localhost:8000/predict", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    fs.unlinkSync(filePath); // delete temp file
    res.json(response.data);
  } catch (err) {
    console.error("❌ Prediction failed:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;
