import express from "express";
const router = express.Router();
import { getMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial, getMaterialForm, getUpdateMaterialForm, renderItemsUsed, getItemsUsed } from "../controllers/materials.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import checkPermission from "../middlewares/checkPermission.js";


router.get("/", isLoggedIn, checkPermission("manage_stock") , getMaterials);
router.get("/add", isLoggedIn, checkPermission("manage_stock"),getMaterialForm);
router.post("/", isLoggedIn, checkPermission("manage_stock"),createMaterial);
router.get("/:id", isLoggedIn, checkPermission("manage_stock") ,getMaterial);
router.get("/edit/:id", isLoggedIn, checkPermission("manage_stock") ,getUpdateMaterialForm);
router.put("/edit/:id", isLoggedIn, checkPermission("manage_stock") ,updateMaterial);
router.delete("/delete/:id", isLoggedIn, checkPermission("manage_stock") ,deleteMaterial);
router.get("/used/all", isLoggedIn, checkPermission("manage_stock"),renderItemsUsed);
router.get("/get/all", isLoggedIn, checkPermission("manage_stock"), getItemsUsed);

export default router;