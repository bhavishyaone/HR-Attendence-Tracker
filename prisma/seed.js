import bcrypt from "bcrypt";
import prisma from "../src/db.js";

const seedDatabase = async () => {
  try {

    await prisma.department.createMany({
      data: [
        { name: "HR", description: "Human Resource Department" },
        { name: "IT", description: "Information Technology" },
        { name: "Marketing and Sales", description: "Marketing and Sales Department" },
      ],
    });

    const admin1_Password = await bcrypt.hash("admin123", 10);
    const emp1_Password = await bcrypt.hash("emp123", 10);
    const emp2_Password = await bcrypt.hash("emp234", 10);

    await prisma.employee.create({
      data: {
        name: "Vinayak",
        email: "vinayak23@gmail.com",
        role: "EMPLOYEE",
        password: emp1_Password,
        isActive: true,
        departmentId: 1,
      },
    });

    await prisma.employee.create({
      data: {
        name: "Kshitij",
        email: "kshitij123@gmail.com",
        role: "EMPLOYEE",
        password: emp2_Password,
        isActive: true,
        departmentId: 2,
      },
    });

    await prisma.employee.create({
      data: {
        name: "Shubhi",
        email: "shubhi@gmail.com",
        role: "ADMIN",
        password: admin1_Password,
        isActive: true,
      },
    });

    console.log(" Database seeded successfully.");
  } 
  catch (error) {
    console.error(error);
    console.log("error in seeding")
  } 
  finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
