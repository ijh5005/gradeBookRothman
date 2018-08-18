const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// get all students in database
router.get('/students', (req, res, next) => {
  Student.find()
         .then(student => {
           res.json(student);
         }).catch(err => console.log(err));
});

// add one student to database
router.post('/addstudent', (req, res, next) => {
  const { name, testscore1, testscore2, testscore3, img } = req.body;
  const errors = {};
  Student.findOne({ name })
         .then(student => {
           if(student){
             errors.student = 'Student already exists! Please select a different name.'
             return res.status(400).json(errors)
           }
           const newStudent = new Student({ name, testscore1, testscore2, testscore3, img });
           newStudent.save();
           res.json({ student: 'Student added to grade book!', user: { name, testscore1, testscore2, testscore3 } });
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
  const { id } = req.body;
  const errors = {};
  Student.findOne({ _id: id })
         .then(student => {
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
