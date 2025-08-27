import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  sent_at?: string;
};

type ContactInfo = { id: number; label: string; value: string; href: string; icon: string; };
type SocialLink = { id: number; label: string; href: string; icon: string; color: string; };

export default function ContactAdmin() {
  const token = localStorage.getItem("token");

  // Section content
  const [sectionContent, setSectionContent] = useState({ title: "", description: "" });
  const [, setSectionLoading] = useState(true);

  // Contact info
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [infoForm, setInfoForm] = useState<Omit<ContactInfo, "id">>({ label: "", value: "", href: "", icon: "" });
  const [editingInfoId, setEditingInfoId] = useState<number | null>(null);

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialForm, setSocialForm] = useState<Omit<SocialLink, "id">>({ label: "", href: "", icon: "", color: "" });
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Fetch section content
  useEffect(() => {
    fetch("http://localhost:5000/api/contact-content", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSectionContent({
          title: data.title || "",
          description: data.description || ""
        });
        setSectionLoading(false);
      });
  }, [token]);

  // Fetch contact info
  useEffect(() => {
    fetch("http://localhost:5000/api/contact-info", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setContactInfo(Array.isArray(data) ? data : []));
  }, [token]);

  // Fetch social links
  useEffect(() => {
    fetch("http://localhost:5000/api/social-links", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSocialLinks(Array.isArray(data) ? data : []));
  }, [token]);

  // Fetch messages
  useEffect(() => {
    fetch("http://localhost:5000/api/contact", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [token]);

  // Section content save
  const handleSectionSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/contact-content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(sectionContent)
    });
  };

  // Contact info CRUD
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingInfoId ? "PUT" : "POST";
    const url = editingInfoId
      ? `http://localhost:5000/api/contact-info/${editingInfoId}`
      : "http://localhost:5000/api/contact-info";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(infoForm)
    });
    setInfoForm({ label: "", value: "", href: "", icon: "" });
    setEditingInfoId(null);
    fetch("http://localhost:5000/api/contact-info", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setContactInfo(Array.isArray(data) ? data : []));
  };
  const handleInfoEdit = (info: ContactInfo) => {
    setInfoForm({ label: info.label, value: info.value, href: info.href, icon: info.icon });
    setEditingInfoId(info.id);
  };
  const handleInfoDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/contact-info/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setContactInfo(contactInfo.filter(i => i.id !== id));
    setInfoForm({ label: "", value: "", href: "", icon: "" });
    setEditingInfoId(null);
  };

  // Social links CRUD
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSocialId ? "PUT" : "POST";
    const url = editingSocialId
      ? `http://localhost:5000/api/social-links/${editingSocialId}`
      : "http://localhost:5000/api/social-links";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(socialForm)
    });
    setSocialForm({ label: "", href: "", icon: "", color: "" });
    setEditingSocialId(null);
    fetch("http://localhost:5000/api/social-links", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSocialLinks(Array.isArray(data) ? data : []));
  };
  const handleSocialEdit = (link: SocialLink) => {
    setSocialForm({ label: link.label, href: link.href, icon: link.icon, color: link.color });
    setEditingSocialId(link.id);
  };
  const handleSocialDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/social-links/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setSocialLinks(socialLinks.filter(l => l.id !== id));
    setSocialForm({ label: "", href: "", icon: "", color: "" });
    setEditingSocialId(null);
  };

  // Messages
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/contact/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setMessages(messages.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-8 rounded-2xl shadow-xl bg-[#10182a] border border-cyan-900/40"
    >
      {/* Section Title & Description */}
      <h2 className="text-3xl font-fira text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
        Edit Contact Section
      </h2>
      <form onSubmit={handleSectionSave} className="space-y-4 mb-10">
        <label className="block">
          <span className="block text-base font-fira text-cyan-300 mb-1">Title</span>
          <input
            className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
            value={sectionContent.title}
            onChange={e => setSectionContent({ ...sectionContent, title: e.target.value })}
            placeholder="Section Title"
            required
          />
        </label>
        <label className="block">
          <span className="block text-base font-fira text-lime-300 mb-1">Description</span>
          <textarea
            className="w-full bg-transparent border-0 border-b-2 border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
            value={sectionContent.description}
            onChange={e => setSectionContent({ ...sectionContent, description: e.target.value })}
            placeholder="Section Description"
            rows={3}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
            bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
        >
          Save Section Content
        </button>
      </form>

      {/* Contact Info */}
      <h3 className="text-xl font-fira mb-2 text-cyan-300">Manage Contact Info</h3>
      <form onSubmit={handleInfoSubmit} className="space-y-2 mb-4">
        <input className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none" value={infoForm.label} onChange={e => setInfoForm({ ...infoForm, label: e.target.value })} placeholder="Label (e.g. Email)" required />
        <input className="w-full bg-transparent border-0 border-b-2 border-lime-400 text-white px-2 py-1 font-fira outline-none" value={infoForm.value} onChange={e => setInfoForm({ ...infoForm, value: e.target.value })} placeholder="Value (e.g. alex@example.com)" required />
        <input className="w-full bg-transparent border-0 border-b-2 border-purple-400 text-white px-2 py-1 font-fira outline-none" value={infoForm.href} onChange={e => setInfoForm({ ...infoForm, href: e.target.value })} placeholder="Href (e.g. mailto:alex@example.com)" />
        <input className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none" value={infoForm.icon} onChange={e => setInfoForm({ ...infoForm, icon: e.target.value })} placeholder="Icon (e.g. Mail, Phone, MapPin)" />
        <button className="w-full py-2 rounded-xl font-fira text-base font-bold shadow transition hover:scale-105 bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]">{editingInfoId ? "Update" : "Add"}</button>
        {editingInfoId && <button type="button" onClick={() => { setEditingInfoId(null); setInfoForm({ label: "", value: "", href: "", icon: "" }); }} className="text-red-400 ml-2">Cancel</button>}
      </form>
      <ul className="mb-8">
        {contactInfo.map(info => (
          <li key={info.id} className="flex items-center justify-between border-b border-cyan-900/40 py-2">
            <span className="text-cyan-300">{info.label}</span>
            <span className="text-lime-300">{info.value}</span>
            <span className="text-purple-300">{info.icon}</span>
            <div>
              <button onClick={() => handleInfoEdit(info)} className="text-yellow-400 mr-2">Edit</button>
              <button onClick={() => handleInfoDelete(info.id)} className="text-red-400">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Social Links */}
      <h3 className="text-xl font-fira mb-2 text-cyan-300">Manage Social Links</h3>
      <form onSubmit={handleSocialSubmit} className="space-y-2 mb-4">
        <input className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none" value={socialForm.label} onChange={e => setSocialForm({ ...socialForm, label: e.target.value })} placeholder="Label (e.g. GitHub)" required />
        <input className="w-full bg-transparent border-0 border-b-2 border-lime-400 text-white px-2 py-1 font-fira outline-none" value={socialForm.href} onChange={e => setSocialForm({ ...socialForm, href: e.target.value })} placeholder="URL" required />
        <input className="w-full bg-transparent border-0 border-b-2 border-purple-400 text-white px-2 py-1 font-fira outline-none" value={socialForm.icon} onChange={e => setSocialForm({ ...socialForm, icon: e.target.value })} placeholder="Icon (e.g. Github, Linkedin, Twitter)" />
        <input className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none" value={socialForm.color} onChange={e => setSocialForm({ ...socialForm, color: e.target.value })} placeholder="Color class" />
        <button className="w-full py-2 rounded-xl font-fira text-base font-bold shadow transition hover:scale-105 bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]">{editingSocialId ? "Update" : "Add"}</button>
        {editingSocialId && <button type="button" onClick={() => { setEditingSocialId(null); setSocialForm({ label: "", href: "", icon: "", color: "" }); }} className="text-red-400 ml-2">Cancel</button>}
      </form>
      <ul className="mb-8">
        {socialLinks.map(link => (
          <li key={link.id} className="flex items-center justify-between border-b border-cyan-900/40 py-2">
            <span className="text-cyan-300">{link.label}</span>
            <span className="text-lime-300">{link.href}</span>
            <span className="text-purple-300">{link.icon}</span>
            <div>
              <button onClick={() => handleSocialEdit(link)} className="text-yellow-400 mr-2">Edit</button>
              <button onClick={() => handleSocialDelete(link.id)} className="text-red-400">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Contact Messages */}
      <h3 className="text-xl font-fira mb-2 text-cyan-300">Contact Messages</h3>
      <ul className="space-y-4">
        {messages.length === 0 && (
          <li className="text-center text-cyan-200">No messages yet.</li>
        )}
        {messages.map((m) => (
          <li
            key={m.id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e293b]/60 rounded-xl p-4 shadow border border-cyan-400/10"
          >
            <div>
              <div className="font-fira text-cyan-300">{m.name}</div>
              <div className="text-lime-300 text-xs">{m.email}</div>
              <div className="text-white mt-1">{m.message}</div>
              {m.sent_at && (
                <div className="text-xs text-purple-400 mt-1">
                  {new Date(m.sent_at).toLocaleString()}
                </div>
              )}
            </div>
            <button
              onClick={() => handleDelete(m.id)}
              className="mt-3 md:mt-0 px-4 py-1 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-[#0F172A] font-bold hover:bg-cyan-300 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}