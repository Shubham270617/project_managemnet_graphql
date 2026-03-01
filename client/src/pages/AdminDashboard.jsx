import React, { useState } from "react";
import ProjectsSection from "../components/projects/ProjectsSection.jsx";
import ClientsSection from "../components/clients/ClientsSection.jsx";

// Admin dashboard: can see/manage both projects and clients
const AdminDashboard = ({ auth }) => {
  const { user, logout } = auth;
  const [tab, setTab] = useState("projects"); // 'projects' | 'clients'

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">
              Manage projects and clients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-md border border-slate-600 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900/70 overflow-hidden text-sm">
          <button
            type="button"
            className={`px-4 py-2 ${
              tab === "projects"
                ? "bg-emerald-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
            onClick={() => setTab("projects")}
          >
            Projects
          </button>
          <button
            type="button"
            className={`px-4 py-2 ${
              tab === "clients"
                ? "bg-emerald-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
            onClick={() => setTab("clients")}
          >
            Clients
          </button>
        </div>

        {tab === "projects" ? (
          <ProjectsSection user={user} isAdmin={isAdmin} />
        ) : (
          <ClientsSection isAdmin={isAdmin} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

