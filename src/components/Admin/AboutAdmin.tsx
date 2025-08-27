import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type Skill = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type Stat = {
  id: number;
  label: string;
  value: string;
};

const ICONS = [
  "Globe", "Code2", "Database", "Smartphone"
];

export default function AboutAdmin() {
  // About text state
  const [content, setContent] = useState<string>("");
  const [edit, setEdit] = useState<string>("");

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillForm, setSkillForm] = useState<Omit<Skill, "id">>({ name: "", icon: "Globe", color: "text-primary-500" });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  // Stats state
  const [stats, setStats] = useState<Stat[]>([]);
  const [statForm, setStatForm] = useState<Omit<Stat, "id">>({ label: "", value: "" });
  const [editingStatId, setEditingStatId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Fetch all data
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch("http://localhost:5000/api/about", { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.json()),
      fetch("http://localhost:5000/api/skills", { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.json()),
      fetch("http://localhost:5000/api/stats", { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.json())
    ])
      .then(([aboutData, skillsData, statsData]) => {
        setContent(aboutData.content || "");
        setEdit(aboutData.content || "");
        setSkills(skillsData);
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load admin data");
        setLoading(false);
      });
  }, [token]);

  // About text change
  const handleAboutChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEdit(e.target.value);
  };

  // Skills CRUD
  const handleSkillChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSkillForm({ ...skillForm, [e.target.name]: e.target.value });
  };

  const handleSkillSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    const method = editingSkillId ? "PUT" : "POST";
    const url = editingSkillId
      ? `http://localhost:5000/api/skills/${editingSkillId}`
      : "http://localhost:5000/api/skills";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(skillForm)
    });
    const res = await fetch("http://localhost:5000/api/skills", { headers: { "Authorization": `Bearer ${token}` } });
    setSkills(await res.json());
    setSkillForm({ name: "", icon: "Globe", color: "text-primary-500" });
    setEditingSkillId(null);
  };

  const handleSkillEdit = (skill: Skill) => {
    setSkillForm({ name: skill.name, icon: skill.icon, color: skill.color });
    setEditingSkillId(skill.id);
  };

  const handleSkillDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/skills/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const res = await fetch("http://localhost:5000/api/skills", { headers: { "Authorization": `Bearer ${token}` } });
    setSkills(await res.json());
  };

  // Stats CRUD
  const handleStatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatForm({ ...statForm, [e.target.name]: e.target.value });
  };

  const handleStatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!statForm.label.trim() || !statForm.value.trim()) return;
    const method = editingStatId ? "PUT" : "POST";
    const url = editingStatId
      ? `http://localhost:5000/api/stats/${editingStatId}`
      : "http://localhost:5000/api/stats";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(statForm)
    });
    const res = await fetch("http://localhost:5000/api/stats", { headers: { "Authorization": `Bearer ${token}` } });
    setStats(await res.json());
    setStatForm({ label: "", value: "" });
    setEditingStatId(null);
  };

  const handleStatEdit = (stat: Stat) => {
    setStatForm({ label: stat.label, value: stat.value });
    setEditingStatId(stat.id);
  };

  const handleStatDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/stats/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const res = await fetch("http://localhost:5000/api/stats", { headers: { "Authorization": `Bearer ${token}` } });
    setStats(await res.json());
  };

  // Save all changes (about text only, as skills/stats are saved instantly)
  const handleSaveAll = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (content !== edit) {
      await fetch("http://localhost:5000/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: edit })
      });
      setContent(edit);
    }
    alert("All changes saved!");
  };

  if (!token) return <div className="text-center text-cyan-300">Not authorized</div>;
  if (loading) return <div className="text-center text-cyan-300">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-4 font-inter text-white">
      {/* About Text Edit */}
      <form
        onSubmit={handleSaveAll}
        className="max-w-2xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg"
        style={{ boxShadow: "0 4px 32px 0 rgba(0,255,255,0.04)" }}
      >
        <h2 className="text-3xl font-fira text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Edit About Section
        </h2>
        <label className="block text-base mb-2 text-cyan-200">About Text</label>
        <textarea
          value={edit}
          onChange={handleAboutChange}
          rows={5}
          className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition mb-8 placeholder:text-cyan-400"
          placeholder="Write about yourself..."
        />
        <h3 className="text-lg font-fira text-cyan-300 mb-2">Preview:</h3>
        <div className="bg-[#1e293b]/60 rounded-xl p-4 text-lime-300 font-fira shadow border border-cyan-900/10 min-h-[60px] mb-8">
          {edit}
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
            bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a] mt-4"
        >
          Apply Changes
        </button>
      </form>

      {/* Skills CRUD */}
      <div className="max-w-2xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">Manage Skills</h2>
        <form onSubmit={handleSkillSubmit} className="flex flex-col gap-2 mb-4">
          <input
            name="name"
            value={skillForm.name}
            onChange={handleSkillChange}
            placeholder="Skill Name"
            className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-lime-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400"
            required
          />
          <select name="icon" value={skillForm.icon} onChange={handleSkillChange} className="w-full bg-transparent border-0 border-b-2 border-purple-400 focus:border-lime-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400">
            {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
          <input
            name="color"
            value={skillForm.color}
            onChange={handleSkillChange}
            placeholder="Tailwind Color (e.g. text-primary-500)"
            className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-cyan-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-lime-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl font-fira text-base font-bold shadow transition hover:scale-105
              bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a] mt-2"
          >
            {editingSkillId ? "Update" : "Add"}
          </button>
        </form>
        <ul className="mb-8">
          {skills.map(skill => (
            <li key={skill.id} className="flex items-center justify-between mb-2">
              <span className="text-white">{skill.name} <span className="text-xs text-cyan-400">({skill.icon})</span></span>
              <div>
                <button type="button" onClick={() => handleSkillEdit(skill)} className="text-yellow-400 mr-2">Edit</button>
                <button type="button" onClick={() => handleSkillDelete(skill.id)} className="text-red-400">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats CRUD */}
      <div className="max-w-2xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">Manage Stats</h2>
        <form onSubmit={handleStatSubmit} className="flex flex-col gap-2 mb-4">
          <input
            name="label"
            value={statForm.label}
            onChange={handleStatChange}
            placeholder="Stat Label"
            className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-lime-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400"
            required
          />
          <input
            name="value"
            value={statForm.value}
            onChange={handleStatChange}
            placeholder="Stat Value (e.g. 25+)"
            className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-cyan-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-lime-400"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl font-fira text-base font-bold shadow transition hover:scale-105
              bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a] mt-2"
          >
            {editingStatId ? "Update" : "Add"}
          </button>
        </form>
        <ul className="mb-8">
          {stats.map(stat => (
            <li key={stat.id} className="flex items-center justify-between mb-2">
              <span className="text-white">{stat.label}: <span className="text-xs text-lime-400">{stat.value}</span></span>
              <div>
                <button type="button" onClick={() => handleStatEdit(stat)} className="text-yellow-400 mr-2">Edit</button>
                <button type="button" onClick={() => handleStatDelete(stat.id)} className="text-red-400">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}