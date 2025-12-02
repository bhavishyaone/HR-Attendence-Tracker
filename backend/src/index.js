import express from "express";
import authRoute from "./routes/auth.route.js";
import employeeRoutes from "./routes/employee.route.js";
import departmentRoutes from "./routes/department.route.js"
import attendanceRoutes from "./routes/attendance.route.js"
import leavesRoutes from "./routes/leaves.route.js"
import payrollRoutes from "./routes/payrolls.route.js"

import cors from "cors";

const app = express();
const port = 3000;

app.use(cors({
    origin: ["http://localhost:5173", "https://hr-attendence-tracker-git-main-fuvs-projects.vercel.app"],
    credentials: true
}));
app.use(express.json())

app.use("/auth", authRoute);
app.use("/employees", employeeRoutes)
app.use("/departments", departmentRoutes)
app.use("/attendance",attendanceRoutes)
app.use("/leaves",leavesRoutes)
app.use("/payrolls", payrollRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});
