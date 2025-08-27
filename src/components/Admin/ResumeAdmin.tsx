import { useRef, useState, useEffect } from "react";

export default function ResumeAdmin() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resumeExists, setResumeExists] = useState(false);
  const token = localStorage.getItem("token");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if resume exists
  const checkResume = async () => {
    const res = await fetch("http://localhost:5000/uploads/resume/resume.pdf", { method: "HEAD" });
    setResumeExists(res.ok);
    setUploadedFileName(res.ok ? "resume.pdf" : null);
  };

  useEffect(() => {
    checkResume();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setMessage("");
    const data = new FormData();
    data.append("resume", file);
    const res = await fetch("http://localhost:5000/api/resume/upload", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: data
    });
    if (res.ok) {
      setMessage("Resume uploaded!");
      setFile(null);
      setUploadedFileName("resume.pdf");
      if (fileInputRef.current) fileInputRef.current.value = "";
      checkResume();
    } else setMessage("Upload failed.");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setMessage("");
    const res = await fetch("http://localhost:5000/api/resume/delete", {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setMessage("Resume deleted!");
      setFile(null);
      setUploadedFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      checkResume();
    } else setMessage("Delete failed.");
    setDeleting(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 rounded-2xl border border-cyan-900/40 bg-[#10182a] shadow-lg">
      <h2 className="text-2xl font-fira text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent">
        Upload Resume
      </h2>
      {/* Themed file input */}
      <label className="block mb-4">
        <span className="block text-lg font-fira text-cyan-300 mb-1">Select PDF</span>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 2 }}
          />
          <div
            className="flex items-center justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-lime-900/40 border border-lime-400 text-lime-200 font-fira cursor-pointer"
            style={{ zIndex: 1 }}
          >
            <span>
              {uploadedFileName || "Choose file..."}
            </span>
            <span className="ml-4 px-3 py-1 rounded bg-gradient-to-r from-cyan-400 to-lime-400 text-[#0F172A] font-bold">
              Browse
            </span>
          </div>
        </div>
      </label>
      {/* Themed upload button */}
      <button
        onClick={handleUpload}
        className="
          w-full py-3 rounded-xl font-fira text-lg font-bold shadow transition
          bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400
          text-[#10182a]
          hover:scale-105
          hover:from-cyan-300 hover:via-purple-300 hover:to-lime-300
          border-2 border-transparent
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
          tracking-wide
        "
      >
        <span className="drop-shadow">Upload Resume</span>
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-full py-3 mt-4 rounded-xl font-fira text-lg font-bold shadow transition
          bg-gradient-to-r from-red-400 to-pink-400 text-[#10182a]
          hover:scale-105
          border-2 border-transparent
          focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
          tracking-wide
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deleting ? "Deleting..." : "Delete Resume"}
      </button>
      {message && <div className="mt-4 text-lime-300">{message}</div>}
      {resumeExists && (
        <div className="mt-6">
          <a
  href="http://localhost:5000/uploads/resume/resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="text-cyan-400 underline"
>
  View Current Resume
</a>
        </div>
      )}
    </div>
  );
}