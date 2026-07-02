import express from "express";
import { testCloudinary } from "../controllers/cloudinaryController.js";

const router = express.Router();

router.get("/test-cloud", testCloudinary);

export default router;