import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';

export default function RoutesPage() {
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distance, setDistance] = useState('');
  const [msg, setMsg] = useState('');

  const nameById = useMemo(() => Object.fromEntries(cities.map(c => [c._id, c.name])), [cities]);

  async function load() {
    try {
      const c = await api.get('/cities', { params: { limit: 200 } });
      setCities(c.data.data);
      const r = await api.get('/routes', { params: { limit: 200 } });
      setRoutes(r.data.data);
    } catch (e) { setMsg('Error loading data'); }
  }
  useEffect(()=>{ load(); }, []);

  async function add(e) {
    e.preventDefault();
    try {
      await api.post('/routes', { from, to, distance: Number(distance), bidirectional: true });
      setFrom(''); setTo(''); setDistance('');
      load();
    } catch (e) { setMsg(e.response?.data?.message || 'Error'); }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Create Route</h3>
        <form onSubmit={add} className="space-y-3">
          <div>
            <div className="label">From</div>
            <select className="input" value={from} onChange={e=>setFrom(e.target.value)}>
              <option value="">Select city</option>
              {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <div className="label">To</div>
            <select className="input" value={to} onChange={e=>setTo(e.target.value)}>
              <option value="">Select city</option>
              {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <div className="label">Distance (km)</div>
            <input className="input" type="number" value={distance} onChange={e=>setDistance(e.target.value)} />
          </div>
          <button className="btn">Add route</button>
        </form>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Routes ({routes.length})</h3>
        <ul className="space-y-2">
          {routes.map(r => (
            <li key={r._id} className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="text-gray-800">{nameById[r.from?._id || r.from]} → {nameById[r.to?._id || r.to]}</span>
              <span className="text-gray-500 text-sm">{r.distance} km</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}