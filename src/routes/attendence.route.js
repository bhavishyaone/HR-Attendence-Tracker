import {checkIN,checkOut,getAllAttendence,getattendancebyId} from '../controller/attendence.controller.js';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router()
router.get("/",authMiddleware,getAllAttendence)
router.get("/:employeeId",authMiddleware,getattendancebyId)
router.post("/check-in",authMiddleware,checkIN);
router.post("/check-out",authMiddleware,checkOut);

export default router;