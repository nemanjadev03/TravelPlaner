import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      setMsg('Account created. Please log in.');
      setTimeout(() => nav('/login'), 800);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Register</h3>
        <form onSubmit={submit} className="space-y-3">
          <div><div className="label">Name</div><input className="input" placeholder="name" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><div className="label">Email</div><input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><div className="label">Password</div><input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <button className="btn w-full">Create account</button>
        </form>
        {msg && <div className="text-sm text-green-600 mt-2">{msg}</div>}
      </div>
    </div>
  );
}