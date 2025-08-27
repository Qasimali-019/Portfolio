import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';

type Experience = {
  end_date: string;
  start_date: string;
  id: number;
  type: string; // 'work' or 'education'
  title: string;
  company: string;
  location: string;
  period: string; // e.g. "Jun 2024 - Present"
  description: string;
  achievements: string[];
};

type Certification = {
  id: number;
  name: string;
  issuer: string;
  year: string;
};


const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/certifications")
    .then(res => res.json())
    .then(data => setCerts(Array.isArray(data) ? data : []));
}, []);


  useEffect(() => {
    fetch("http://localhost:5000/api/experience")
      .then(res => res.json())
      .then(data => {
        // If your backend returns achievements as a JSON string, parse it:
        const parsed = Array.isArray(data)
          ? data.map((exp) => ({
              ...exp,
              achievements: Array.isArray(exp.achievements)
                ? exp.achievements
                : exp.achievements
                ? JSON.parse(exp.achievements)
                : [],
            }))
          : [];
        setExperiences(parsed);
      });
  }, []);
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

const [sectionContent, setSectionContent] = useState({ title: "", subtitle: "" });

useEffect(() => {
  fetch("http://localhost:5000/api/experience-content")
    .then(res => res.json())
    .then(data => setSectionContent({
      title: data?.title || "Experience & Education",
      subtitle: data?.subtitle || "My journey in technology and continuous learning"
    }));
}, []);

  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
           <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 dark:text-white mb-4">
    {sectionContent.title}
  </h2>
           <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
    {sectionContent.subtitle}
  </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500 to-accent-500" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-dark-900 border-4 border-primary-500 rounded-full z-10" />

                {/* Content */}
                <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-colors shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex items-center p-3 rounded-full ${
                        exp.type === 'work' 
                          ? 'bg-primary-500/20 text-primary-500' 
                          : 'bg-accent-500/20 text-accent-500'
                      }`}>
                        {exp.type === 'work' ? <Briefcase size={24} /> : <GraduationCap size={24} />}
                      </div>
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-800 px-3 py-1 rounded-full">
                        {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {exp.title}
                    </h3>
                    
                    <div className="flex items-center text-primary-500 font-medium mb-2">
                      {exp.company}
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                      <MapPin size={16} className="mr-2" />
                      {exp.location}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="space-y-2">
                      {exp.achievements && exp.achievements.map((achievement, achievementIndex) => (
                        <motion.div
                          key={achievementIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 * achievementIndex }}
                          className="flex items-start text-sm text-gray-600 dark:text-gray-300"
                        >
                          <span className="text-secondary-500 mr-2 mt-1">•</span>
                          {achievement}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
   <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.6 }}
  className="mt-20"
>
  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
    Certifications & Achievements
  </h3>
<div className="grid md:grid-cols-3 gap-6">
  {certs.map((cert, index) => (
    <motion.div
      key={cert.id}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-primary-500/50 transition-colors"
    >
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
        {cert.name}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {cert.issuer}
      </p>
      <span className="text-xs text-primary-500 font-mono">
        {cert.year}
      </span>
    </motion.div>
  ))}
</div>
</motion.div>
      </div>
    </section>
  );
};

export default Experience;