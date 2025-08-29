import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Cities from './pages/Cities';
import GraphView from './pages/GraphView';
import AdminUsers from './pages/AdminUsers';
import RoutesPage from './pages/RoutesPage';
import ProtectedRoute from './components/ProtectedRoute';

function Nav() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    nav('/login');
  }
  return (
    <header className="bg-white border-b border-gray-100">
      <nav className="container py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">✈️ Travel Planner</Link>
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link className="navlink" to="/login">Login</Link>
              <Link className="navlink" to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link className="navlink" to="/cities">Cities</Link>
              <Link className="navlink" to="/routes">Routes</Link>
              <Link className="navlink" to="/graph">Graph</Link>
              {role === 'admin' && <Link className="navlink" to="/admin/users">Admin</Link>}
              <button className="btn" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function IndexGate() {
  const token = localStorage.getItem('token');
  // If not logged in, land on login; if logged in, go to Graph (or any default)
  return token ? <Navigate to="/graph" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<IndexGate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cities" element={<ProtectedRoute><Cities /></ProtectedRoute>} />
          <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
          <Route path="/graph" element={<ProtectedRoute><GraphView /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}