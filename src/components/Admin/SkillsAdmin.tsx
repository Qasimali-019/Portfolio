import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

type Skill = {
  id: number;
  name: string;
  level: string;
  category: string;
};

type FamiliarTag = {
  id: number;
  name: string;
};

export default function SkillsAdmin() {
  // Skills state
  const [form, setForm] = useState<Omit<Skill, "id">>({ name: "", level: "", category: "" });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [sectionContent, setSectionContent] = useState({ title: "", description: "" });
const [, setSectionLoading] = useState(true);

  // Tags state
  const [tags, setTags] = useState<FamiliarTag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Get unique categories from skills
  const categories = Array.from(new Set(skills.map(s => s.category))).filter(Boolean);

useEffect(() => {
  fetch("http://localhost:5000/api/skills-content", {
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

const handleSectionSave = async (e: React.FormEvent) => {
  e.preventDefault();
  await fetch("http://localhost:5000/api/skills-content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(sectionContent)
  });
};


  // Fetch tags
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/familiartags", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTags(Array.isArray(data) ? data : []));
  }, [token]);

  // Tag CRUD
  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const method = editingTagId ? "PUT" : "POST";
    const url = editingTagId
      ? `http://localhost:5000/api/familiartags/${editingTagId}`
      : "http://localhost:5000/api/familiartags";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: tagInput })
    });
    setTagInput("");
    setEditingTagId(null);
    fetch("http://localhost:5000/api/familiartags", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTags(Array.isArray(data) ? data : []));
  };

  const handleTagEdit = (tag: FamiliarTag) => {
    setTagInput(tag.name);
    setEditingTagId(tag.id);
  };

  const handleTagDelete = async (id: number) => {
    if (!token) return;
    await fetch(`http://localhost:5000/api/familiartags/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setTags(tags.filter(t => t.id !== id));
  };

  // Fetch skills
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/skills", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSkills(data);
          setError(null);
        } else {
          setSkills([]);
          setError(data.error || "Failed to load skills");
        }
        setLoading(false);
      })
      .catch(() => {
        setSkills([]);
        setError("Failed to load skills");
        setLoading(false);
      });
  }, [token]);

  // Skill CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const categoryToUse = showNewCategory && newCategory ? newCategory : form.category;
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/skills/${editingId}`
      : "http://localhost:5000/api/skills";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, category: categoryToUse })
    });
    if (res.ok) {
      setForm({ name: "", level: "", category: "" });
      setNewCategory("");
      setShowNewCategory(false);
      setEditingId(null);
      setLoading(true);
      fetch("http://localhost:5000/api/skills", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSkills(data);
          else setSkills([]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleEdit = (skill: Skill) => {
    setForm({ name: skill.name, level: skill.level, category: skill.category });
    setEditingId(skill.id);
    setShowNewCategory(false);
    setNewCategory("");
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await fetch(`http://localhost:5000/api/skills/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setSkills(skills.filter((s) => s.id !== id));
  };

  if (!token) return <div className="text-center text-cyan-300">Not authorized</div>;
  if (loading) return <div className="text-center text-cyan-300">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (



    
    <div className="min-h-screen bg-[#0F172A] py-10 px-4 font-inter text-white">
      {/* Skills Form */}
      <div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg">
        <h2 className="text-3xl font-fira text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Manage Skills
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-6">
            <span className="block text-lg font-fira text-cyan-300 mb-1">Skill Name</span>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-cyan-400 focus:border-cyan-300 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="block mb-8">
            <span className="block text-lg font-fira text-lime-300 mb-1">Category</span>
            <div className="flex gap-2 items-center">
              <div className="relative w-full">
                <Listbox
                  value={showNewCategory ? "" : form.category}
                  onChange={value => {
                    if (value === "__new__") {
                      setShowNewCategory(true);
                      setForm({ ...form, category: "" });
                    } else {
                      setShowNewCategory(false);
                      setForm({ ...form, category: value });
                    }
                  }}
                >
                  <Listbox.Button className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-cyan-400 text-lg text-white font-fira px-2 py-2 outline-none transition flex justify-between items-center">
                    {showNewCategory || !form.category ? "Select category" : form.category}
                    <ChevronDown className="ml-2 text-lime-300" size={18} />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-2 w-full bg-[#10182a] border border-lime-400 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none">
                    {categories.map(cat => (
                      <Listbox.Option
                        key={cat}
                        value={cat}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 font-fira text-white ${
                            active ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#10182a]" : ""
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span className="flex items-center">
                            {selected && <Check className="mr-2" size={16} />}
                            {cat}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                    <Listbox.Option
                      value="__new__"
                      className="cursor-pointer select-none px-4 py-2 font-fira text-lime-300"
                    >
                      + Add new...
                    </Listbox.Option>
                  </Listbox.Options>
                </Listbox>
              </div>
              {showNewCategory && (
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-lime-400 focus:border-cyan-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category"
                  required
                />
              )}
            </div>
          </label>
          <label className="block mb-8">
            <span className="block text-lg font-fira text-purple-300 mb-1">Level</span>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-purple-400 focus:border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
              value={form.level}
              onChange={e => setForm({ ...form, level: e.target.value })}
            />
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
              bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
          >
            {editingId ? "Update Skill" : "Add Skill"}
          </button>
        </form>
      </div>

<div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg mb-8">
  <h2 className="text-2xl font-fira text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
    Edit Skills Section Title & Description
  </h2>
  <form onSubmit={handleSectionSave} className="space-y-4">
    <input
      className="w-full bg-transparent border-0 border-b-2 border-cyan-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
      value={sectionContent.title}
      onChange={e => setSectionContent({ ...sectionContent, title: e.target.value })}
      placeholder="Section Title"
      required
    />
    <textarea
      className="w-full bg-transparent border-0 border-b-2 border-lime-400 text-lg text-white font-fira px-2 py-2 outline-none transition"
      value={sectionContent.description}
      onChange={e => setSectionContent({ ...sectionContent, description: e.target.value })}
      placeholder="Section Description"
      rows={3}
      required
    />
    <button
      type="submit"
      className="w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition hover:scale-105
        bg-gradient-to-r from-cyan-400 via-purple-300 to-lime-400 text-[#10182a]"
    >
      Save Section Content
    </button>
  </form>
</div>
      {/* Tags Form */}
      <div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg mb-8">
        <h2 className="text-2xl font-fira text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Manage "Also familiar with" Tags
        </h2>
        <form onSubmit={handleTagSubmit} className="flex gap-2 mb-4">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="Add or edit tag"
            className="w-full bg-transparent border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none placeholder:text-cyan-400"
            required
          />
          <button
            className="bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#0F172A] px-4 py-1 rounded font-bold"
          >
            {editingTagId ? "Update" : "Add"}
          </button>
          {editingTagId && (
            <button
              type="button"
              onClick={() => { setEditingTagId(null); setTagInput(""); }}
              className="text-red-400 ml-2"
            >
              Cancel
            </button>
          )}
        </form>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag.id} className="px-4 py-1 rounded-full bg-[#0F172A] border border-cyan-400 text-cyan-300 font-mono text-sm flex items-center gap-2">
              {tag.name}
              <button onClick={() => handleTagEdit(tag)} className="text-yellow-400 ml-2">Edit</button>
              <button onClick={() => handleTagDelete(tag.id)} className="text-red-400 ml-1">Delete</button>
            </span>
          ))}
        </div>
      </div>

      {/* Skills List */}
      <ul className="max-w-xl mx-auto mt-10 space-y-4">
        {skills.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between bg-[#10182a] border border-cyan-900/40 rounded-xl px-4 py-3 shadow"
          >
            <span className="font-fira text-cyan-300">{s.name}</span>
            <span className="font-fira text-lime-300">{s.category}</span>
            <span className="font-fira text-purple-300">{s.level}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(s)}
                className="px-3 py-1 rounded-lg bg-cyan-400 text-[#0F172A] font-bold hover:bg-cyan-300 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="px-3 py-1 rounded-lg bg-purple-400 text-[#0F172A] font-bold hover:bg-purple-300 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}