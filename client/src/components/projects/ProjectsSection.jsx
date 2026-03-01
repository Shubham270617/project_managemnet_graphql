import React, { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  GET_CLIENTS,
  GET_PROJECTS,
  UPDATE_PROJECT_STATUS,
} from "../../graphql/operations.js";

const ProjectsSection = ({ user, isAdmin }) => {
  const client = useApolloClient();

  const { data, loading, error } = useQuery(GET_PROJECTS);
  const { data: clientsData } = useQuery(GET_CLIENTS, {
    skip: !isAdmin,
  });

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT);
  const [updateStatus] = useMutation(UPDATE_PROJECT_STATUS);
  const [deleteProject, { loading: deleting }] = useMutation(DELETE_PROJECT);

  // Explicit fetchQuery-style helper using Apollo Client
  const fetchProjectsQuery = async () => {
    await client.query({
      query: GET_PROJECTS,
      fetchPolicy: "network-only",
    });
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await createProject({
        variables: {
          title: form.title,
          description: form.description,
          assignedTo: form.assignedTo,
        },
      });
      await fetchProjectsQuery();
      setForm({ title: "", description: "", assignedTo: "" });
    } catch (err) {
      setFormError(err.message ?? "Failed to create project");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ variables: { id, status } });
      await fetchProjectsQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject({ variables: { id } });
      await fetchProjectsQuery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        {user && (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
            Logged in as {user.name} ({user.role})
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-slate-400">Loading projects...</p>}
      {error && (
        <p className="text-sm text-red-400">
          Failed to load projects: {error.message}
        </p>
      )}

      {data?.getProjects?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.getProjects.map((project) => (
            <div
              key={project.id}
              className="border border-slate-700 rounded-lg p-4 bg-slate-900/70 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-slate-300">
                    {project.description}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    project.status === "COMPLETED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                      : project.status === "IN_PROGRESS"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-700/60 text-slate-200 border border-slate-500/60"
                  }`}
                >
                  {project.status.replace("_", " ")}
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p>
                  <span className="font-medium text-slate-200">
                    Assigned to:
                  </span>{" "}
                  {project.assignedTo
                    ? project.assignedTo.name
                    : "— (unassigned)"}
                </p>
                <p>
                  <span className="font-medium text-slate-200">
                    Created by:
                  </span>{" "}
                  {project.createdBy?.name ?? "Unknown"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 mt-2">
                <div className="flex gap-2 items-center">
                  <label className="text-xs text-slate-400">Status:</label>
                  <select
                    value={project.status}
                    onChange={(e) =>
                      handleStatusChange(project.id, e.target.value)
                    }
                    className="text-xs rounded-md bg-slate-950 border border-slate-700 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="NOT_STARTED">Not started</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting}
                    className="text-xs px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-sm text-slate-400">
            No projects yet. Admin can add new projects.
          </p>
        )
      )}

      {isAdmin && (
        <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/60">
          <h3 className="text-sm font-semibold mb-3">Add Project</h3>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <div className="flex gap-3">
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Assign to client…</option>
                {clientsData?.getClients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium whitespace-nowrap disabled:opacity-60"
              >
                {creating ? "Saving..." : "Add"}
              </button>
            </div>
          </form>
          {formError && (
            <p className="mt-2 text-xs text-red-400">{formError}</p>
          )}
          {!clientsData?.getClients?.length && (
            <p className="mt-2 text-xs text-amber-300">
              You need at least one client to assign a project.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;

