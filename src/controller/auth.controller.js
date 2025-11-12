import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../db.js"


// Register Route

const register  = async (req,res)=>{

    try{
        const {name,email,password,role,departmentId}=req.body;

        const existing = await prisma.employee.findUnique({
            where:{email:email}
        })

        if (existing){
            return res.status(400).json({message:"User alreadyy exists."})
        }

        const hashedPassword = await bcrypt.hash(password,10)


        const addEmployee = await prisma.employee.create({
            data:{
                name,
                email,
                password:hashedPassword,
                role,departmentId

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
        return res.status(400).json({message:"Invliad email or password"})
    }
    
    const Match = await bcrypt.compare(password,employee.password)

    if(!Match){
        return res.status(400).json({message:"Invliad email or password"})
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