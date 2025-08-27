import { useState } from "react";
import { motion } from "framer-motion";
import ProjectsAdmin from "./ProjectsAdmin";
import SkillsAdmin from "./SkillsAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import AboutAdmin from "./AboutAdmin";
import HeroAdmin from "./HeroAdmin";
import FooterAdmin from "./FooterAdmin";
import ContactAdmin from "./ContactAdmin";
import ResumeAdmin from "./ResumeAdmin";

const sections = [
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "about", label: "About" },
  { key: "hero", label: "Hero" },
  { key: "footer", label: "Footer" },
  { key: "contact", label: "Contact" },
  { key: "resume", label: "Resume" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState("projects");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-inter text-white flex flex-col items-center py-10 px-2 relative">
      {/* Logout Button - fixed top right */}
      <div className="fixed top-6 right-8 z-50">
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
            bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#0F172A]
            border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 tracking-wide"
        >
          Logout
        </button>
      </div>
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-3 mb-10 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-lime-400/20 p-3 rounded-2xl shadow-lg backdrop-blur-md mt-4"
      >
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`px-5 py-2 rounded-xl font-fira text-lg transition-all
              ${
                section === s.key
                  ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#0F172A] shadow-lg scale-105"
                  : "bg-[#1e293b]/60 text-cyan-200 hover:bg-cyan-400/30 hover:text-lime-300"
              }
            `}
          >
            {s.label}
          </button>
        ))}
      </motion.nav>
      {/* Section Content */}
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        {section === "projects" && <ProjectsAdmin />}
        {section === "skills" && <SkillsAdmin />}
        {section === "experience" && <ExperienceAdmin />}
        {section === "about" && <AboutAdmin />}
        {section === "hero" && <HeroAdmin />}
        {section === "footer" && <FooterAdmin />}
        {section === "contact" && <ContactAdmin />}
        {section === "resume" && <ResumeAdmin />}
      </motion.div>
    </div>
  );
}