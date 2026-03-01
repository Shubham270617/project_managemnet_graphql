import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import * as Yup from "yup";
import { LOGIN, SIGNUP } from "../../graphql/operations.js";

const AuthForms = ({ onAuth }) => {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [loginMutation, { loading: loggingIn }] = useMutation(LOGIN);
  const [signupMutation, { loading: signingUp }] = useMutation(SIGNUP);

  // Used the  Validation schema
  const getSchema = () =>
    Yup.object({
      name:
        mode === "signup"
          ? Yup.string()
            .min(3, "Name must be at least 3 characters")
            .required("Name is required")
          : Yup.string(),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    try {
      const schema = getSchema();
      await schema.validate(form, { abortEarly: false });

      if (mode === "login") {
        const { data } = await loginMutation({
          variables: { email: form.email, password: form.password },
        });
        onAuth(data.login.token, data.login.user);
      } else {
        const { data } = await signupMutation({
          variables: {
            name: form.name,
            email: form.email,
            password: form.password,
          },
        });
        onAuth(data.signup.token, data.signup.user);
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((error) => {
          fieldErrors[error.path] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setServerError(err.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/80 rounded-xl shadow-lg p-8 border border-slate-700">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Project Management
        </h1>

        {/* Mode Switch */}
        <div className="flex mb-6 rounded-lg overflow-hidden border border-slate-700">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium ${mode === "login"
              ? "bg-emerald-500 text-white"
              : "bg-slate-900 text-slate-300"
              }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium ${mode === "signup"
              ? "bg-emerald-500 text-white"
              : "bg-slate-900 text-slate-300"
              }`}
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          {mode === "signup" && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Backend Error */}
          {serverError && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
              {serverError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loggingIn || signingUp}
            className="w-full py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {mode === "login"
              ? loggingIn
                ? "Logging in..."
                : "Login"
              : signingUp
                ? "Signing up..."
                : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForms;