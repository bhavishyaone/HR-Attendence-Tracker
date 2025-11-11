import prisma from "../db.js"
import bcrypt from "bcrypt"

// Create employee 

const createEmployee = async(req,res)=>{

    try{
        const {name,email,password,role,departmentId} = req.body

    const existingmail = await prisma.employee.findUnique({
        where:{email:email}
    })

    if(existingmail){
        return res.status(400).json({message:"Email alredy existed."})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const employee = await prisma.employee.create({
        data:{
            name,
            email,
            password:hashedPassword,
            role,
            departmentId
        }
    })

    return res.status(201).json({message:"Employee create successfully",employee})
    
    }   

    catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
    }


}


// Get All the Employee

const getAllEmployee = async (req,res)=>{
    try{
        const allEmployee = await prisma.employee.findMany({
            include:{
                department:true
            }
        })

        return res.status(200).json(allEmployee)
    }

    catch(error){
            console.log(error)
            return res.status(500).json({ message: "Server Error" });
    }
}


// Get Employe by ID 

const getEmployeebyId = async (req,res)=>{
    try{
        const {id} = req.params;

        const employee = await prisma.employee.findUnique({
            where:{id:Number(id)},
            include:{department:true}

        });

        if(!employee){
            return res.status(404).json({message:"Employee not found."})
        }

        return res.status(200).json(employee)

    }

    catch(error){
        console.log("Error:", error)
        return res.status(500).json({message:"Server error", error: error.message})

    }
}

// Update the Employee

const updateEmployee = async (req,res)=>{

    try{

        const {id} = req.params
        const {name,email,role,departmentId} = req.body

        const updated = await prisma.employee.update({
            where:{id:Number(id)},
            data:{
                name,
                email,
                role,
                departmentId
            }
        });

        return res.status(200).json({message:"Employee Updated Succesfully",employee:updated})

    }

    catch(error){
        console.log(error)
        res.status(500).json({message:"Server Error"})

    }
};


// delete Employee


const deleteEmployee = async (req,res)=>{
    try{
        const {id} =req.params
        const {name,email,role,departmentId}=req.body

        const deletee = await prisma.employee.delete({
            where:{id:Number(id)}

        })

        return res.status(200).json({message:"Employee Deleted Succesfully."})
    }

    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server Error"})

    }
};



// Assign Department
// Iska code Department table banane ke baad likhnege 



export {createEmployee,getAllEmployee,getEmployeebyId,updateEmployee,deleteEmployee};