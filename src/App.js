import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Landing Page components
import Navbar from "./components/LandingPage/Navbar";
import Carousel from "./components/LandingPage/Carousel";
import AboutUs from "./components/LandingPage/AboutUs";
import AnimatedCounter from "./components/LandingPage/AnimatedCounter";
import FAQ from "./components/LandingPage/FAQ";
import HiringProcess from "./components/LandingPage/HiringProcess";
import LoginPage from "./components/LandingPage/LoginPage";
import Footer from "./components/LandingPage/Footer";

// Import Main App components
import Dashboard from "./components/Layout/Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import Students from "./components/MainContent/Students";
import StudentList from "./components/MainContent/StudentList";
import AddTPO from "./components/MainContent/AddTPO";
import AddJob from "./components/MainContent/AddJob";
import TPOList from "./components/MainContent/TPOList";
import JobList from "./components/MainContent/JobList";
import JobDetails from "./components/MainContent/JobDetails";
import StudentProfile from "./components/MainContent/StudentProfile";
import TPOProfile from "./components/MainContent/TPOProfile";
import AppliedJobs from "./components/MainContent/AppliedJobs";
import EditJob from "./components/MainContent/EditJob";
import AdminAcademicManagement from "./components/MainContent/AdminAcademicManagement";
import ExpiredJobs from "./components/MainContent/ExpiredJobs";
import AppliedCandidates from "./components/MainContent/AppliedCandidates";
import NotificationSender from "./components/MainContent/NotificationSender";
import NotificationViewer from "./components/MainContent/NotificationViewer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Carousel />
              <AboutUs />
              <AnimatedCounter />
              <HiringProcess />
              <FAQ />
              <Footer />
            </>
          }
        />
<Route path="/academy" element={<AdminAcademicManagement/>} />
        {/* Login page route */}
        <Route path="/login/:role" element={
          <><Navbar/><LoginPage /></>} />

        {/* Main App Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<AdminAcademicManagement />} />
          <Route path="students" element={<Students />} />
          <Route path="studentlist" element={<StudentList />} />
          <Route path="Addtpo" element={<AddTPO />} />
          <Route path="Addjob" element={<AddJob />} />
          <Route path="TPOList" element={<TPOList />} />
          <Route path="JobList" element={<JobList />} />
          <Route path="job-details/:jobId" element={<JobDetails />} />
          <Route path="StudentProfile" element={<StudentProfile />} />
          <Route path="TPOProfile" element={<TPOProfile />} />
          <Route path="Notificationsender" element={<NotificationSender />} />
          <Route path="Notificationviewer" element={<NotificationViewer />} />
          <Route path="appliedjobs" element={<AppliedJobs />} />
          <Route path="edit-job/:jobId" element={<EditJob />} />
          <Route path="appliedcandidates" element={<AppliedCandidates />} />
          <Route path="expired-jobs" element={<ExpiredJobs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
