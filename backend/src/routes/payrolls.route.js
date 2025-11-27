import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  generatePayroll,
  getAllPayrolls,
  getPayrollByEmployee,
  getPayrollById
} from "../controller/payrolls.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, generatePayroll);
router.get("/", authMiddleware, getAllPayrolls);
router.get("/employee/:employeeId", authMiddleware, getPayrollByEmployee);
router.get("/:id", authMiddleware, getPayrollById);

export default router;


