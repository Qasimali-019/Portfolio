import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Import your admin components
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public site */}
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-white dark:bg-dark-900 text-gray-900 dark:text-white transition-colors duration-300">
                <Header />
                <motion.main
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Hero />
                  <About />
                  <Projects />
                  <Skills />
                  <Experience />
                  <Contact />
                </motion.main>
                <Footer />
              </div>
            }
          />
          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              token ? (
                <AdminDashboard />
              ) : (
                <AdminLogin onLogin={setToken} />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;