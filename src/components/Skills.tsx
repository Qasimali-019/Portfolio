import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Skill = {
  id: number;
  name: string;
  level: number;
  icon?: string; // Optional: if you want to support icons from backend
  category: string;
};

type FamiliarTag = {
  id: number;
  name: string;
};



const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const token = localStorage.getItem("token");
useEffect(() => {
  // Remove token check temporarily to debug
  fetch("http://localhost:5000/api/skills", {
    headers: token ? { "Authorization": `Bearer ${token}` } : {}
  })
    .then(res => {
      console.log("Skills fetch status:", res.status);
      return res.json();
    })
    .then(data => {
      setSkills(Array.isArray(data) ? data : []);
      console.log("Fetched skills:", data);
    })
    .catch(err => console.error("Fetch error:", err));
}, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/familiartags")
      .then(res => res.json())
      .then(data => setTags(Array.isArray(data) ? data.map((t: FamiliarTag) => t.name) : []));
  }, []);
// Normalize categories to lowercase
const categories = Array.from(
  new Set(
    skills
      .map(s => s.category?.toLowerCase().trim() || "")
      .filter(Boolean)
  )
).sort((a, b) => {
  const aMaxId = Math.max(...skills.filter(s => (s.category?.toLowerCase().trim() || "") === a).map(s => s.id));
  const bMaxId = Math.max(...skills.filter(s => (s.category?.toLowerCase().trim() || "") === b).map(s => s.id));
  return aMaxId - bMaxId;
});

const categoryColors: Record<string, string> = {
  frontend: 'from-blue-500 to-blue-600',
  backend: 'from-green-500 to-green-600',
  database: 'from-yellow-500 to-yellow-600',
  'tools & others': 'from-purple-500 to-pink-600',
};

const groupedSkills = categories.map(category => ({
  title: category.charAt(0).toUpperCase() + category.slice(1),
  color: categoryColors[category] || 'from-gray-500 to-gray-600',
  skills: skills.filter(s => (s.category?.toLowerCase().trim() || "") === category),
}));
const [sectionContent, setSectionContent] = useState<{ title: string; description: string }>({ title: "", description: "" });

useEffect(() => {
  fetch("http://localhost:5000/api/skills-content")
    .then(res => res.json())
    .then(data => setSectionContent({
      title: data?.title || "",
      description: data?.description || ""
    }));
}, []);


  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="text-center mb-16"
>
  <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 dark:text-white mb-4">
    {sectionContent.title || "Skills & Technologies"}
  </h2>
  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
    {sectionContent.description || "I work with a diverse set of technologies to build comprehensive solutions"}
  </p>
  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
</motion.div>
       <div className="grid md:grid-cols-2 gap-8">
  {groupedSkills.map((category, categoryIndex) => (
    <motion.div
      key={category.title}
      initial={{ opacity: 0, x: categoryIndex % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 * categoryIndex }}
      className="bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold mb-6`}>
        {category.title}
      </div>
      <div className="space-y-6">
        {category.skills.map((skill, skillIndex) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * skillIndex }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{skill.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {skill.name}
                </span>
              </div>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {skill.level}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2 * skillIndex, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${category.color} rounded-full shadow-lg`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  ))}
</div>

        {/* Additional Skills Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Also familiar with
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tags.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-white/10 dark:bg-dark-800/50 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-white/10 hover:border-primary-500/50 transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;