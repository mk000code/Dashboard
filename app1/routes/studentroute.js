const express=require('express');
const router=express.Router();
const Student=require('../models/studentModel');
const checkrole=require('../middleware/checkrole');
const authMiddleware=require('../middleware/authMiddleware');
router.use(express.json());
router.use(authMiddleware);

router.get('/',checkrole('admin', 'teacher', 'student'),async(req,res)=>{
   
    try{
    const students = await Student.find();
    return res.status(200).json(students);

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})

router.post('/',checkrole('admin', 'teacher'),async(req,res)=>{

  try{
 const newStudent= await Student.create({ 
    studentId: req.body.studentId,
    name:req.body.name,
    age:req.body.age,
    course:req.body.course,
    cgpa:req.body.cgpa
   })

 

    res.status(201).json({
        message:"New Student Added",
        newStudent:newStudent
    })
  }
  catch(error){
        res.status(error.name === 'ValidationError' || error.code === 11000 ? 400 : 500).json({
            message:error.message
        })
    }
})

// Update an existing student
router.put('/:id', checkrole('admin', 'teacher'), async (req, res) => {
    try {
        const { studentId, name, age, course, cgpa } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { studentId, name, age, course, cgpa },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student updated successfully', student });
    } catch (error) {
        return res.status(error.name === 'ValidationError' || error.code === 11000 ? 400 : 500).json({
            message: error.message
        });
    }
});

router.post('/bulk',checkrole('admin', 'teacher'), async (req, res) => {
    try {

        const students = await Student.insertMany(req.body);

        res.status(201).json({
            message: "Students added successfully",
            count: students.length,
            students
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// DELETE ALL STUDENTS
router.delete('/delete-all',checkrole('admin'), async (req, res) => {
    try {
        const result = await Student.deleteMany({});

        res.status(200).json({
            message: "All students deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.delete('/:id',checkrole('admin'),async (req,res)=>{
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({
            message: 'Deleted successfully',
            deletedStudent: student
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid student ID' });
    }
})
module.exports = router;
