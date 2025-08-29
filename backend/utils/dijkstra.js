
function dijkstra(adj, start, target) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const nodes = Object.keys(adj);

  nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
  if (!nodes.includes(start) || !nodes.includes(target)) {
    return { distance: Infinity, path: [], message: 'start or target not in graph' };
  }
  dist[start] = 0;

  while (visited.size < nodes.length) {
    let u = null, min = Infinity;
    for (const n of nodes) if (!visited.has(n) && dist[n] < min) { min = dist[n]; u = n; }
    if (u === null) break;
    if (u === target) break;
    visited.add(u);
    for (const { node: v, weight } of (adj[u] || [])) {
      if (visited.has(v)) continue;
      const alt = dist[u] + weight;
      if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
    }
  }

  if (dist[target] === Infinity) return { distance: Infinity, path: [], message: 'no path' };
  const path = []; let cur = target;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { distance: dist[target], path };
}

module.exports = dijkstra;