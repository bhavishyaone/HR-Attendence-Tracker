import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../db.js"


// Register Route

const register  = async (req,res)=>{

    try{
        const {name,email,password,role,department}=req.body;

        const existing = await prisma.employee.findUnique({
            where:{email:email}
        })

        if (existing){
            return res.status(400).json({message:"User alreadyy exists."})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        let departmentId = null;
        if (department) {
            const dept = await prisma.department.findUnique({
                where: { name: department }
            });
            if (dept) {
                departmentId = dept.id;
            } else {
                // Optional: Create department if it doesn't exist, or return error.
                // For now, let's return an error to be safe.
                return res.status(400).json({ message: "Invalid department selected." });
            }
        }

        const addEmployee = await prisma.employee.create({
            data:{
                name,
                email,
                password:hashedPassword,
                role: role.toUpperCase(), // Ensure role matches enum
                departmentId
            }
        });

        return res.status(201).json({message:"Employee added successflly.",
            addEmployee,
        })
    
    }



    catch(error){
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
}



// Login Route


const Login = async(req,res)=>{

   try{
    const {email,password} =req.body

    const employee = await prisma.employee.findUnique({
        where:{email}
    })

    if(!employee){
        return res.status(404).json({message:"User not found"})
    }
    
    const Match = await bcrypt.compare(password,employee.password)

    if(!Match){
        return res.status(401).json({message:"Incorrect password"})
    }


    const token = jwt.sign(
        {id:employee.id,role:employee.role},
        "secret_key",
        {expiresIn:"1d"}
    )

    return res.json({
        message:"Login Successfully",
        token,
        employee
    })

    }

   catch(error){
    console.log(error)
    return res.status(401).json({message:"Invalid Json"})

   }
   
}

export { register, Login };