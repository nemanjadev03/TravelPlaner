import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch { setMsg('Forbidden or error'); }
    })();
  },[]);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Admin: Users</h3>
      {msg && <div className="text-sm text-red-600">{msg}</div>}
      <ul className="space-y-2">
        {users.map(u => <li key={u._id} className="flex items-center justify-between border-b border-gray-100 py-2">
          <span className="text-gray-800">{u.name} — {u.email}</span>
          <span className="text-gray-500 text-sm">{u.role}</span>
        </li>)}
      </ul>
    </div>
  );
}