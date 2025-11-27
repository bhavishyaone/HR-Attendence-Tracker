import prisma from "../db.js";

export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, year, month, baseSalary } = req.body;

    if (!employeeId || !year || !month || !baseSalary) {
      return res.status(400).json({
        message: "employeeId, year, month, baseSalary are required"
      });
    }

    const exists = await prisma.payroll.findUnique({
      where: {
        employeeId_year_month: {
          employeeId: Number(employeeId),
          year: Number(year),
          month: Number(month)
        }
      }
    });

    if (exists) {
      return res.status(400).json({
        message: "Payroll already generated for this month",
        payroll: exists
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId: Number(employeeId),
        date: {
          gte: start,
          lt: end
        },
        status: { in: ["PRESENT", "HALF_DAY"] }
      }
    });

    let daysPresent = 0;

    attendance.forEach(a => {
      if (a.status === "PRESENT") daysPresent += 1;
      else if (a.status === "HALF_DAY") daysPresent += 0.5;
    });

    daysPresent = Math.round(daysPresent);

    const approvedLeaves = await prisma.leave.findMany({
      where: {
        employeeId: Number(employeeId),
        status: "APPROVED",
        OR: [
          {
            startDate: { gte: start, lt: end }
          },
          {
            endDate: { gte: start, lt: end }
          }
        ]
      }
    });

    let leaveDays = 0;

    approvedLeaves.forEach(l => {
      const s = new Date(l.startDate);
      const e = new Date(l.endDate);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      leaveDays += diff;
    });

    const salary = Number(baseSalary);
    const perDay = salary / 30;
    const deductions = +(perDay * leaveDays).toFixed(2);
    const netSalary = +(salary - deductions).toFixed(2);

    const payroll = await prisma.payroll.create({
      data: {
        employeeId: Number(employeeId),
        year: Number(year),
        month: Number(month),
        baseSalary: salary,
        daysPresent,
        deductions,
        netSalary
      }
    });

    return res.status(201).json({
      message: "Payroll generated successfully",
      payroll
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: { employee: true }
    });

    return res.status(200).json(payrolls);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const getPayrollByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const payrolls = await prisma.payroll.findMany({
      where: { employeeId: Number(employeeId) },
      include: { employee: true },
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ]
    });

    return res.status(200).json(payrolls);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await prisma.payroll.findUnique({
      where: { id: Number(id) },
      include: { employee: true }
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    return res.status(200).json(payroll);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
