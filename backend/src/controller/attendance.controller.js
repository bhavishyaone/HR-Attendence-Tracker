import prisma from "../db.js"


// Check IN Code 
const checkIN = async (req,res)=>{

    try{
        const {employeeId} =req.body
        const today = new Date();
        const dateOnly = new Date(today.toISOString().split("T")[0])

        const existing = await prisma.attendance.findUnique({
            where:{employeeId_date:{
                employeeId:Number(employeeId),
                date:dateOnly
            }}
        });
        if(existing){
            return res.status(400).json({message:"Attendance for today is already marked."})
        }

        const checkInTime = new Date()
        const hours = checkInTime.getHours()

        const attendance = await prisma.attendance.create({
            data:{
                employeeId:Number(employeeId),
                date:dateOnly,
                checkInTime,
                status:"PRESENT"

            }
        })

        return res.status(200).json({message:"Check in Succesfully.",attendance})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server Error."})

    }
}


// Check Out Code

const checkOut = async (req,res)=>{

    try{
        const {id} =req.body

        const attendance = await prisma.attendance.findUnique({
            where:{id:Number(id)}
        })

        if(!attendance){
            return res.status(404).json({message:"attende not found."})
        }

        if (attendance.checkOutTime){
            return res.status(400).json({message:"Person already checked out."})
        }

        if (!attendance.checkInTime){
            return res.status(400).json({message:"Person is not checked in."})
        };

        const checkOutTime = new Date();
        const checkInTime = new Date(attendance.checkInTime)
        const milliseconds = checkOutTime - checkInTime
        const hours = milliseconds/(1000*60*60)
        const totalHours = Number(hours.toFixed(2))
         const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOutTime,
                totalHours,
            },
            });
        
        return res.status(200).json({message:"Checked out successfully.", attendance:updated})
    
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server Error."})

    }
}


// Get AllAttendance

const getAllAttendance = async(req,res)=>{
    try{
        const allAttendance = await prisma.attendance.findMany({
            include:{
                employee:{
                    include:{
                        department:true
                    }
                }
            }
        })

        return res.status(200).json(allAttendance)

    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server Error."})

    }
}



// get Attendece For Employee

const getattendancebyId = async (req,res)=>{
    try{
        const {employeeId} = req.params
        
        const data = await prisma.attendance.findMany({
            where:{employeeId:Number(employeeId)},
            include:{employee:true}
        })
        res.status(200).json(data)


    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server Error."})
    }

}

export {checkIN,checkOut,getAllAttendance,getattendancebyId}

   