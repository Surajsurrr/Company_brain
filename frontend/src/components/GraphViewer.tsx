import React, { useEffect, useRef, useState } from 'react';
import { GraphData, EntityNode, RelationEdge } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Eye, Layers } from 'lucide-react';

interface GraphViewerProps {
  graphData: GraphData;
  highlightedNodeIds?: string[];
  onSelectNode: (node: EntityNode) => void;
  selectedNodeId?: string;
}

interface SimNode extends EntityNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const TYPE_COLORS: Record<string, string> = {
  carrier: '#3b82f6',
  invoice: '#ec4899',
  contract: '#8b5cf6',
  incident: '#ef4444',
  email: '#f59e0b',
  shipment: '#10b981',
  route: '#06b6d4',
  unknown: '#94a3b8'
};

export const GraphViewer: React.FC<GraphViewerProps> = ({
  graphData,
  highlightedNodeIds = [],
  onSelectNode,
  selectedNodeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1.0 });
  const isDraggingRef = useRef(false);
  const draggedNodeRef = useRef<SimNode | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Initialize simulation nodes
  useEffect(() => {
    if (!graphData || !graphData.nodes.length) return;

    const width = 1000;
    const height = 650;
    const existingMap = new Map(simNodesRef.current.map(n => [n.id, n]));

    const newNodes: SimNode[] = graphData.nodes.map((node, i) => {
      const existing = existingMap.get(node.id);
      const angle = (i / graphData.nodes.length) * 2 * Math.PI;
      const radius = 220 + (i % 3) * 60;
      return {
        ...node,
        x: existing ? existing.x : width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: existing ? existing.y : height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: existing ? existing.vx : 0,
        vy: existing ? existing.vy : 0,
        radius: node.type === 'carrier' ? 24 : node.type === 'incident' ? 22 : node.type === 'invoice' ? 20 : 18,
        color: TYPE_COLORS[node.type] || '#94a3b8'
      };
    });

    simNodesRef.current = newNodes;
  }, [graphData]);

  // Main canvas animation loop with physics simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const nodes = simNodesRef.current;
      const edges = graphData.edges || [];

      // Simple force-directed physics step
      const kRepulsion = 1400;
      const kSpring = 0.04;
      const centerDamping = 0.015;

      // 1. Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          if (dist < 320) {
            const force = kRepulsion / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].vx -= fx;
            nodes[i].vy -= fy;
            nodes[j].vx += fx;
            nodes[j].vy += fy;
          }
        }
      }

      // 2. Spring attraction along edges
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = 130;
          const force = (dist - desiredDist) * kSpring;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      }

      // 3. Center gravity & friction
      for (const node of nodes) {
        if (node === draggedNodeRef.current) continue;
        node.vx += ((width / 2) - node.x) * centerDamping;
        node.vy += ((height / 2) - node.y) * centerDamping;
        node.vx *= 0.88;
        node.vy *= 0.88;
        node.x += node.vx;
        node.y += node.vy;
      }

      // --- RENDER CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw Edges
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        // Filter visibility
        if (activeFilter !== 'all' && source.type !== activeFilter && target.type !== activeFilter) {
          continue;
        }

        const isHighlighted = highlightedNodeIds.includes(source.id) && highlightedNodeIds.includes(target.id);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 3.2;
          ctx.shadowColor = '#6366f1';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Edge Label if highlighted or zoomed in
        if (isHighlighted || transform.k > 1.3) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          ctx.font = '10px "Inter", sans-serif';
          ctx.fillStyle = isHighlighted ? '#4338ca' : '#64748b';
          ctx.textAlign = 'center';
          ctx.fillText(edge.relation, midX, midY - 4);
        }
      }

      // Draw Nodes
      for (const node of nodes) {
        if (activeFilter !== 'all' && node.type !== activeFilter) {
          continue;
        }

        const isHighlighted = highlightedNodeIds.includes(node.id);
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Outer Glow / Halo for Highlighted / Selected Nodes
        if (isHighlighted || isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(37, 99, 235, 0.2)' : 'rgba(124, 58, 237, 0.18)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeStyle = isSelected ? '#2563eb' : '#ffffff';
        ctx.stroke();

        // Node Label
        ctx.font = `700 ${node.type === 'carrier' ? 12 : 11}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isHighlighted || isSelected ? '#0f172a' : '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);

        // Type pill under label
        ctx.font = '9px "Inter", sans-serif';
        ctx.fillStyle = node.color;
        ctx.fillText(node.type.toUpperCase(), node.x, node.y + node.radius + 27);
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [graphData, highlightedNodeIds, selectedNodeId, activeFilter, transform, hoveredNode]);

  // Set up canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  // Mouse interaction handlers
  const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    return {
      x: (screenX - transform.x) / transform.k,
      y: (screenY - transform.y) / transform.k
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);
    const nodes = simNodesRef.current;
    let clickedNode: SimNode | null = null;

    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = pos.x - n.x;
      const dy = pos.y - n.y;
      if (dx * dx + dy * dy <= n.radius * n.radius) {
        clickedNode = n;
        break;
      }
    }

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      onSelectNode(clickedNode);
    } else {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = pos.x;
      draggedNodeRef.current.y = pos.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hover detection
    const nodes = simNodesRef.current;
    let found: SimNode | null = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = pos.x - n.x;
      const dy = pos.y - n.y;
      if (dx * dx + dy * dy <= n.radius * n.radius) {
        found = n;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.4, Math.min(3.0, prev.k * zoomFactor))
    }));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '560px', overflow: 'hidden', background: '#fcfbfe' }}>
      {/* Top Controls & Category Filters */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.94)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(12px)',
          pointerEvents: 'auto',
          flexWrap: 'wrap'
        }}>
          {['all', 'carrier', 'invoice', 'contract', 'incident', 'email', 'shipment', 'route'].map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: activeFilter === type ? '#0f172a' : 'transparent',
                color: activeFilter === type ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {type === 'all' ? 'All Entities' : type + 's'}
            </button>
          ))}
        </div>

        {/* View Zoom & Center Controls */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.94)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setTransform(t => ({ ...t, k: Math.min(2.8, t.k * 1.2) }))}
            style={{ padding: '6px 10px', borderRadius: '8px', background: 'transparent', color: '#334155', border: 'none', cursor: 'pointer' }}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setTransform(t => ({ ...t, k: Math.max(0.4, t.k * 0.8) }))}
            style={{ padding: '6px 10px', borderRadius: '8px', background: 'transparent', color: '#334155', border: 'none', cursor: 'pointer' }}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setTransform({ x: 0, y: 0, k: 1.0 })}
            style={{ padding: '6px 10px', borderRadius: '8px', background: 'transparent', color: '#334155', border: 'none', cursor: 'pointer' }}
            title="Reset View"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: hoveredNode ? 'pointer' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Hover Tooltip */}
      {hoveredNode && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          maxWidth: '340px',
          background: '#ffffff',
          borderRadius: '14px',
          border: `1px solid rgba(0, 0, 0, 0.08)`,
          padding: '14px 18px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
          pointerEvents: 'none',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: hoveredNode.color,
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: hoveredNode.color }}>
              {hoveredNode.type}
            </span>
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            {hoveredNode.label}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
            {hoveredNode.summary || 'Operational node in Company Knowledge Graph.'}
          </div>
        </div>
      )}

      {/* Subgraph Traversal Legend */}
      {highlightedNodeIds.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '10px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#c7d2fe',
          backdropFilter: 'blur(12px)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#6366f1',
            boxShadow: '0 0 10px #6366f1'
          }} />
          <span><b>{highlightedNodeIds.length} Entities Traversed</b> in active causal chain</span>
        </div>
      )}
    </div>
  );
};
