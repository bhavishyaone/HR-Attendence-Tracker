import prisma from "../db.js"


// Apply for leave


const applyLeave = async(req,res)=>{
    try{
        const {employeeId,startDate,endDate,reason} = req.body

        
        if(!employeeId || !startDate || !endDate){
            return res.status(400).json({message:"Required Data is missing."})
        }

        const apply = await prisma.leave.create({
            data:{
                employeeId:Number(employeeId),
                startDate:new Date(startDate),
                endDate:new Date(endDate),
                reason,
                status:"PENDING"
            }
        });

        return res.status(201).json({message:"Applied for Leave Successfully.",apply})

    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server Error."})

    }
};

// Approve Leave (Only by HR/ADMIN)

const approveLeave = async(req,res)=>{
    try{
        // const {employeeId,startDate,endDate} = req.body
        const {employeeId,startDate,endDate,reason} = req.body

        const {id} = req.params

        const approved = await prisma.leave.update({
            where:{id:Number(id)},
            data:{
                employeeId:Number(employeeId),
                startDate: new Date(startDate),
                endDate:new Date(endDate),
                reason,
                status:"APPROVED"
            }
        });

        return res.status(200).json({message:"Leave approved Successfully.",approved})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"server error."})
    }
};

// Reject Leave (Only by HR/ADMIN)


const rejectLeave = async(req,res)=>{
    try{
        // const {employeeId,startDate,endDate} = req.body
        const {employeeId,startDate,endDate,reason} = req.body

        const {id} = req.params

        const rejected = await prisma.leave.update({
            where:{id:Number(id)},
            data:{
                employeeId:Number(employeeId),
                startDate: new Date(startDate),
                endDate:new Date(endDate),
                reason,
                status:"REJECTED"
            }
        });

        return res.status(200).json({message:"Leave rejected Successfully.",rejected})
        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"server error."})
    }
};


// Get All Leave



const  getallLeaves = async(req,res)=>{
    try{
        // const {employeeId,startDate,endDate} = req.body
        const {employeeId,startDate,endDate,reason} = req.body


        const allleaves = await prisma.leave.findMany({
            include:{employee:true}
        })
        return res.status(200).json({message:"All leaves fetched successfully.",allleaves})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"server error."})

    }
};



// get leaves by ID



const  getLeavesByID = async(req,res)=>{
    try{
        // const {employeeId,startDate,endDate} = req.body
        const {employeeId} = req.params


        const leave = await prisma.leave.findMany({
            where:{employeeId:Number(employeeId)},
            include:{employee:true}
        })
        return res.status(200).json({message:"Here is leave by your id.",leave})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"server error."})

    }
};


export {applyLeave,approveLeave,rejectLeave,getallLeaves,getLeavesByID};

