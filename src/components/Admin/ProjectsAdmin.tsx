import { useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from 'lucide-react';

type Tag = {
  id: number;
  name: string;
};

type ProjectType = {
  id: number;
  name: string;
};

type Project = {
  github: string;
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  typeId: number;
  type: string; // type name from join
  tags?: Tag[];
};

export default function ProjectsAdmin() {
  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Omit<Project, "id" | "tags" | "type">>({
    title: "",
    description: "",
    image: "",
    link: "",
    github: "",
    typeId: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Tag management
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // Project type management
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [typeInput, setTypeInput] = useState("");
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);

  // Tech tag admin state
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Fetch all projects (with type name and tags)
  useEffect(() => {
    fetch("http://localhost:5000/api/projects/with-types", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []));
  }, [token]);

  // Fetch all tags (for both tag admin and project tag assignment)
  const fetchTags = () => {
    fetch("http://localhost:5000/api/techtags", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAllTags(Array.isArray(data) ? data : []);
        setTags(Array.isArray(data) ? data : []);
      });
  };

  useEffect(() => {
    fetchTags();
  }, [token]);

  // Fetch all project types
  const fetchProjectTypes = () => {
    fetch("http://localhost:5000/api/project-types", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjectTypes(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchProjectTypes();
  }, [token]);

  // Handle file input change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle tag checkbox toggle
  const handleTagToggle = (tagId: number) => {
    setSelectedTags(selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]);
  };

  // Project form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.typeId || !projectTypes.some(t => t.id === form.typeId)) {
      return;
    }

    let imageUrl = form.image;

    // If a new image file is selected, upload it first
    if (imageFile) {
      const data = new FormData();
      data.append("image", imageFile);
      const res = await fetch("http://localhost:5000/api/projects/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      imageUrl = result.url;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/projects/${editingId}`
      : "http://localhost:5000/api/projects";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, image: imageUrl })
    });
    if (res.ok) {
      // Get the project ID (new or edited)
      let projectId = editingId;
      if (!editingId) {
        const newProject = await res.json();
        projectId = newProject.id;
      }

      // Assign tags
      if (projectId) {
        await fetch(`http://localhost:5000/api/projects/${projectId}/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ tagIds: selectedTags })
        });
      }
      setForm({
        title: "",
        description: "",
        image: "",
        link: "",
        github: "",
        typeId: projectTypes.length > 0 ? projectTypes[0].id : 1
      });
      setImageFile(null);
      setEditingId(null);
      setSelectedTags([]);
      fetch("http://localhost:5000/api/projects/with-types", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProjects(Array.isArray(data) ? data : []));
    }
  };

  // Edit project
  const handleEdit = (project: Project) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, tags, type, ...rest } = project;
    setForm({
      ...rest,
      typeId: project.typeId,
      github: project.github || "",
      link: project.link || "",
    });
    setEditingId(project.id);
    setImageFile(null);
    setSelectedTags(tags ? tags.map(t => t.id) : []);
  };

  // Delete project
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    setProjects(projects.filter(p => p.id !== id));
  };

  // --- ProjectTypesAdmin logic ---
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingTypeId ? "PUT" : "POST";
    const url = editingTypeId
      ? `http://localhost:5000/api/project-types/${editingTypeId}`
      : "http://localhost:5000/api/project-types";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: typeInput })
    });
    setTypeInput("");
    setEditingTypeId(null);
    fetchProjectTypes();
  };

  const handleTypeEdit = (type: ProjectType) => {
    setTypeInput(type.name);
    setEditingTypeId(type.id);
  };

  const handleTypeDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/project-types/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchProjectTypes();
  };

  // --- TechTagsAdmin logic ---
  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingTagId ? "PUT" : "POST";
    const url = editingTagId
      ? `http://localhost:5000/api/techtags/${editingTagId}`
      : "http://localhost:5000/api/techtags";
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
    fetchTags();
  };

  const handleTagEdit = (tag: Tag) => {
    setTagInput(tag.name);
    setEditingTagId(tag.id);
  };

  const handleTagDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/techtags/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchTags();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-4 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* --- Project Types Management Section --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
            Manage Project Types
          </h2>
          <form onSubmit={handleTypeSubmit} className="flex gap-2 mb-4">
            <input
              value={typeInput}
              onChange={e => setTypeInput(e.target.value)}
              placeholder="Add or edit type"
              className="bg-transparent border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none placeholder:text-cyan-400"
            />
            <button
              className="bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#0F172A] px-4 py-1 rounded font-bold"
            >
              {editingTypeId ? "Update" : "Add"}
            </button>
            {editingTypeId && (
              <button
                type="button"
                onClick={() => { setEditingTypeId(null); setTypeInput(""); }}
                className="text-red-400 ml-2"
              >
                Cancel
              </button>
            )}
          </form>
          <div className="flex gap-2 flex-wrap">
            {projectTypes.map(type => (
              <span key={type.id} className="px-4 py-1 rounded-full bg-[#0F172A] border border-cyan-400 text-cyan-300 font-mono text-sm flex items-center gap-2">
                {type.name}
                <button onClick={() => handleTypeEdit(type)} className="text-yellow-400 ml-2">Edit</button>
                <button onClick={() => handleTypeDelete(type.id)} className="text-red-400 ml-1">Delete</button>
              </span>
            ))}
          </div>
        </div>

        {/* --- Tech Tags Management Section --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
            Manage Tech Tags
          </h2>
          <form onSubmit={handleTagSubmit} className="flex gap-2 mb-4">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Add or edit tag"
              className="bg-transparent border-b-2 border-cyan-400 text-white px-2 py-1 font-fira outline-none placeholder:text-cyan-400"
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
                className="bg-gradient-to-r from-pink-400 to-yellow-400 text-[#0F172A] px-4 py-1 rounded font-bold ml-2"
              >
                Cancel Edit
              </button>
            )}
          </form>
          <div className="flex gap-2 flex-wrap">
            {tags.map(tag => (
              <span key={tag.id} className="px-4 py-1 rounded-full bg-[#0F172A] border border-cyan-400 text-cyan-300 font-mono text-sm flex items-center gap-2">
                {tag.name}
                <button onClick={() => handleTagEdit(tag)} className="text-yellow-400 ml-2">Edit</button>
                <button onClick={() => handleTagDelete(tag.id)} className="text-red-400 ml-1">Delete</button>
              </span>
            ))}
          </div>
        </div>
        {/* --- Projects Management Section --- */}
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
          Manage Projects
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mb-6"
        >
          <input
            className="bg-transparent border-0 border-b-2 border-cyan-400 focus:border-lime-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            required
          />
          <input
            className="bg-transparent border-0 border-b-2 border-purple-400 focus:border-lime-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-purple-400"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
          {/* Project Type */}
          <select
            className="bg-transparent border-0 border-b-2 border-lime-400 focus:border-cyan-400 text-white font-fira px-2 py-2 outline-none transition"
            value={form.typeId}
            onChange={e => setForm({ ...form, typeId: Number(e.target.value) })}
            required
          >
            <option value="" disabled>Select type</option>
            {projectTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {/* Image upload */}
          <label className="block text-base font-fira text-lime-300 mt-2">
            Image
            <div className="relative mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 2 }}
              />
              <div
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-lime-900/40 border border-lime-400 text-lime-200 font-fira cursor-pointer"
                style={{ zIndex: 1 }}
              >
                <span>
                  {imageFile
                    ? imageFile.name
                    : form.image
                    ? "Image selected"
                    : "Choose file..."}
                </span>
                <span className="ml-4 px-3 py-1 rounded bg-gradient-to-r from-cyan-400 to-lime-400 text-[#0F172A] font-bold">
                  Browse
                </span>
              </div>
            </div>
          </label>
          {(imageFile || form.image) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.image}
              alt="Preview"
              className="mt-2 rounded-lg max-h-24"
            />
          )}
          <input
            className="bg-transparent border-0 border-b-2 border-cyan-400 focus:border-purple-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400"
            value={form.link}
            onChange={e => setForm({ ...form, link: e.target.value })}
            placeholder="Project Link"
          />
          <input
            className="bg-transparent border-0 border-b-2 border-cyan-400 focus:border-purple-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-400"
            value={form.github}
            onChange={e => setForm({ ...form, github: e.target.value })}
            placeholder="GitHub Repository URL"
          />
          {/* Tag selection */}
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map(tag => (
              <label key={tag.id} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="accent-cyan-400"
                />
                <span className="px-3 py-1 rounded-full border border-cyan-400 text-cyan-300 font-mono text-sm">{tag.name}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl font-fira text-base font-bold shadow transition hover:scale-105
              bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#10182a] mt-2"
          >
            {editingId ? "Update" : "Add"} Project
          </button>
        </form>
        <ul className="space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="p-4 rounded-xl bg-[#1e293b]/60 border border-cyan-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="font-fira text-lg text-cyan-300">{p.title}</div>
                <div className="text-lime-300 text-sm">{p.description}</div>
                {/* Tech Tags as Pills */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full border border-cyan-400 text-cyan-300 font-mono text-sm bg-transparent"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-purple-400 text-xs break-all">{p.link}</div>
                <div className="text-xs text-cyan-400 mt-1">Type: {p.type}</div>
                {p.image && (
                  <>
                    {console.log('Project image:', p.image)}
                    <img
                      src={p.image.startsWith('/uploads/') ? p.image : `/uploads/${p.image}`}
                      alt={p.title}
                      className="mt-2 rounded-lg max-h-20"
                    />
                  </>
                )}
                <div className="flex gap-2 mt-2">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
                      aria-label="View GitHub Repository"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 transition"
                      aria-label="View Live Demo"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(p)}
                  className="px-4 py-1 rounded-lg bg-cyan-400 text-[#0F172A] font-bold hover:bg-cyan-300 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="px-4 py-1 rounded-lg bg-purple-400 text-[#0F172A] font-bold hover:bg-purple-300 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}