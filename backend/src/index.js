import express from "express";
import authRoute from "./routes/auth.route.js";
import employeeRoutes from "./routes/employee.route.js";
import departmentRoutes from "./routes/department.route.js"
import attendenceRoutes from "./routes/attendence.route.js"
import leavesRoutes from "./routes/leaves.route.js"
import payrollRoutes from "./routes/payrolls.route.js"

const app = express();
const port = 3000;

app.use(express.json())

app.use("/auth", authRoute);
app.use("/employees", employeeRoutes)
app.use("/departments", departmentRoutes)
app.use("/attendence",attendenceRoutes)
app.use("/leaves",leavesRoutes)
app.use("/payroll", payrollRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});
