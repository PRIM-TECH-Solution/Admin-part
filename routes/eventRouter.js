import express from "express";
import {
  deleteEvent,
  getAllEvents,
  getEvents,
  getSingleEvent,
  postEvent,
  updateEvent,
} from "../controllers/eventController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();




router.get("/getall", getAllEvents);
router.post("/post", isAuthenticated, postEvent);
router.get("/getevents", isAuthenticated, getEvents);
router.put("/update/:id", isAuthenticated, updateEvent);
router.delete("/delete/:id", isAuthenticated, deleteEvent);
router.get("/:id", isAuthenticated, getSingleEvent);

export default router;
