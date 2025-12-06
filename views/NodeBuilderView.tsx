import React from 'react';
import { Agent } from '../types';
import { X, Play, Save, Box, ArrowRight, Zap, Settings, Database, Activity, GitCommit, Shield, Cpu } from 'lucide-react';

interface NodeBuilderViewProps {
  agent: Agent;
  onClose: () => void;
}

const Node = ({ title, icon: Icon, color, x, y, inputs = [], outputs = [], value }: any) => (
  <div 
    className="absolute w-48 bg-gray-950 border border-gray-800 rounded-lg shadow-xl flex flex-col group hover:border-gray-600 transition-colors cursor-grab active:cursor-grabbing"
    style={{ left: x, top: y }}
  >
    {/* Header */}
    <div className={`h-1 w-full rounded-t-lg ${color}`}></div>
    <div className="p-3 border-b border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-gray-400 group-hover:text-white" />
        <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">{title}</span>
      </div>
    </div>
    
    {/* Body */}
    <div className="p-3 bg-gray-900/50">
       {value && <div className="text-center font-mono text-sm font-bold text-gray-300">{value}</div>}
       <div className="space-y-1 mt-2">
          {['Structural', 'Quant', 'Strat'].map(l => l === title && (
              <div key={l} className="flex gap-1 justify-center">
                  <div className="w-8 h-1 bg-indigo-500 rounded"></div>
                  <div className="w-8 h-1 bg-gray-700 rounded"></div>
                  <div className="w-8 h-1 bg-gray-700 rounded"></div>
              </div>
          ))}
       </div>
    </div>

    {/* Ports */}
    {inputs.map((_: any, i: number) => (
        <div key={i} className="absolute -left-1.5 top-1/2 w-3 h-3 bg-gray-600 rounded-full border-2 border-gray-950 hover:bg-white transition-colors"></div>
    ))}
    {outputs.map((_: any, i: number) => (
        <div key={i} className="absolute -right-1.5 top-1/2 w-3 h-3 bg-gray-600 rounded-full border-2 border-gray-950 hover:bg-white transition-colors"></div>
    ))}
  </div>
);

export const NodeBuilderView: React.FC<NodeBuilderViewProps> = ({ agent, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex flex-col">
             <span className="text-sm font-bold text-white tracking-widest uppercase">Agent Builder v2.0</span>
             <span className="text-xs text-gray-500">Editing: {agent.name}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium border border-gray-700 transition-colors">
            <Activity size={14} /> Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium border border-gray-700 transition-colors">
            <Save size={14} /> Save
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-colors">
            <Zap size={14} /> DEPLOY
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[#050505] overflow-hidden cursor-crosshair group">
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* Connecting Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 240 180 C 350 180, 350 120, 480 120" stroke="#3f3f46" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <path d="M 240 180 C 350 180, 350 350, 480 350" stroke="#f43f5e" strokeWidth="2" fill="none" className="animate-pulse" />
          <path d="M 670 120 C 750 120, 750 250, 850 250" stroke="#10b981" strokeWidth="2" fill="none" />
          <path d="M 670 350 C 750 350, 750 250, 850 250" stroke="#10b981" strokeWidth="2" fill="none" />
          <path d="M 670 450 C 750 450, 750 250, 850 250" stroke="#3f3f46" strokeWidth="2" fill="none" />
          <path d="M 1040 250 C 1100 250, 1100 250, 1200 250" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>

        {/* Nodes */}
        <div className="relative w-full h-full transform scale-90 origin-top-left translate-x-12 translate-y-12">
            
            {/* Column 1: Identity */}
            <Node title="Identity" icon={Box} color="bg-cyan-500" x={50} y={150} outputs={[1]} value={agent.name} />

            {/* Column 2: Constraints & Risk */}
            <Node title="Risk Profile" icon={Shield} color="bg-rose-500" x={480} y={80} inputs={[1]} outputs={[1]} value={agent.config.riskProfile} />
            <Node title="Edge Calc" icon={GitCommit} color="bg-purple-500" x={480} y={300} inputs={[1]} outputs={[1]} value={`${agent.config.edge.dog}/${agent.config.edge.tail} Split`} />
            <Node title="Cerberus" icon={Shield} color="bg-indigo-500" x={480} y={420} inputs={[1]} outputs={[1]} value="Governance: Strong" />

            {/* Column 3: Market & Positions */}
            <Node title="Market" icon={Activity} color="bg-emerald-500" x={850} y={200} inputs={[1]} outputs={[1]} value="8/8 Pairs" />
            
            {/* Column 4: Model */}
            <Node title="AI Model" icon={Cpu} color="bg-amber-500" x={1200} y={200} inputs={[1]} outputs={[1]} value={agent.config.aiModel} />

        </div>
        
        {/* Floating Controls */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
           <button className="w-8 h-8 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-white">+</button>
           <button className="w-8 h-8 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-white">-</button>
           <button className="w-8 h-8 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-white">[]</button>
        </div>
        
        <div className="absolute bottom-6 right-6 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-xs text-gray-500 font-mono">
           SYSTEM: ONLINE &nbsp;•&nbsp; LATENCY: 12ms
        </div>

      </div>
    </div>
  );
};