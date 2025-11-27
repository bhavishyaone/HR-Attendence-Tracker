import {applyLeave,approveLeave,rejectLeave,getallLeaves,getLeavesByID} from "../controller/leaves.controller.js"
import express from "express"
import {authMiddleware} from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post("/apply",authMiddleware,applyLeave)
router.put("/approve/:id",authMiddleware,approveLeave)
router.put("/reject/:id",authMiddleware,rejectLeave)
router.get("/",authMiddleware,getallLeaves)
router.get("/employee/:employeeId",authMiddleware,getLeavesByID)

export default router;


