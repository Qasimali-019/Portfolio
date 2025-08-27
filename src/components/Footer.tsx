import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';


type FooterData = {
  brand: string;
  brandDesc: string;
 
  contact: { email: string; location: string; note: string };
  copyright: string;
  powered: string;
};


const Footer = () => {
  const [footer, setFooter] = useState<FooterData | null>(null);
  const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" }
];
  
 const API_URL = "http://localhost:5000";
useEffect(() => {
  fetch(`${API_URL}/api/footer`)
    .then(res => res.json())
    .then(setFooter);
}, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!footer) return null; // or a loading spinner

  return (
    <footer className="bg-gray-900 dark:bg-dark-900 text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold font-mono text-primary-500">
              {footer.brand}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {footer.brandDesc}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((link, idx) => (
  <motion.button
    key={link.name + idx}
    onClick={() => scrollToSection(link.href)}
    whileHover={{ x: 5 }}
    className="text-gray-400 hover:text-primary-500 transition-colors text-left text-sm"
  >
    {link.name}
  </motion.button>
))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Let's Connect</h4>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                📧 {footer.contact?.email}
              </p>
              <p className="text-gray-400 text-sm">
                📍 {footer.contact?.location}
              </p>
              <p className="text-gray-400 text-sm">
                {footer.contact?.note}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>{footer.copyright}</span>
            <Heart size={16} className="text-red-500 animate-pulse" />
            <span>{footer.powered}</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/25 transition-colors z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;