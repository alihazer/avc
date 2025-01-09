import express from "express";
import { addCar, updateCar, deleteCar, getCars, getCarById, getAddCarForm, getEditCarForm} from "../controllers/car.contoller.js";
import {renderCostForm, createCost, getAllCosts, getCostById, getCarCostById} from "../controllers/carCost.controller.js";
import checkPermission from "../middlewares/checkPermission.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/", isLoggedIn,checkPermission("manage_ambulances") ,getCars);
router.get("/create/new", isLoggedIn, checkPermission("manage_ambulances"), getAddCarForm);
router.get("/:id",isLoggedIn ,checkPermission("manage_ambulances"), getCarById);
router.post("/", isLoggedIn ,checkPermission("manage_ambulances"), addCar);
router.put("/:id", isLoggedIn ,checkPermission("manage_ambulances"), updateCar);
router.delete("/:id", isLoggedIn ,checkPermission("manage_ambulances"), deleteCar);
router.get("/:id/edit", isLoggedIn ,checkPermission("manage_ambulances"), getEditCarForm);
router.get("/costs/all", isLoggedIn ,checkPermission("manage_ambulances"), getAllCosts);
router.get("/costs/add", isLoggedIn ,checkPermission("manage_ambulances"), renderCostForm);
router.post("/costs/create", isLoggedIn ,checkPermission("manage_ambulances"), createCost);
router.get("/costs/:id", isLoggedIn ,checkPermission("manage_ambulances"), getCostById);
router.get("/:carId/costs/:year", isLoggedIn ,checkPermission("manage_ambulances"), getCarCostById);


export default router;