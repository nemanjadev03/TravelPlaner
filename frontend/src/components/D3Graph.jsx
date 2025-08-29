import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function D3Graph({ nodes = [], edges = [], highlightedPath = [] }) {
  const ref = useRef();

  useEffect(() => {
    const width = 900, height = 560;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const nodeData = nodes.map(n => ({ id: n.id, name: n.name }));
    const linkData = edges.map(e => ({ source: e.from, target: e.to, distance: e.distance }));

    const simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(d => (d.distance || 100)))
      .force('charge', d3.forceManyBody().strength(-260))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g').attr('stroke', '#9ca3af').attr('stroke-opacity', 0.8)
      .selectAll('line').data(linkData).join('line').attr('stroke-width', d => Math.max(1, Math.sqrt(d.distance || 1)));

    const node = svg.append('g')
      .selectAll('circle').data(nodeData).join('circle')
      .attr('r', 8).attr('fill', '#111827')
      .call(drag(simulation));

    const label = svg.append('g')
      .selectAll('text').data(nodeData).join('text')
      .text(d => d.name).attr('font-size', 12).attr('dx', 10).attr('dy', 4).attr('fill', '#374151');

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('cx', d => d.x).attr('cy', d => d.y);
      label.attr('x', d => d.x).attr('y', d => d.y);
    });

    // Highlight path
    if (Array.isArray(highlightedPath) && highlightedPath.length > 1) {
      const set = new Set();
      for (let i=0;i<highlightedPath.length-1;i++) {
        set.add(`${highlightedPath[i]}-${highlightedPath[i+1]}`);
        set.add(`${highlightedPath[i+1]}-${highlightedPath[i]}`);
      }
      link.attr('stroke', d => set.has(`${d.source.id}-${d.target.id}`) ? '#ef4444' : '#9ca3af')
          .attr('stroke-width', d => set.has(`${d.source.id}-${d.target.id}`) ? 4 : Math.max(1, Math.sqrt(d.distance || 1)));
    }

    function drag(sim) {
      function dragstarted(event, d) { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
      function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
      function dragended(event, d) { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }
      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    }

    return () => simulation.stop();
  }, [nodes, edges, highlightedPath]);

  return <svg ref={ref} width={900} height={560} className="w-full h-[560px] rounded-2xl border border-gray-200" />;
}