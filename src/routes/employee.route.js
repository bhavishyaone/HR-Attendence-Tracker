import { createEmployee,deleteEmployee,getAllEmployee,getEmployeebyId, updateEmployee} from "../controller/employee.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router()


router.post("/",authMiddleware,createEmployee);
router.get("/",authMiddleware,getAllEmployee);
router.get("/:id",authMiddleware,getEmployeebyId)
router.put("/:id",authMiddleware,updateEmployee)
router.delete("/:id",authMiddleware,deleteEmployee)

export default router;
