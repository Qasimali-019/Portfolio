import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type FooterData = {
  brand: string;
  brandDesc: string;
  navLinks: { name: string; href: string }[];
  contact: { email: string; location: string; note: string };
  copyright: string;
  powered: string;
};

export default function FooterAdmin() {
  const [footer, setFooter] = useState<FooterData>({
    brand: "",
    brandDesc: "",
    navLinks: [],
    contact: { email: "", location: "", note: "" },
    copyright: "",
    powered: "",
  });
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/footer")
      .then(res => res.json())
      .then(data => setFooter({
        brand: data.brand || "",
        brandDesc: data.brandDesc || "",
        navLinks: data.navLinks || [],
        contact: data.contact || { email: "", location: "", note: "" },
        copyright: data.copyright || "",
        powered: data.powered || "",
      }));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/footer", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(footer)
    });
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto glassmorphism p-8 rounded-2xl shadow-xl bg-[#0F172A]/80 border border-lime-400/20 backdrop-blur-md"
    >
      <h2 className="text-2xl font-fira text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
        {editing ? "Edit Footer" : "Footer Preview"}
      </h2>
      {editing ? (
        <form onSubmit={handleSave}>
          <input
            value={footer.brand}
            onChange={e => setFooter(f => ({ ...f, brand: e.target.value }))}
            placeholder="Brand"
            className="w-full border-b border-lime-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <input
            value={footer.brandDesc}
            onChange={e => setFooter(f => ({ ...f, brandDesc: e.target.value }))}
            placeholder="Brand Description"
            className="w-full border-b border-lime-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <h4 className="text-lg font-bold mb-2 text-cyan-300">Quick Links</h4>
          {footer.navLinks.map((link, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={link.name}
                onChange={e => {
                  const newLinks = [...footer.navLinks];
                  newLinks[idx].name = e.target.value;
                  setFooter(f => ({ ...f, navLinks: newLinks }));
                }}
                placeholder="Name"
                className="w-1/3 border-b border-cyan-400 bg-transparent text-white px-2 py-1"
              />
              <input
                value={link.href}
                onChange={e => {
                  const newLinks = [...footer.navLinks];
                  newLinks[idx].href = e.target.value;
                  setFooter(f => ({ ...f, navLinks: newLinks }));
                }}
                placeholder="Href"
                className="w-1/2 border-b border-lime-400 bg-transparent text-white px-2 py-1"
              />
              <button type="button" onClick={() => setFooter(f => ({ ...f, navLinks: f.navLinks.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600">Delete</button>
            </div>
          ))}
          <button type="button" onClick={() => setFooter(f => ({ ...f, navLinks: [...f.navLinks, { name: "", href: "" }] }))} className="mb-4 px-3 py-1 bg-gradient-to-r from-cyan-400 to-lime-400 text-[#0F172A] rounded font-bold">Add Link</button>
          <h4 className="text-lg font-bold mb-2 text-cyan-300">Contact Info</h4>
          <input
            value={footer.contact.email}
            onChange={e => setFooter(f => ({ ...f, contact: { ...f.contact, email: e.target.value } }))}
            placeholder="Email"
            className="w-full border-b border-cyan-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <input
            value={footer.contact.location}
            onChange={e => setFooter(f => ({ ...f, contact: { ...f.contact, location: e.target.value } }))}
            placeholder="Location"
            className="w-full border-b border-cyan-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <input
            value={footer.contact.note}
            onChange={e => setFooter(f => ({ ...f, contact: { ...f.contact, note: e.target.value } }))}
            placeholder="Note"
            className="w-full border-b border-cyan-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <input
            value={footer.copyright}
            onChange={e => setFooter(f => ({ ...f, copyright: e.target.value }))}
            placeholder="Copyright"
            className="w-full border-b border-lime-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <input
            value={footer.powered}
            onChange={e => setFooter(f => ({ ...f, powered: e.target.value }))}
            placeholder="Powered by"
            className="w-full border-b border-lime-400 bg-transparent text-white py-2 px-2 mb-3"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="py-2 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#0F172A] font-bold text-lg shadow transition hover:scale-105 mb-6"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="py-2 px-6 rounded-xl bg-gradient-to-r from-pink-400 to-yellow-400 text-[#0F172A] font-bold text-lg shadow transition hover:scale-105 mb-6"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="text-xl font-bold text-cyan-300 mb-2">{footer.brand}</h3>
          <div className="text-lime-300 mb-2">{footer.brandDesc}</div>
          <div className="mb-2">
            <span className="text-cyan-300 font-bold">Quick Links: </span>
            {footer.navLinks.map((l, i) => (
              <span key={i} className="text-white mr-2">{l.name}</span>
            ))}
          </div>
          <div className="mb-2">
            <span className="text-cyan-300 font-bold">Contact: </span>
            {footer.contact.email} | {footer.contact.location} | {footer.contact.note}
          </div>
          <div className="mb-2">
            <span className="text-cyan-300 font-bold">Copyright: </span>
            {footer.copyright}
          </div>
          <div className="mb-2">
            <span className="text-cyan-300 font-bold">Powered by: </span>
            {footer.powered}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="py-2 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#10182a] font-bold text-lg shadow transition hover:scale-105 mb-6"
          >
            Edit Footer
          </button>
        </>
      )}
    </motion.div>
  );
}