import express from "express";
import {
    createMenu,
    updateMenu,
    getAllMenus,
    getMenuById,
    deleteMenu
} from "../controllers/menuController.js";

const router = express.Router();

// Create a new menu
router.post("/", createMenu);

// Get all menus
router.get("/", getAllMenus);

// Get a menu by ID
router.get("/:id", getMenuById);

// Update a menu
router.put("/:id", updateMenu);

// Delete a menu
router.delete("/:id", deleteMenu);

export default router;
