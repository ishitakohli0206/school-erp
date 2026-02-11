const { AdmissionEnquiry, Teacher, Notice } = require("../models");

exports.getPublicOverview = async (req, res) => {
  try {
    const [teacherCount, noticeCount] = await Promise.all([
      Teacher.count(),
      Notice.count()
    ]);

    return res.json({
      school: {
        name: "School ERP Public Portal",
        vision: "Build future-ready learners with strong values and practical skills.",
        mission: "Deliver quality academics, transparent communication, and holistic development."
      },
      highlights: {
        facultyCount: teacherCount,
        activeAnnouncements: noticeCount
      }
    });
  } catch (error) {
    console.error("getPublicOverview error:", error);
    return res.status(500).json({ message: "Failed to load school website data" });
  }
};

exports.createAdmissionEnquiry = async (req, res) => {
  try {
    const { parent_name, email, phone, student_name, class_interested, message } = req.body;
    if (!parent_name || !email || !phone || !student_name || !class_interested) {
      return res.status(400).json({
        message: "parent_name, email, phone, student_name and class_interested are required"
      });
    }

    const enquiry = await AdmissionEnquiry.create({
      parent_name,
      email,
      phone,
      student_name,
      class_interested,
      message: message || null
    });

    return res.status(201).json(enquiry);
  } catch (error) {
    console.error("createAdmissionEnquiry error:", error);
    return res.status(500).json({ message: "Failed to submit admission enquiry" });
  }
};
