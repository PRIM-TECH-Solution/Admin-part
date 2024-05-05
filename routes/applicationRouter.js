import express from "express";
import {
  eventOrganizerGetAllApplications,
  DeleteApplication,
  adminGetAllApplications,
  postApplication,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/post", isAuthenticated, postApplication);
router.get("/eventOrganizer/getallevents", isAuthenticated, eventOrganizerGetAllApplications);
router.get("/admin/getall", isAuthenticated, adminGetAllApplications);
router.delete("/delete/:id", isAuthenticated, DeleteApplication);

export default router;
