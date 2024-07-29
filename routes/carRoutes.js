import express from "express";
import { addCar, updateCar, deleteCar, getCars, getCarById, getAddCarForm, getEditCarForm } from "../controllers/car.contoller.js";
import checkPermission from "../middlewares/checkPermission.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/", isLoggedIn,checkPermission("manage_ambulances") ,getCars);
router.get("/add", isLoggedIn, checkPermission("manage_ambulances"), getAddCarForm);
router.get("/:id",isLoggedIn ,checkPermission("manage_ambulances"), getCarById);
router.post("/", isLoggedIn ,checkPermission("manage_ambulances"), addCar);
router.put("/:id", isLoggedIn ,checkPermission("manage_ambulances"), updateCar);
router.delete("/:id", isLoggedIn ,checkPermission("manage_ambulances"), deleteCar);
router.get("/:id/edit", isLoggedIn ,checkPermission("manage_ambulances"), getEditCarForm);

export default router;