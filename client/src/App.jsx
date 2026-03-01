import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./hooks/useAuth.js";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// App: defines top-level routes and wiring for auth-protected dashboards
const App = () => {
  const auth = useAuth();
  const { user } = auth;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage auth={auth} />} />


        <Route
          element={
            <ProtectedRoute auth={auth} allowedRoles={["ADMIN"]} />
          }
        >
          <Route path="/admin" element={<AdminDashboard auth={auth} />} />
        </Route>

        <Route
          element={
            <ProtectedRoute auth={auth} allowedRoles={["ADMIN", "USER"]} />
          }
        >
          <Route path="/client" element={<ClientDashboard auth={auth} />} />
        </Route>

        {/* Fall back routes */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? user.role === "ADMIN"
                    ? "/admin"
                    : "/client"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

