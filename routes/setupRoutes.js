const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// SETUP: Create test data
router.post("/create-test-data", async (req, res) => {
  try {
    console.log("=== SETUP ROUTE HIT ===");
    
    const db = require("../models");
    const User = db.User;
    const Parent = db.Parent;
    const Student = db.Student;
    const Class = db.Class;
    const Attendance = db.Attendance;

    // 1. Create a test class
    let testClass = await Class.findOne({ where: { class_name: "Test Class" } });
    if (!testClass) {
      testClass = await Class.create({
        class_name: "Test Class",
        section: "A"
      });
      console.log("Created test class:", testClass.id);
    }

    // 2. Create a test student user
    let studentUser = await User.findOne({ where: { email: "student@test.com" } });
    if (!studentUser) {
      const hashedPass = await bcrypt.hash("password123", 10);
      studentUser = await User.create({
        name: "Test Student",
        email: "student@test.com",
        password: hashedPass,
        role_id: 2
      });
      console.log("Created student user:", studentUser.id);
    }

    // 3. Create a student record
    let student = await Student.findOne({ where: { user_id: studentUser.id } });
    if (!student) {
      student = await Student.create({
        user_id: studentUser.id,
        class_id: testClass.id
      });
      console.log("Created student:", student.id);
    }

    // 4. Create a test parent user
    let parentUser = await User.findOne({ where: { email: "parent@test.com" } });
    if (!parentUser) {
      const hashedPass = await bcrypt.hash("password123", 10);
      parentUser = await User.create({
        name: "Test Parent",
        email: "parent@test.com",
        password: hashedPass,
        role_id: 3
      });
      console.log("Created parent user:", parentUser.id);
    }

    // 5. Create a parent record linked to the student
    let parent = await Parent.findOne({ where: { user_id: parentUser.id } });
    if (!parent) {
      parent = await Parent.create({
        user_id: parentUser.id,
        student_id: student.id
      });
      console.log("Created parent:", parent.id);
    } else if (!parent.student_id) {
      parent.student_id = student.id;
      await parent.save();
      console.log("Updated parent with student_id:", student.id);
    }

    // 6. Create test attendance records
    const attendanceCount = await Attendance.count({ where: { student_id: student.id } });
    if (attendanceCount === 0) {
      const records = [];
      const today = new Date();
      
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        records.push({
          student_id: student.id,
          date: dateStr,
          status: i % 3 === 0 ? "absent" : "present"
        });
      }
      
      await Attendance.bulkCreate(records);
      console.log("Created 10 attendance records for student");
    }

    const attendanceRecords = await Attendance.findAll({ where: { student_id: student.id } });

    res.json({
      message: "Test data created successfully!",
      loginWith: {
        email: "parent@test.com",
        password: "password123"
      },
      testData: {
        student: {
          id: student.id,
          email: studentUser.email
        },
        parent: {
          id: parent.id,
          linkedStudentId: parent.student_id
        },
        attendanceRecords: attendanceRecords.length
      }
    });

  } catch (err) {
    console.error("Setup error:", err);
    res.status(500).json({ 
      message: "Error creating test data",
      error: err.message
    });
  }
});

module.exports = router;
