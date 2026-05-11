import { Route, Routes, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FolderExplorer from "./pages/FolderExplorer.jsx";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="folders/:id" element={<FolderExplorer />} />
      </Route>
    </Routes>
  </AuthProvider>
);

export default App;
