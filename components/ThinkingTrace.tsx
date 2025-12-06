import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Activity, Terminal, BrainCircuit, Gavel } from 'lucide-react';
import { TradeThought } from '../types';

interface ThinkingTraceProps {
  thoughts: TradeThought;
  agentName: string;
}

export const ThinkingTrace: React.FC<ThinkingTraceProps> = ({ thoughts, agentName }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="mt-4 animate-in fade-in duration-300">
      {/* Monologue Box (Blue/White style) */}
      <div className="bg-blue-950/20 border border-blue-800/50 rounded-lg p-4 mb-4 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        
        <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <BrainCircuit size={12} /> {agentName} | Monk Mode
            </span>
            <span className="text-[10px] text-gray-500 ml-auto font-mono">14ms latency</span>
        </div>
        
        <p className="text-sm text-gray-200 leading-relaxed font-mono">
            {thoughts.summary}
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-1">
        {/* User Prompt / Market State */}
        <div className="border-l-2 border-gray-800 ml-2 pl-4 pb-2">
           <button 
             onClick={() => toggleSection('prompt')}
             className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider mb-2"
           >
             {expandedSection === 'prompt' ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
             <Activity size={14} className="text-gray-600" /> Current State of Markets
           </button>
           
           {expandedSection === 'prompt' && (
             <div className="bg-gray-950 rounded p-3 text-xs font-mono text-gray-400 whitespace-pre-wrap border border-gray-800 shadow-inner">
               {thoughts.marketState}
             </div>
           )}
        </div>

        {/* Chain of Thought */}
        <div className="border-l-2 border-gray-800 ml-2 pl-4 pb-2">
           <button 
             onClick={() => toggleSection('cot')}
             className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider mb-2"
           >
             {expandedSection === 'cot' ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
             <Terminal size={14} className="text-gray-600" /> Chain of Thought
           </button>
           
           {expandedSection === 'cot' && (
             <div className="bg-gray-950 rounded p-3 text-xs font-mono text-indigo-300/80 whitespace-pre-wrap border border-gray-800 shadow-inner">
               {thoughts.chainOfThought}
             </div>
           )}
        </div>

        {/* Decisions */}
        <div className="border-l-2 border-gray-800 ml-2 pl-4">
           <button 
             onClick={() => toggleSection('decision')}
             className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider mb-2"
           >
             {expandedSection === 'decision' ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
             <Gavel size={14} className="text-gray-600" /> Trading Protocols
           </button>
           
           {expandedSection === 'decision' && (
             <div className="bg-gray-950 rounded p-3 text-xs font-mono text-emerald-400/80 whitespace-pre-wrap border border-gray-800 shadow-inner">
               {thoughts.decisionProtocol}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};