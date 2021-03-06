const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// get all students in database
router.get('/students', (req, res, next) => {
  Student.find()
         .then(student => {
           console.log(student);
           res.json(student);
         }).catch(err => console.log(err));
});

// add one student to database
router.post('/addstudent', (req, res, next) => {
  const { idNumber, name, testscore1, testscore2, testscore3, img } = req.body;
  const errors = {};
  Student.findOne({ idNumber })
         .then(student => {
           if(student){
             errors.student = 'ID number already exists! Please select a different id.'
             return res.status(400).json(errors)
           }
           console.log(idNumber);
           const newStudent = new Student({ idNumber, name, testscore1, testscore2, testscore3, img });
           newStudent.save();
           res.json({ student: 'Student added to grade book!', user: { idNumber, name, testscore1, testscore2, testscore3 } });
         }).catch(err => console.log(err));
});

// find one student by name
router.post('/findstudentbyname', (req, res, next) => {
  const { name } = req.body;
  const errors = {};
  Student.findOne({ name })
         .then(student => {
           if(student){
             return res.json(student)
           }
           errors.student = 'Student does not exist'
           res.status(404).json(errors);
         }).catch(err => console.log(err));
});

// find one student by id
router.post('/findstudentbyid', (req, res, next) => {
  const { idNumber } = req.body;
  const errors = {};
  Student.findOne({ idNumber })
         .then(student => {
           console.log(student);
           if(student){
             return res.json(student)
           }
           errors.student = 'Student does not exist'
           res.status(404).json(errors);
         }).catch(err => console.log(err));
});

//remove student from database
router.delete('/removeStudent', (req, res, next) => {
  const { name, id } = req.body;
  Student.findOneAndDelete({ _id: id })
         .then(user => {
           res.json({ student: `${user.name} has been removed from the gradebook`})
         }).catch(err => console.log(err))
})

module.exports = router;
