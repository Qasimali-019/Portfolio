import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Twitter, LucideIcon } from 'lucide-react';

type ContactInfo = {
  id: number;
  label: string;
  value: string;
  href: string;
  icon: string;
};

type SocialLink = {
  id: number;
  label: string;
  href: string;
  icon: string;
  color: string;
};

const iconMap: Record<string, LucideIcon> = { Mail, Phone, MapPin, Github, Linkedin, Twitter };

// Use your backend URL here (or use an env variable)
const API_URL = "http://localhost:5000";

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic content
  const [sectionContent, setSectionContent] = useState({ title: "", description: "" });
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/contact-content`)
      .then(res => res.json())
      .then(data => {
        setSectionContent(data);
        console.log("Contact content:", data);
      });
    fetch(`${API_URL}/api/contact-info`)
      .then(res => res.json())
      .then(data => {
        setContactInfo(Array.isArray(data) ? data : []);
        console.log("Contact info:", data);
      });
    fetch(`${API_URL}/api/social-links`)
      .then(res => res.json())
      .then(data => {
        setSocialLinks(Array.isArray(data) ? data : []);
        console.log("Social links:", data);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    alert('Message sent successfully!');
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
            {sectionContent.title || "Let's Work Together"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {sectionContent.description || "I'm always interested in new opportunities and exciting projects. Let's discuss how we can collaborate!"}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Send me a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-2">
                  Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-lime-300 mb-2">
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b-2 border-lime-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-lime-400"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-purple-300 mb-2">
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full bg-transparent border-0 border-b-2 border-purple-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-purple-400 resize-none"
                  placeholder="Tell me about your project or just say hello!"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
                  bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Get in touch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {sectionContent.description || "I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and development. Feel free to reach out!"}
              </p>
            </div>
            {/* Contact Info */}
            <div className="space-y-4">
    {contactInfo.map((info, index) => {
  const Icon = iconMap[info.icon] || Mail;
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center p-4 bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 text-primary-500 rounded-lg mr-4 group-hover:bg-primary-500/30 transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <div className="font-medium text-gray-900 dark:text-white">
          {info.label}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {info.value}
        </div>
      </div>
    </motion.div>
  );
})}
            </div>
            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Follow me
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = iconMap[social.icon] || Github;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 bg-white/10 dark:bg-dark-900/30 backdrop-blur-sm rounded-lg border border-white/10 text-gray-600 dark:text-gray-400 ${social.color} transition-colors hover:border-white/20`}
                      aria-label={social.label}
                    >
                      <Icon size={24} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}