import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import AdminLogin from './pages/Login/AdminLogin.jsx'
import Register from './pages/Register/Register.jsx'
import Browse from './pages/Browse/Browse.jsx'
import Companies from './pages/Companies/Companies.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import StudentDashboard from './pages/StudentDashboard/StudentDashboard.jsx'
import CompanyDashboard from './pages/CompanyDashboard/CompanyDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx'
import About from './pages/About/About.jsx'
import Contact from './pages/Contact/Contact.jsx'
import Chatbot from './components/Chatbot/Chatbot.jsx'
import { Toaster } from 'react-hot-toast'
import Preloader from './components/Preloader/Preloader.jsx'
import { useState, useEffect } from 'react'

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds for a professional feel

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {loading && <Preloader />}

      <Toaster position="top-right" reverseOrder={false} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <Navbar />
        <main style={{ flex: 1, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route 
              path="/student-dashboard/*" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company-dashboard/*" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  )
}

export default App
