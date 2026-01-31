require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./models");

const User = db.User;
const Parent = db.Parent;
const Student = db.Student;
const Class = db.Class;
const Attendance = db.Attendance;

async function seedDatabase() {
  try {
    console.log("=== SEEDING DATABASE ===\n");

    // 1. Create test class
    let testClass = await Class.findOne({ where: { class_name: "Grade 10-A" } });
    if (!testClass) {
      testClass = await Class.create({
        class_name: "Grade 10-A",
        section: "A"
      });
      console.log(" Created class:", testClass.id);
    } else {
      console.log(" Class already exists:", testClass.id);
    }

    // 2. Create student user
    let studentUser = await User.findOne({ where: { email: "student@test.com" } });
    if (!studentUser) {
      const hashedPass = await bcrypt.hash("password123", 10);
      studentUser = await User.create({
        name: "Test Student",
        email: "student@test.com",
        password: hashedPass,
        role_id: 2
      });
      console.log(" Created student user:", studentUser.id);
    } else {
      console.log(" Student user already exists:", studentUser.id);
    }

    // 3. Create student record
    let student = await Student.findOne({ where: { user_id: studentUser.id } });
    if (!student) {
      student = await Student.create({
        user_id: studentUser.id,
        class_id: testClass.id
      });
      console.log(" Created student record:", student.id);
    } else {
      console.log(" Student record already exists:", student.id);
    }

    // 4. Create parent user
    let parentUser = await User.findOne({ where: { email: "parent@test.com" } });
    if (!parentUser) {
      const hashedPass = await bcrypt.hash("password123", 10);
      parentUser = await User.create({
        name: "Test Parent",
        email: "parent@test.com",
        password: hashedPass,
        role_id: 3
      });
      console.log(" Created parent user:", parentUser.id);
    } else {
      console.log(" Parent user already exists:", parentUser.id);
    }

    // 5. Create parent record and link to student
    const QueryTypes = db.Sequelize.QueryTypes;
    let parentRows = await db.sequelize.query(
      'SELECT id, user_id FROM parents WHERE user_id = ? LIMIT 1',
      { replacements: [parentUser.id], type: QueryTypes.SELECT }
    );

    let parentId;
    if (!parentRows || parentRows.length === 0) {
      await db.sequelize.query('INSERT INTO parents (user_id) VALUES (?)', {
        replacements: [parentUser.id]
      });
      parentRows = await db.sequelize.query(
        'SELECT id, user_id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [parentUser.id], type: QueryTypes.SELECT }
      );
      console.log("✓ Created parent record for user_id:", parentUser.id);
    } else {
      console.log("✓ Parent record already exists:", parentRows[0].id);
    }

    parentId = parentRows[0].id;

    // Link parent to student depending on schema
    const qi = db.sequelize.getQueryInterface();
    const parentTableDesc = await qi.describeTable('parents');
    if (parentTableDesc && parentTableDesc.student_id) {
      // update parents.student_id column
      await db.sequelize.query('UPDATE parents SET student_id = ? WHERE id = ?', {
        replacements: [student.id, parentId]
      });
      console.log("✓ Updated parents.student_id for parent:", parentId, '->', student.id);
    } else {
      // fallback to junction table parent_student
      const existingLink = await db.ParentStudent.findOne({ where: { parent_id: parentId, student_id: student.id } });
      if (!existingLink) {
        await db.ParentStudent.create({ parent_id: parentId, student_id: student.id });
        console.log("✓ Linked parent_student:", parentId, student.id);
      } else {
        console.log("✓ parent_student link already exists");
      }
    }

    // 6. Create attendance records
    const existingCount = await Attendance.count({ where: { student_id: student.id } });
    if (existingCount === 0) {
      const records = [];
      const today = new Date();
      
      for (let i = 0; i < 15; i++) {
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
      console.log(" Created 15 attendance records");
    } else {
      console.log(" Attendance records already exist:", existingCount);
    }

    console.log("\n=== SEED COMPLETE ===\n");
    console.log("Test Credentials:");
    console.log("  Parent Email: parent@test.com");
    console.log("  Parent Password: password123");
    console.log("\n  Student Email: student@test.com");
    console.log("  Student Password: password123");
    console.log("\nLogin with parent account to view child attendance!\n");
    
    process.exit(0);

  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();
