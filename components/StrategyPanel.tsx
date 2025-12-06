import React, { useState } from 'react';
import { Agent } from '../types';
import { Network, GitMerge, Scale, ChevronDown, ChevronRight, Shield, Cpu, Zap } from 'lucide-react';

interface StrategyPanelProps {
  agent: Agent;
  onOpenNodeEditor?: (id: string) => void;
}

const AccordionItem: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, onToggle, children }) => {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30 mb-3">
      <button 
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-indigo-400">{icon}</div>
          <span className="font-bold text-sm text-gray-200 uppercase tracking-wide">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-800 bg-black/20 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export const StrategyPanel: React.FC<StrategyPanelProps> = ({ agent, onOpenNodeEditor }) => {
  const { config } = agent;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'cerberus': true,
    'edge': false,
    'risk': false,
    'identity': false
  });

  const toggle = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!config) return <div className="p-4 text-gray-500">Configuration data unavailable.</div>;

  return (
    <div className="p-4">
       {/* Identity & Model */}
       <AccordionItem 
        title="Identity & Model" 
        icon={<Cpu size={16} />} 
        isOpen={openSections['identity']} 
        onToggle={() => toggle('identity')}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
             <span className="text-gray-500">AI Model</span>
             <span className="text-indigo-400 font-mono border border-indigo-900/50 bg-indigo-950/20 px-2 py-0.5 rounded">{config.aiModel}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
             <span className="text-gray-500">Context Window</span>
             <span className="text-gray-300 font-mono">{config.maxTokens} tokens</span>
          </div>
          <div className="flex justify-between items-center text-sm">
             <span className="text-gray-500">Time Horizon</span>
             <span className="text-gray-300 font-mono">{config.horizon}</span>
          </div>
          <div className="pt-2 border-t border-gray-800">
             <span className="text-xs text-gray-500 block mb-1">Core Objective</span>
             <p className="text-sm text-gray-300 italic">"{agent.fullStrategyMemo?.goal}"</p>
          </div>
        </div>
      </AccordionItem>

      {/* Cerberus Logic */}
      <AccordionItem 
        title="Cerberus Logic" 
        icon={<Network size={16} />} 
        isOpen={openSections['cerberus']} 
        onToggle={() => toggle('cerberus')}
      >
         <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-900 p-2 rounded border border-gray-800 text-center">
                <span className="text-[10px] text-gray-500 block">STRUCTURAL</span>
                <span className="text-xl font-mono font-bold text-indigo-400">{config.cerberus.structural}</span>
            </div>
            <div className="bg-gray-900 p-2 rounded border border-gray-800 text-center">
                <span className="text-[10px] text-gray-500 block">QUANT</span>
                <span className="text-xl font-mono font-bold text-indigo-400">{config.cerberus.quant}</span>
            </div>
            <div className="bg-gray-900 p-2 rounded border border-gray-800 text-center">
                <span className="text-[10px] text-gray-500 block">STRATEGIC</span>
                <span className="text-xl font-mono font-bold text-indigo-400">{config.cerberus.strategic}</span>
            </div>
         </div>
         <div className="flex items-center justify-between text-xs px-1 bg-gray-900/50 p-2 rounded">
             <span className="text-gray-500">Governance Veto Power</span>
             <span className={`font-bold px-2 py-0.5 rounded ${
                 config.cerberus.governor === 'Strong' ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-900' : 'text-yellow-400 bg-yellow-950/30 border border-yellow-900'
             }`}>
                 {config.cerberus.governor.toUpperCase()}
             </span>
         </div>
      </AccordionItem>

      {/* Edge Calculation */}
      <AccordionItem 
        title="Edge Calculation" 
        icon={<GitMerge size={16} />} 
        isOpen={openSections['edge']} 
        onToggle={() => toggle('edge')}
      >
         <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden flex mb-3">
            <div style={{ width: `${config.edge.dog}%` }} className="h-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_-2px_0_5px_rgba(0,0,0,0.2)]">
            </div>
            <div className="flex-1 bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_2px_0_5px_rgba(0,0,0,0.2)]">
            </div>
         </div>
         <div className="flex justify-between text-xs">
            <div className="flex flex-col">
                <span className="font-bold text-indigo-400 text-sm">{config.edge.dog}% DOG</span>
                <span className="text-[10px] text-gray-500">Market Structure / Price Action</span>
            </div>
             <div className="flex flex-col items-end">
                <span className="font-bold text-purple-400 text-sm">{config.edge.tail}% TAIL</span>
                <span className="text-[10px] text-gray-500">Sentiment / Narrative / News</span>
            </div>
         </div>
      </AccordionItem>

      {/* Risk Profile */}
      <AccordionItem 
        title="Risk Management" 
        icon={<Scale size={16} />} 
        isOpen={openSections['risk']} 
        onToggle={() => toggle('risk')}
      >
         <div className="flex justify-between items-center mb-3">
             <span className="text-sm text-gray-400">Risk Profile</span>
             <span className={`text-xs font-bold px-2 py-1 rounded border ${
                 config.riskProfile === 'Very Conservative' ? 'border-indigo-800 text-indigo-300 bg-indigo-950/30' :
                 config.riskProfile === 'Conservative' ? 'border-blue-800 text-blue-300 bg-blue-950/30' :
                 'border-orange-800 text-orange-300 bg-orange-950/30'
              }`}>
                 {config.riskProfile}
              </span>
         </div>
         <div className="space-y-2">
             <span className="text-xs text-gray-500 uppercase tracking-wider block">Hard Guardrails</span>
             {agent.fullStrategyMemo?.riskGuardrails.map((rule, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300 bg-gray-900 p-2 rounded">
                    <Shield size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                    {rule}
                </div>
             ))}
         </div>
      </AccordionItem>

      {/* Edit Button */}
      {onOpenNodeEditor && (
        <div className="mt-6 pt-4 border-t border-gray-800">
          <button 
            onClick={() => onOpenNodeEditor(agent.id)}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-500 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Zap size={16} className="text-indigo-400" />
            Launch Strategy Builder
          </button>
        </div>
      )}
    </div>
  );
};