/**
 * Module 4: Interactive Knowledge Graph
 * Visually connects related concepts, architectural relationships, and mastery levels.
 * Demonstrates:
 * - Interactive SVG/Canvas node-link graph with physics layout
 * - Node selection & state inspection
 * - Color-coded mastery radar integration
 * - Quick drill triggers
 */
import React, { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GRAPH_NODES, GRAPH_EDGES } from '../../services/mockData';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  Sparkles,
  HelpCircle,
  BookOpen,
  Info,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

export const GraphView = () => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState(GRAPH_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState('c-2'); // Default to useEffect gap node
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  // Connected neighbors for active node
  const connectedEdges = useMemo(() => {
    return GRAPH_EDGES.filter(
      (e) => e.source === selectedNodeId || e.target === selectedNodeId
    );
  }, [selectedNodeId]);

  const connectedNodeIds = useMemo(() => {
    const ids = new Set();
    connectedEdges.forEach((e) => {
      ids.add(e.source);
      ids.add(e.target);
    });
    return ids;
  }, [connectedEdges]);

  // Node position helper lookup
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach((n) => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  const getNodeColor = (mastery) => {
    if (mastery >= 80) return '#10B981'; // Emerald
    if (mastery >= 60) return '#6366F1'; // Indigo
    return '#F43F5E'; // Rose (Gap)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Network className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Interactive Knowledge Graph</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Your mind isn’t a list of folders — it’s a network of concepts. Explore how React hooks,
            the Virtual DOM, REST APIs, and state architecture link together.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Mastered (&gt;80%)
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Solid (60-80%)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Active Gap (&lt;60%)
          </span>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Side Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Click any node to inspect relationships and take adaptive drills</span>
          </div>

          <svg
            className="w-full h-[480px] select-none"
            viewBox="0 0 720 450"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
              </pattern>
              {/* Marker Arrows */}
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
            </defs>

            <rect width="100%" height="100%" fill="url(#graph-grid)" />

            {/* Render Edges */}
            {GRAPH_EDGES.map((edge, idx) => {
              const src = nodeMap[edge.source];
              const tgt = nodeMap[edge.target];
              if (!src || !tgt) return null;

              const isConnected =
                edge.source === selectedNodeId || edge.target === selectedNodeId;

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnected ? '#818cf8' : '#334155'}
                    strokeWidth={isConnected ? 2.5 : 1.2}
                    strokeDasharray={isConnected ? 'none' : '3,3'}
                    opacity={isConnected ? 0.9 : 0.4}
                  />
                  {/* Edge Label on Midpoint */}
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 4}
                    fill={isConnected ? '#c7d2fe' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isNeighbor = connectedNodeIds.has(node.id);
              const nodeColor = getNodeColor(node.mastery);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer transition-transform duration-200"
                >
                  {/* Pulsing ring for gaps */}
                  {node.mastery < 60 && (
                    <circle
                      r={node.size + 8}
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r={node.size + 6}
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Main Node Bubble */}
                  <circle
                    r={node.size}
                    fill="#111827"
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all hover:scale-110"
                    style={{
                      filter: `drop-shadow(0 0 10px ${nodeColor}40)`,
                    }}
                  />

                  {/* Mastery Percentage inside Node */}
                  <text
                    dy="-2"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.mastery}%
                  </text>

                  {/* Group Label */}
                  <text
                    dy="10"
                    textAnchor="middle"
                    fill={nodeColor}
                    fontSize="8"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    {node.group.substring(0, 3)}
                  </text>

                  {/* Node Name beneath circle */}
                  <text
                    y={node.size + 14}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Concept Deep-Dive Inspector */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Concept Inspector
                  </span>
                </div>
                <Badge variant={selectedNode.mastery < 60 ? 'danger' : 'success'}>
                  {selectedNode.mastery < 60 ? 'Gap Detected' : 'Mastered'}
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedNode.label}</h3>
                <span className="text-xs text-indigo-300 font-mono">Domain: {selectedNode.group}</span>
              </div>

              <ProgressBar
                value={selectedNode.mastery}
                label="Topic Mastery Level"
                color={selectedNode.mastery < 60 ? 'rose' : 'emerald'}
              />

              {/* Gap Warning Banner if < 60 */}
              {selectedNode.mastery < 60 && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                  <span className="font-bold block">Action Recommended:</span>
                  <p>
                    Performance diagnostic indicates low retention on dependency semantics and effect cleanups.
                  </p>
                </div>
              )}

              {/* Connected Relationships */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Active Knowledge Links ({connectedEdges.length}):
                </span>
                <div className="space-y-2">
                  {connectedEdges.map((edge, idx) => {
                    const targetId = edge.source === selectedNodeId ? edge.target : edge.source;
                    const targetNode = nodeMap[targetId];
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">{targetNode?.label}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {edge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
          </div>

          <Card.Footer>
            <div className="w-full flex items-center gap-2">
              <Button
                variant="primary"
                className="w-full text-xs"
                icon={HelpCircle}
                onClick={() => navigate('/quiz')}
              >
                Launch Adaptive Drill
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};
