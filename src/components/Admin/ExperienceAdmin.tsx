import { useEffect, useState } from "react";

type Experience = {
  id: number;
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  bullets: string[];
};

type Certification = {
  id: number;
  name: string;
  issuer: string;
  year: string;
};

export default function ExperienceAdmin() {
  // Experience state
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>({
    company: "",
    role: "",
    location: "",
    description: "",
    start_date: "",
    end_date: "",
    bullets: [""]
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Section title/subtitle state
  const [sectionContent, setSectionContent] = useState({ title: "", subtitle: "" });
  const [editingSection, setEditingSection] = useState(false);

  // Certifications state
  const [certs, setCerts] = useState<Certification[]>([]);
  const [certForm, setCertForm] = useState<Omit<Certification, "id">>({ name: "", issuer: "", year: "" });
  const [editingCertId, setEditingCertId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Fetch section content
  useEffect(() => {
    fetch("http://localhost:5000/api/experience-content", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSectionContent({
        title: data?.title || "",
        subtitle: data?.subtitle || ""
      }));
  }, [token]);

  const handleSectionSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/experience-content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(sectionContent)
    });
    setEditingSection(false);
  };

  const handleSectionDelete = async () => {
    await fetch("http://localhost:5000/api/experience-content", {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setSectionContent({ title: "", subtitle: "" });
    setEditingSection(false);
  };

  // Fetch experience only if token exists
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/experience", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExperience(data);
          setError(null);
        } else {
          setExperience([]);
          setError(data.error || "Failed to load experience");
        }
        setLoading(false);
      })
      .catch(() => {
        setExperience([]);
        setError("Failed to load experience");
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/experience/${editingId}`
      : "http://localhost:5000/api/experience";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({
        company: "",
        role: "",
        location: "",
        description: "",
        start_date: "",
        end_date: "",
        bullets: [""]
      });
      setEditingId(null);
      setLoading(true);
      fetch("http://localhost:5000/api/experience", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setExperience(data);
          else setExperience([]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleEdit = (exp: Experience) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = exp;
    setForm(rest);
    setEditingId(exp.id);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await fetch(`http://localhost:5000/api/experience/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setExperience(experience.filter((e) => e.id !== id));
  };

  // Certifications CRUD
  useEffect(() => {
    fetch("http://localhost:5000/api/certifications")
      .then(res => res.json())
      .then(data => setCerts(Array.isArray(data) ? data : []));
  }, []);

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const method = editingCertId ? "PUT" : "POST";
    const url = editingCertId
      ? `http://localhost:5000/api/certifications/${editingCertId}`
      : "http://localhost:5000/api/certifications";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(certForm)
    });
    if (res.ok) {
      setCertForm({ name: "", issuer: "", year: "" });
      setEditingCertId(null);
      fetch("http://localhost:5000/api/certifications")
        .then(res => res.json())
        .then(data => setCerts(Array.isArray(data) ? data : []));
    }
  };

  const handleCertEdit = (cert: Certification) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = cert;
    setCertForm(rest);
    setEditingCertId(cert.id);
  };

  const handleCertDelete = async (id: number) => {
    if (!token) return;
    await fetch(`http://localhost:5000/api/certifications/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setCerts(certs.filter((c) => c.id !== id));
  };

  if (!token) return <div className="text-center text-cyan-300">Not authorized</div>;
  if (loading) return <div className="text-center text-cyan-300">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-4 font-inter text-white">
      {/* Experience Form */}
      <div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-purple-900/40 bg-[#10182a] shadow-lg"
        style={{ boxShadow: "0 4px 32px 0 rgba(168,85,247,0.04)" }}>
        <h2 className="text-3xl font-fira text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Manage Experience
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="block text-lg font-fira text-cyan-300 mb-1">Company</span>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-cyan-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              required
            />
          </label>
          <label className="block mb-4">
            <span className="block text-lg font-fira text-purple-300 mb-1">Role</span>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-purple-400 focus:border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
            />
          </label>
          <label className="block mb-4">
            <span className="block text-lg font-fira text-lime-300 mb-1">Description</span>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-lime-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="block mb-4">
            <span className="block text-lg font-fira text-cyan-300 mb-1">Start Date</span>
            <input
              type="date"
              className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-cyan-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
              required
            />
          </label>
          <label className="block mb-8">
            <span className="block text-lg font-fira text-purple-300 mb-1">End Date</span>
            <input
              type="date"
              className="w-full bg-transparent border-0 border-b-2 border-purple-400 focus:border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </label>
          <label className="block mb-4">
            <span className="block text-lg font-fira text-cyan-300 mb-1">Location</span>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-cyan-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              required
            />
          </label>
          <label className="block mb-4">
            <span className="block text-lg font-fira text-lime-300 mb-1">Highlights / Bullets</span>
            {form.bullets.map((bullet, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-cyan-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
                  value={bullet}
                  onChange={e => {
                    const newBullets = [...form.bullets];
                    newBullets[idx] = e.target.value;
                    setForm({ ...form, bullets: newBullets });
                  }}
                  placeholder={`Bullet point ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, bullets: form.bullets.filter((_, i) => i !== idx) })}
                  className="text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm({ ...form, bullets: [...form.bullets, ""] })}
              className="text-cyan-400 mt-2"
            >
              + Add Bullet
            </button>
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
              bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
          >
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
        </form>
      </div>
      <ul className="max-w-xl mx-auto mt-10 space-y-4">
        {experience.map((e) => (
          <li
            key={e.id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-[#10182a] border border-purple-900/40 rounded-xl px-4 py-3 shadow"
          >
            <div>
              <div className="font-fira text-cyan-300">{e.company}</div>
              <div className="text-lime-300 text-sm">{e.role}</div>
              <div className="text-white text-xs">{e.description}</div>
              <div className="text-purple-400 text-xs">
                {e.start_date} - {e.end_date}
              </div>
              <div className="text-gray-400 text-xs">{e.location}</div>
              <ul className="list-disc ml-6 mt-2">
                {e.bullets && e.bullets.map((b, i) => (
                  <li key={i} className="text-green-400">{b}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleEdit(e)}
                className="px-3 py-1 rounded-lg bg-cyan-400 text-[#0F172A] font-bold hover:bg-cyan-300 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="px-3 py-1 rounded-lg bg-purple-400 text-[#0F172A] font-bold hover:bg-purple-300 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Section Title & Subtitle Form */}
      <div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-purple-900/40 bg-[#10182a] shadow-lg mb-8">
        <h2 className="text-2xl font-fira text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Edit Experience Section Title & Subtitle
        </h2>
        {editingSection ? (
          <form onSubmit={handleSectionSave} className="space-y-6">
            <label className="block">
              <span className="block text-lg font-fira text-cyan-300 mb-1">Section Title</span>
              <input
                className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-cyan-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
                value={sectionContent.title}
                onChange={e => setSectionContent({ ...sectionContent, title: e.target.value })}
                placeholder="Section Title"
                required
              />
            </label>
            <label className="block">
              <span className="block text-lg font-fira text-lime-300 mb-1">Section Subtitle</span>
              <input
                className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-lime-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
                value={sectionContent.subtitle}
                onChange={e => setSectionContent({ ...sectionContent, subtitle: e.target.value })}
                placeholder="Section Subtitle"
                required
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
                  bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
              >
                Save Section Content
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(false)}
                className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
                  bg-gradient-to-r from-pink-400 to-yellow-400 text-[#10182a]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSectionDelete}
                className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
                  bg-gradient-to-r from-red-400 to-pink-400 text-[#10182a]"
              >
                Delete
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-xl font-bold text-cyan-300">{sectionContent.title}</div>
            <div className="text-lg text-lime-300">{sectionContent.subtitle}</div>
            <button
              onClick={() => setEditingSection(true)}
              className="mt-4 py-2 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#10182a] font-bold text-lg shadow transition hover:scale-105"
            >
              Edit Section Content
            </button>
          </div>
        )}
      </div>

      {/* Certifications Form */}
      <div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-purple-900/40 bg-[#10182a] shadow-lg mb-8">
        <h2 className="text-2xl font-fira text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Manage Certifications & Achievements
        </h2>
        <form onSubmit={handleCertSubmit} className="space-y-4">
          <input
            className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
            value={certForm.name}
            onChange={e => setCertForm({ ...certForm, name: e.target.value })}
            placeholder="Certification Name"
            required
          />
          <input
            className="w-full bg-transparent border-0 border-b-2 border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
            value={certForm.issuer}
            onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
            placeholder="Issuer"
            required
          />
          <input
            className="w-full bg-transparent border-0 border-b-2 border-purple-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
            value={certForm.year}
            onChange={e => setCertForm({ ...certForm, year: e.target.value })}
            placeholder="Year"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
              bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
          >
            {editingCertId ? "Update Certification" : "Add Certification"}
          </button>
        </form>
        <ul className="mt-8 space-y-4">
          {certs.map((c) => (
            <li key={c.id} className="flex items-center justify-between bg-[#10182a] border border-purple-900/40 rounded-xl px-4 py-3 shadow">
              <div>
                <div className="font-fira text-cyan-300">{c.name}</div>
                <div className="text-lime-300 text-sm">{c.issuer}</div>
                <div className="text-purple-400 text-xs">{c.year}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCertEdit(c)}
                  className="px-3 py-1 rounded-lg bg-cyan-400 text-[#0F172A] font-bold hover:bg-cyan-300 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCertDelete(c.id)}
                  className="px-3 py-1 rounded-lg bg-purple-400 text-[#0F172A] font-bold hover:bg-purple-300 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}