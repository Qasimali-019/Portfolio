import { useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";

type SocialLink = {
  label: string;
  icon: string;
  href: string;
};

type HeroForm = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  resume: string;
  socials: SocialLink[];
};

export default function HeroAdmin() {
  const [form, setForm] = useState<HeroForm>({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    resume: "",
    socials: [
      { label: "GitHub", icon: "Github", href: "" },
      { label: "LinkedIn", icon: "Linkedin", href: "" },
      { label: "Email", icon: "Mail", href: "" }
    ]
  });
  const [, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/hero")
      .then(res => res.json())
      .then(data => setForm({
        ...data,
        socials: data.socials ? JSON.parse(data.socials) : [
          { label: "GitHub", icon: "Github", href: "" },
          { label: "LinkedIn", icon: "Linkedin", href: "" },
          { label: "Email", icon: "Mail", href: "" }
        ],
        resume: data.resume || ""
      }));
  }, []);

  // Auto-format mailto: as user types
  const handleSocialChange = (idx: number, field: keyof SocialLink, value: string) => {
    let newValue = value;
    if (
      form.socials[idx].icon.toLowerCase() === "mail" &&
      field === "href" &&
      value &&
      !value.startsWith("mailto:") &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      newValue = `mailto:${value}`;
    }
    const newSocials = [...form.socials];
    newSocials[idx][field] = newValue;
    setForm({ ...form, socials: newSocials });
  };

  const handleAddSocial = () => {
    setForm({ ...form, socials: [...form.socials, { label: "", icon: "", href: "" }] });
  };

  const handleDeleteSocial = (idx: number) => {
    setForm({ ...form, socials: form.socials.filter((_, i) => i !== idx) });
  };

  // Handle image upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUploading(true);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setForm(f => ({ ...f, image: data.url }));
      setUploading(false);
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", e.target.files[0]);
      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setForm(f => ({ ...f, resume: "/uploads/resume/resume.pdf" }));
      }
      setUploading(false);
    }
  };

  // Also auto-format mailto: on save, in case user pasted email directly
  const handleSave = async () => {
    setUploading(true);

    // Ensure all Mail icons have mailto: prefix
    const socials = form.socials.map(s => {
      if (
        s.icon.toLowerCase() === "mail" &&
        s.href &&
        !s.href.startsWith("mailto:") &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.href)
      ) {
        return { ...s, href: `mailto:${s.href}` };
      }
      return s;
    });

    await fetch("http://localhost:5000/api/hero", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, socials })
    });
    setUploading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1000); // Hide after 1 second
  };

  return (
    <motion.div
      className="max-w-xl mx-auto bg-[#10172a] border border-cyan-400/20 rounded-2xl shadow-xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
        Edit Hero Section
      </h2>
      <input
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="w-full bg-transparent border-b border-cyan-400 focus:outline-none focus:border-lime-400 py-2 px-2 text-lg text-white placeholder:text-cyan-200 mb-3"
      />
      <input
        value={form.subtitle}
        onChange={e => setForm({ ...form, subtitle: e.target.value })}
        placeholder="Subtitle"
        className="w-full bg-transparent border-b border-purple-400 focus:outline-none focus:border-lime-400 py-2 px-2 text-lg text-white placeholder:text-purple-200 mb-3"
      />
      <textarea
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        className="w-full bg-transparent border-b border-lime-400 focus:outline-none focus:border-cyan-400 py-2 px-2 text-lg text-white placeholder:text-lime-200 mb-3"
        rows={3}
      />

      {/* Image Upload/URL */}
      <div className="mb-3">
        <label className="block text-lime-300 font-bold mb-1">Image</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            placeholder="Image URL"
            className="flex-1 bg-transparent border-b border-lime-400 focus:outline-none focus:border-cyan-400 py-2 px-2 text-lg text-white placeholder:text-lime-200"
          />
          <span className="text-gray-400">or</span>
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-400 to-lime-400 text-[#0F172A] font-bold rounded shadow hover:scale-105 transition">
              {uploading ? "Uploading..." : "Browse"}
            </span>
          </label>
        </div>
        {form.image && (
          <img src={form.image} alt="" className="mt-3 max-w-xs rounded border border-cyan-400" />
        )}
      </div>

      {/* Resume Upload/URL */}
      <div className="mb-3">
        <label className="block text-lime-300 font-bold mb-1">Resume</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={form.resume}
            onChange={e => setForm({ ...form, resume: e.target.value })}
            placeholder="Resume URL (e.g. /uploads/resume/resume.pdf)"
            className="flex-1 bg-transparent border-b border-lime-400 focus:outline-none focus:border-cyan-400 py-2 px-2 text-lg text-white placeholder:text-lime-200"
          />
          <span className="text-gray-400">or</span>
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-400 to-lime-400 text-[#0F172A] font-bold rounded shadow hover:scale-105 transition">
              {uploading ? "Uploading..." : "Browse"}
            </span>
          </label>
        </div>
        {form.resume && (
          <a
            href="http://localhost:5000/uploads/resume/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline"
          >
            View Current Resume
          </a>
        )}
      </div>

      {/* Social Links */}
      <h4 className="text-lg font-bold mb-2 text-cyan-300">Social Links</h4>
      {form.socials.map((social, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            value={social.label}
            onChange={e => handleSocialChange(idx, "label", e.target.value)}
            placeholder="Label"
            className="w-1/4 bg-transparent border-b border-cyan-400 text-white placeholder:text-cyan-200 px-2 py-1"
          />
          <input
            value={social.icon}
            onChange={e => handleSocialChange(idx, "icon", e.target.value)}
            placeholder="Icon (Github, Linkedin, Mail)"
            className="w-1/4 bg-transparent border-b border-purple-400 text-white placeholder:text-purple-200 px-2 py-1"
          />
          <input
            value={social.href}
            onChange={e => handleSocialChange(idx, "href", e.target.value)}
            placeholder="URL or Email"
            className="w-1/2 bg-transparent border-b border-lime-400 text-white placeholder:text-lime-200 px-2 py-1"
          />
          <button onClick={() => handleDeleteSocial(idx)} className="text-red-400 hover:text-red-600">Delete</button>
        </div>
      ))}
      <button onClick={handleAddSocial} className="mb-4 px-3 py-1 bg-gradient-to-r from-cyan-400 to-lime-400 text-[#0F172A] rounded font-bold">Add Social</button>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={uploading}
          className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
            bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
        >
          {uploading ? "Applying..." : "Apply Changes"}
        </button>
      </div>
      {success && (
        <div className="text-green-400 text-center mt-2 font-bold">Changes applied!</div>
      )}
      {/* Preview */}
      <div className="mt-6 p-4 border border-cyan-400/10 rounded bg-[#1e293b]/60">
        <h1 className="text-3xl font-bold text-white">{form.title}</h1>
        <h2 className="text-xl text-purple-300">{form.subtitle}</h2>
        <p className="mb-2 text-lime-200">{form.description}</p>
        {form.image && <img src={form.image} alt="" className="max-w-xs rounded border border-cyan-400" />}
        {form.resume && (
          <a
            href="http://localhost:5000/uploads/resume/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline"
          >
            View Current Resume
          </a>
        )}
        <div className="flex gap-2 mt-2">
          {form.socials.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">{s.label}</a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}