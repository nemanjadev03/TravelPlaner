import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [meta, setMeta] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');

  async function load(page=1) {
    try {
      const { data } = await api.get('/cities', { params: { page, limit: 50, sort: 'name' } });
      setCities(data.data); setMeta(data.meta);
    } catch { setMsg('Error loading cities'); }
  }
  useEffect(()=>{ load(); }, []);

  async function add(e) {
    e.preventDefault();
    try {
      await api.post('/cities', { name, description });
      setName(''); setDescription('');
      load();
    } catch (e) { setMsg(e.response?.data?.message || 'Error'); }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Add City</h3>
        <form onSubmit={add} className="space-y-3">
          <div><div className="label">Name</div><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><div className="label">Description</div><input className="input" value={description} onChange={e=>setDescription(e.target.value)} /></div>
          <button className="btn">Add</button>
        </form>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Cities ({meta.total || cities.length})</h3>
        <ul className="space-y-2">
          {cities.map(c => <li key={c._id} className="flex items-center justify-between border-b border-gray-100 py-2">
            <span className="text-gray-800">{c.name}</span>
            <span className="text-gray-500 text-sm">{c.description}</span>
          </li>)}
        </ul>
      </div>
    </div>
  );
}