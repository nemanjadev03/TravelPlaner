import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    // Clear any stale tokens when hitting login page
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      setMsg('Logged in');
      nav('/graph');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Login</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <div className="label">Email</div>
            <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn w-full">Login</button>
        </form>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </div>
    </div>
  );
}