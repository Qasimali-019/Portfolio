import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Globe, Smartphone } from 'lucide-react';

type Stat = {
  id: number;
  label: string;
  value: string;
};

const specialties = [
  {
    name: "Frontend Development",
    icon: Globe,
    color: "#00FFF0"
  },
  {
    name: "Backend Development",
    icon: Code2,
    color: "#A3E635"
  },
  {
    name: "Database Design",
    icon: Database,
    color: "#A78BFA"
  },
  {
    name: "Mobile Development",
    icon: Smartphone,
    color: "#38BDF8"
  }
];

const About = () => {
  const [about, setAbout] = useState<string>("");
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/about")
      .then(res => res.json())
      .then(data => setAbout(data.content || ""));
    fetch("http://localhost:5000/api/stats")
      .then(res => res.json())
      .then(data => setStats(Array.isArray(data) ? data : []));
  }, []);

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {about}
              </p>
              
            </div>
          </motion.div>

          {/* Specialties Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {specialties.map((spec, index) => (
              <motion.div
                key={spec.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group hover:border-white/20 transition-colors"
              >
                <div className="inline-flex p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <spec.icon size={32} color={spec.color} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {spec.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold font-mono text-primary-500 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;