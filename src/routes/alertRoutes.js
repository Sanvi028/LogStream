import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import * as alertController from "../controllers/alertController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", alertController.list);
router.get("/history", alertController.history);
router.post("/", requireAdmin, alertController.create);
router.patch("/:id", requireAdmin, alertController.update);
router.delete("/:id", requireAdmin, alertController.remove);

export default router;