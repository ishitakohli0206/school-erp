import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicOverview, submitAdmissionEnquiry } from "../services/erpService";
import "./PublicWebsite.css";

const initialForm = {
  parent_name: "",
  email: "",
  phone: "",
  student_name: "",
  class_interested: "",
  message: ""
};

const PublicWebsite = () => {
  const [overview, setOverview] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getPublicOverview()
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(null));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsSubmitting(true);
    try {
      await submitAdmissionEnquiry(form);
      setStatus("success|Admission enquiry submitted successfully. Our team will contact you soon.");
      setForm(initialForm);
    } catch (err) {
      setStatus("error|" + (err.response?.data?.message || "Failed to submit admission enquiry. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="public-page">
      {/* Navigation */}
      <nav className="public-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="nav-logo-icon">🎓</div>
            <span className="nav-logo-text">{overview?.school?.name || "School ERP"}</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
            <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollToSection('courses'); }}>Courses</a></li>
            <li><a href="#faculty" onClick={(e) => { e.preventDefault(); scrollToSection('faculty'); }}>Faculty</a></li>
            <li><a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Events</a></li>
            <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
            <li><Link to="/login" className="nav-cta">Login to ERP</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{overview?.school?.name || "Welcome to Our School"}</h1>
          <p className="hero-subtitle">
            Nurturing excellence through quality education. Join us in shaping the leaders of tomorrow with our comprehensive academic programs and state-of-the-art facilities.
          </p>
          <div className="hero-buttons">
            <a href="#admission" className="btn-hero-primary" onClick={(e) => { e.preventDefault(); scrollToSection('admission'); }}>
              Apply Now
            </a>
            <a href="#about" className="btn-hero-secondary" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section vision-mission">
        <div className="vision-mission-grid">
          <div className="vm-card">
            <div className="vm-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>{overview?.school?.vision || "To provide quality education that empowers students to become responsible, innovative, and compassionate leaders who contribute meaningfully to society."}</p>
          </div>
          <div className="vm-card">
            <div className="vm-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>{overview?.school?.mission || "To foster academic excellence, holistic development, and moral values in a supportive learning environment that prepares students for the challenges of the future."}</p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">We provide a comprehensive educational experience that nurtures all aspects of student development</p>
        </div>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon">👨‍🏫</div>
            <h4>Expert Faculty</h4>
            <p>Experienced and qualified teachers dedicated to student success</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🏫</div>
            <h4>Modern Infrastructure</h4>
            <p>State-of-the-art classrooms and facilities</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">💻</div>
            <h4>Digital Learning</h4>
            <p>Smart classrooms with advanced technology integration</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🏃</div>
            <h4>Sports & Activities</h4>
            <p>Comprehensive sports and extracurricular programs</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="about-grid">
          <div className="about-content">
            <h3>About Our School</h3>
            <p>
              We are committed to providing a nurturing environment where every student can discover their potential and excel academically. Our holistic approach to education combines rigorous academics with character development.
            </p>
            <p>
              With a focus on innovation and traditional values, we prepare our students to become confident, creative, and compassionate individuals ready to make a positive impact in the world.
            </p>
            <div className="about-features">
              <div className="about-feature"><span>✓</span> Smart Classrooms</div>
              <div className="about-feature"><span>✓</span> Science Labs</div>
              <div className="about-feature"><span>✓</span> Computer Labs</div>
              <div className="about-feature"><span>✓</span> Library</div>
              <div className="about-feature"><span>✓</span> Sports Ground</div>
              <div className="about-feature"><span>✓</span> Secure Campus</div>
            </div>
          </div>
          <div className="about-image">
            🏫 School Campus Image
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="section">
        <div className="section-header">
          <h2 className="section-title">Academic Programs</h2>
          <p className="section-subtitle">We offer comprehensive educational programs from primary to senior secondary level</p>
        </div>
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-header">
              <h4>Primary School</h4>
              <span>Classes I - V</span>
            </div>
            <div className="course-body">
              <p>Foundation years focusing on basic literacy, numeracy, and holistic development through interactive learning methods.</p>
            </div>
          </div>
          <div className="course-card">
            <div className="course-header">
              <h4>Middle School</h4>
              <span>Classes VI - VIII</span>
            </div>
            <div className="course-body">
              <p>Building core concepts with emphasis on critical thinking, problem-solving, and exploration of subjects.</p>
            </div>
          </div>
          <div className="course-card">
            <div className="course-header">
              <h4>High School</h4>
              <span>Classes IX - X</span>
            </div>
            <div className="course-body">
              <p>Comprehensive preparation for board examinations with focus on conceptual understanding and exam excellence.</p>
            </div>
          </div>
          <div className="course-card">
            <div className="course-header">
              <h4>Senior Secondary</h4>
              <span>Classes XI - XII</span>
            </div>
            <div className="course-body">
              <p>Science, Commerce, and Humanities streams with expert guidance for competitive exams and career planning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section id="faculty" className="section faculty-section">
        <div className="section-header">
          <h2 className="section-title">Our Faculty</h2>
          <p className="section-subtitle">Meet our team of experienced and dedicated educators</p>
        </div>
        <div className="faculty-grid">
          <div className="faculty-card">
            <div className="faculty-avatar">👤</div>
            <h4>Experienced Teachers</h4>
            <p className="designation">Subject Experts</p>
            <p className="department">All Departments</p>
          </div>
          <div className="faculty-card">
            <div className="faculty-avatar">👤</div>
            <h4>Class Mentors</h4>
            <p className="designation">Guidance Counselors</p>
            <p className="department">Student Support</p>
          </div>
          <div className="faculty-card">
            <div className="faculty-avatar">👤</div>
            <h4>Specialists</h4>
            <p className="designation">Subject Specialists</p>
            <p className="department">Science & Math</p>
          </div>
          <div className="faculty-card">
            <div className="faculty-avatar">👤</div>
            <h4>Support Staff</h4>
            <p className="designation">Administrative</p>
            <p className="department">Office & Admin</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="section events-section">
        <div className="section-header">
          <h2 className="section-title">Events & Announcements</h2>
          <p className="section-subtitle">Stay updated with our latest events and important notices</p>
        </div>
        <div className="events-list">
          <div className="event-item">
            <div className="event-date">
              <div className="month">JAN</div>
              <div className="day">15</div>
            </div>
            <div className="event-content">
              <h4>Annual Day Celebration</h4>
              <p>Join us for our annual day celebration featuring cultural performances and awards ceremony.</p>
            </div>
          </div>
          <div className="event-item">
            <div className="event-date">
              <div className="month">FEB</div>
              <div className="day">01</div>
            </div>
            <div className="event-content">
              <h4>Parent-Teacher Meeting</h4>
              <p>Quarterly PTM to discuss student progress and academic performance.</p>
            </div>
          </div>
          <div className="event-item">
            <div className="event-date">
              <div className="month">MAR</div>
              <div className="day">20</div>
            </div>
            <div className="event-content">
              <h4>Annual Examination</h4>
              <p>Final term examinations for all classes. Parents are requested to ensure proper preparation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section">
        <div className="section-header">
          <h2 className="section-title">Photo Gallery</h2>
          <p className="section-subtitle">Glimpses of our campus life and activities</p>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item">📷 Classroom Activities</div>
          <div className="gallery-item">📷 Sports Day</div>
          <div className="gallery-item">📷 Science Fair</div>
          <div className="gallery-item">📷 Annual Day</div>
          <div className="gallery-item">📷 Art & Craft</div>
          <div className="gallery-item">📷 Library</div>
          <div className="gallery-item">📷 Labs</div>
          <div className="gallery-item">📷 Events</div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch with us for any queries or information</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h4>Address</h4>
                <p>School Campus, Education Road,<br />City, State - PIN Code</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+91-XXXXXXXXXX</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <h4>Email</h4>
                <p>school@example.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <div>
                <h4>Office Hours</h4>
                <p>Monday - Saturday: 8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
          <div className="contact-map">
            🗺️ Map Placeholder 
          </div>
        </div>
      </section>

      {/* Admission Enquiry Section */}
      <section id="admission" className="section admission-section">
        <div className="section-header">
          <h2 className="section-title">Admission Enquiry</h2>
          <p className="section-subtitle">Fill out the form below and our team will contact you</p>
        </div>
        <div className="admission-container">
          <h3>Apply for Admission</h3>
          <p className="form-subtitle">We welcome you to join our academic community</p>
          
          {status && (
            <div className={`form-status ${status.split('|')[0]}`}>
              {status.split('|')[1]}
            </div>
          )}
          
          <form className="admission-form" onSubmit={handleSubmit}>
            <div className="form-group-full">
              <label>Parent Name *</label>
              <input 
                type="text" 
                placeholder="Enter parent/guardian name"
                value={form.parent_name}
                onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group-full">
              <label>Email Address *</label>
              <input 
                type="email" 
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group-full">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group-full">
              <label>Student Name *</label>
              <input 
                type="text" 
                placeholder="Enter student name"
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group-full">
              <label>Class Interested *</label>
              <input 
                type="text" 
                placeholder="Enter class/grade"
                value={form.class_interested}
                onChange={(e) => setForm({ ...form, class_interested: e.target.value })}
                required
              />
            </div>
            <div className="form-group-full">
              <label>Message (Optional)</label>
              <textarea 
                placeholder="Any additional information or questions"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>{overview?.school?.name || "School ERP"}</h3>
            <p>
              Committed to providing quality education and nurturing the leaders of tomorrow. 
              Join us in our mission to transform education.
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Us</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollToSection('courses'); }}>Academics</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Resources</h4>
            <ul>
              <li><a href="#events">Events</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#faculty">Faculty</a></li>
              <li><Link to="/login">ERP Login</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li><a href="#contact">Get in Touch</a></li>
              <li><a href="#admission">Admission</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {overview?.school?.name || "School ERP"}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;
