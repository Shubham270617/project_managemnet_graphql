import React, { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CLIENT,
  DELETE_CLIENT,
  GET_CLIENTS,
} from "../../graphql/operations.js";

const ClientsSection = ({ isAdmin }) => {
  const client = useApolloClient(); // it is giving me the Apollo client instance

  const { data, loading, error } = useQuery(GET_CLIENTS, {
    skip: !isAdmin,
  });
  const [createClient, { loading: creating }] = useMutation(CREATE_CLIENT);
  const [deleteClient, { loading: deleting }] = useMutation(DELETE_CLIENT);

  // Explicit fetchQuery-style helper using Apollo Client
  const fetchClientsQuery = async () => {
    await client.query({
      query: GET_CLIENTS,
      fetchPolicy: "network-only",
    });
  };

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState(""); // stores backend validation errors

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await createClient({ variables: form });
      await fetchClientsQuery();
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      setFormError(err.message ?? "Failed to create client");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client? Projects will be unassigned.")) {
      return;
    }
    try {
      await deleteClient({ variables: { id } });
      await fetchClientsQuery();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) {
    return (
      <p className="text-sm text-slate-400">
        Only admins can manage clients.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Clients</h2>
        {loading && <p className="text-sm text-slate-400">Loading clients...</p>}
        {error && (
          <p className="text-sm text-red-400">
            Failed to load clients: {error.message}
          </p>
        )}
        {data?.getClients?.length ? (
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {data.getClients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-2">{client.name}</td>
                    <td className="px-4 py-2">{client.email}</td>
                    <td className="px-4 py-2">{client.phone}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deleting}
                        className="text-xs px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="text-sm text-slate-400">No clients yet. Add one.</p>
          )
        )}
      </div>

      <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/60">
        <h3 className="text-sm font-semibold mb-3">Add Client</h3>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <div className="flex gap-3">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
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
      </div>
    </div>
  );
};

export default ClientsSection;

