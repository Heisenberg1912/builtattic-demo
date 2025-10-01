import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Uploads route working" });
});

// Placeholder upload endpoint (expects JSON body with a 'name' or similar)
router.post("/", (req, res) => {
  // ...handle upload (integrate multer/cloudinary later)...
  res.status(201).json({ message: "Upload received" });
});

export default router;
