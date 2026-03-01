import React from "react";
import ProjectsSection from "../components/projects/ProjectsSection.jsx";

// Client dashboard: can see projects and update their status
const ClientDashboard = ({ auth }) => {
  const { user, logout } = auth;
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Client Dashboard</h1>
            <p className="text-xs text-slate-400">
              View and update assigned projects
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
        <ProjectsSection user={user} isAdmin={isAdmin} />
      </main>
    </div>
  );
};

export default ClientDashboard;

