import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import D3Graph from '../components/D3Graph';

export default function GraphView() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState('');

  const nameById = useMemo(() => Object.fromEntries(graph.nodes.map(n => [n.id, n.name])), [graph.nodes]);

  async function load() {
    try {
      const { data } = await api.get('/graph/export');
      setGraph(data);
    } catch { setMsg('Error loading graph'); }
  }
  useEffect(()=>{ load(); }, []);

  async function shortest() {
    try {
      const { data } = await api.post('/graph/shortest', { fromId, toId });
      setResult(data);
    } catch { setMsg('Error computing shortest'); }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card p-6 lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">Shortest Path</h3>
        <div className="space-y-3">
          <div>
            <div className="label">From</div>
            <select className="input" value={fromId} onChange={e=>setFromId(e.target.value)}>
              <option value="">Select city</option>
              {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
          <div>
            <div className="label">To</div>
            <select className="input" value={toId} onChange={e=>setToId(e.target.value)}>
              <option value="">Select city</option>
              {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
          <button className="btn w-full" onClick={shortest} disabled={!fromId || !toId}>Find shortest</button>
          <div className="text-sm text-gray-600">
            {result ? (
              <>
                <div><b>Distance:</b> {result.distance} km</div>
                <div><b>Path:</b> {result.pathNames?.join(' → ')}</div>
              </>
            ) : 'Pick two cities and run search.'}
          </div>
        </div>
      </div>
      <div className="card p-4 lg:col-span-2">
        <D3Graph nodes={graph.nodes} edges={graph.edges} highlightedPath={result?.pathIds} />
      </div>
    </div>
  );
}