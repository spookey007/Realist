import express from "express";
import {
  createInvite,
  updateInvite,
  resendInvite,
  getInvites,
  getInvitesById
} from "../controllers/inviteController.js";

const router = express.Router();

router.post("/createInvite", createInvite); // Create a new invite
router.put("/updateInvite/:id", updateInvite); // Update an existing invite
router.post("/resendInvite/:id", resendInvite); // Resend an invite
router.get("/getInvites", getInvites); // Get all invites
router.get("/:id", getInvitesById); // Get all invites

export default router;
