import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';

type SocialLink = {
  label: string;
  icon: string;
  href: string;
};

type HeroData = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  resume: string;
  socials: SocialLink[];
};

const iconMap = { Github, Linkedin, Mail };

const Hero = () => {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/hero")
      .then(res => res.json())
      .then(data => setHero({
        ...data,
        socials: Array.isArray(data.socials)
          ? data.socials
          : data.socials
          ? JSON.parse(data.socials)
          : []
      }));
  }, []);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!hero) return null;

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium border border-primary-500/20">
              👋 Hello, I'm
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-mono mb-6 text-gray-900 dark:text-white"
          >
            {hero.title}
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-8 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent bg-300% animate-gradient"
            style={{ backgroundSize: '300% 300%' }}
          >
            {hero.subtitle}
          </motion.h2>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {hero.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProjects}
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-lg shadow-lg shadow-primary-500/25 transition-colors flex items-center gap-2"
            >
              View My Work
              <ArrowDown size={20} />
            </motion.button>
            {hero.resume && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                  href="http://localhost:5000/uploads/resume/resume.pdf"
    download
                className="px-8 py-4 bg-white/10 dark:bg-dark-800/50 backdrop-blur-sm border border-white/20 text-gray-900 dark:text-white rounded-lg font-semibold text-lg hover:bg-white/20 dark:hover:bg-dark-800/70 transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                Download Resume
              </motion.a>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center space-x-6"
          >
      {hero.socials.map((social, i) => {
  const Icon = iconMap[social.icon as keyof typeof iconMap] || Github;
  const isMail = social.icon.toLowerCase() === "mail";
  return (
    <motion.a
      key={social.label + i}
      href={social.href}
      {...(!isMail ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      whileHover={{ scale: 1.2, y: -2 }}
      whileTap={{ scale: 0.9 }}
      className="p-3 bg-white/10 dark:bg-dark-800/50 backdrop-blur-sm rounded-full border border-white/20 text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:border-primary-500/50 transition-colors"
      aria-label={social.label}
    >
      <Icon size={24} />
    </motion.a>
  );
})}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;