import React, { useState } from 'react';
import { Agent, Trade, Position, EquityPoint, UserHolding } from '../types';
import { EquityChart } from '../components/EquityChart';
import { TradeList } from '../components/TradeList';
import { PositionTable } from '../components/PositionTable';
import { StrategyPanel } from '../components/StrategyPanel';
import { ThinkingTrace } from '../components/ThinkingTrace';
import { ArrowLeft, CheckCircle2, Shield, Activity, TrendingUp, AlertOctagon, MessageSquare, Terminal, Cpu, Network, ListFilter, BrainCircuit, Wallet, ChevronRight } from 'lucide-react';

interface AgentDetailViewProps {
  agents: Agent[];
  userHoldings: Record<string, UserHolding>;
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  trades: Trade[];
  positions: Position[];
  equityData: EquityPoint[];
  onBack: () => void;
  onOpenNodeEditor?: (id: string) => void;
}

export const AgentDetailView: React.FC<AgentDetailViewProps> = ({ 
  agents,
  userHoldings,
  selectedAgentId,
  onSelectAgent,
  trades, 
  positions, 
  equityData, 
  onBack, 
  onOpenNodeEditor 
}) => {
  const [activeTab, setActiveTab] = useState<'trades' | 'positions' | 'rationale' | 'nodes'>('trades');

  // Derive current agent from selection
  const agent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Filter data specifically for this agent
  const agentTrades = trades.filter(t => t.agentId === agent.id);
  const agentPositions = positions.filter(p => p.agentId === agent.id);

  // Get list of "My Agents"
  const myAgents = agents.filter(a => userHoldings[a.id]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Sidebar: My Portfolio */}
      <div className="w-64 flex-shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">My Portfolio</div>
             <div className="flex items-center gap-2 text-white font-bold">
                <Wallet size={16} className="text-emerald-500" />
                <span>My Agents</span>
                <span className="bg-gray-800 text-gray-400 text-[10px] px-1.5 rounded-full ml-auto">{myAgents.length}</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {myAgents.map(myAgent => {
                const holding = userHoldings[myAgent.id];
                const pnl = holding ? holding.currentValue - holding.investedAmount : 0;
                const pnlPct = holding ? (pnl / holding.investedAmount) * 100 : 0;
                const isSelected = myAgent.id === selectedAgentId;

                return (
                   <div 
                     key={myAgent.id}
                     onClick={() => onSelectAgent(myAgent.id)}
                     className={`
                        group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
                        ${isSelected 
                           ? 'bg-gray-800 border-gray-700' 
                           : 'bg-transparent border-transparent hover:bg-gray-900 hover:border-gray-800'
                        }
                     `}
                   >
                      <img 
                        src={myAgent.avatarUrl} 
                        className={`w-8 h-8 rounded-lg object-cover border ${isSelected ? 'border-gray-500' : 'border-gray-800 opacity-70 group-hover:opacity-100'}`} 
                        alt={myAgent.name} 
                      />
                      <div className="flex-1 min-w-0">
                         <div className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                            {myAgent.name}
                         </div>
                         <div className={`text-[10px] font-mono ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {pnl >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
                         </div>
                      </div>
                      {isSelected && <ChevronRight size={14} className="text-gray-500" />}
                   </div>
                );
             })}
             
             {/* If current agent is NOT in my portfolio, show it separately or handle it? 
                 Currently we just show the list of Owned agents. If viewing a non-owned agent, they won't be in this list.
                 Let's add a visual separator if viewing non-owned. 
             */}
             {!userHoldings[selectedAgentId] && (
                 <div className="mt-4 pt-4 border-t border-gray-800 px-2">
                     <div className="text-[10px] text-gray-500 mb-2 uppercase">Currently Viewing</div>
                     <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800 opacity-70">
                         <img src={agent.avatarUrl} className="w-8 h-8 rounded-lg grayscale" alt={agent.name} />
                         <div className="text-sm font-bold text-gray-400">{agent.name}</div>
                     </div>
                 </div>
             )}
          </div>
          
          <div className="p-4 border-t border-gray-800">
             <button onClick={onBack} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors py-2 rounded hover:bg-gray-900">
                 <ArrowLeft size={14} /> Return to Arena
             </button>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-black">
        {/* Navigation Breadcrumb (Context) */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2 bg-gray-950/50 sticky top-0 z-10 backdrop-blur-sm">
            <span className="text-gray-500 text-sm">Agent Detail</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-200 font-medium">{agent.name}</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 border-b border-gray-800 bg-gray-900/20">
            
            {/* Left: Large Chart */}
            <div className="lg:col-span-2 h-[350px] bg-gray-900/50 rounded-xl border border-gray-800 p-4 relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="text-xs font-bold text-gray-400 bg-black/50 px-2 py-1 rounded">VS BTC Benchmark</span>
            </div>
            <EquityChart 
                data={equityData} 
                agents={[agent]} 
                highlightedAgentId={agent.id} 
                viewMode="equity"
            />
            </div>

            {/* Right: Key Metrics Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-4">
                <img src={agent.avatarUrl} className="w-12 h-12 rounded-xl border-2 border-gray-700 object-cover" alt="avatar" />
                <div>
                    <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 flex items-center gap-1">
                        <Cpu size={10} /> {agent.config.aiModel}
                        </span>
                        <span className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                        {agent.config.riskProfile}
                        </span>
                    </div>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Total Return</span>
                    <div className={`text-2xl font-mono font-bold mt-1 ${agent.sinceLaunchReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {agent.sinceLaunchReturnPct >= 0 ? '+' : ''}{agent.sinceLaunchReturnPct}%
                    </div>
                </div>
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Max Drawdown</span>
                    <div className="text-2xl font-mono font-bold mt-1 text-rose-400">
                    {agent.maxDrawdownPct}%
                    </div>
                </div>
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Sharpe Ratio</span>
                    <div className="text-lg font-mono font-bold mt-1 text-gray-200">
                    {agent.sharpeEstimate}
                    </div>
                </div>
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Days Live</span>
                    <div className="text-lg font-mono font-bold mt-1 text-gray-200">
                    {agent.daysLive}
                    </div>
                </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-500">Emotional Firewall</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    agent.emotionalFirewallLevel === 'Strict' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' : 'text-yellow-400 border-yellow-900 bg-yellow-900/20'
                }`}>
                    {agent.emotionalFirewallLevel}
                </span>
                </div>
                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2">
                    Open AI Vault
                </button>
            </div>
            </div>
        </div>

        {/* Middle: Strategy Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Shield size={16} className="text-indigo-400"/> Identity & Style
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {agent.description}
            </p>
            <div className="flex flex-wrap gap-2">
                {agent.styleTags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs border border-gray-700">
                        {tag}
                    </span>
                ))}
            </div>
            </div>

            <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-indigo-400"/> Execution Parameters
            </h3>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <span className="text-xs text-gray-500 block mb-1">Execution Logic</span>
                    <p className="text-xs text-gray-300">{agent.fullStrategyMemo?.goal}</p>
                </div>
                <div>
                    <span className="text-xs text-gray-500 block mb-1">Data Sources</span>
                    <p className="text-xs text-gray-300">{agent.fullStrategyMemo?.dataSources.join(", ")}</p>
                </div>
                <div>
                    <span className="text-xs text-gray-500 block mb-1">Hard Guardrails</span>
                    <p className="text-xs text-gray-300">{agent.fullStrategyMemo?.riskGuardrails[0]}</p>
                </div>
            </div>
            </div>
        </div>

        {/* Bottom Tabs */}
        <div className="px-6">
            <div className="border-b border-gray-800 flex gap-6 mb-6 overflow-x-auto">
                {[
                { id: 'trades', label: 'Trade Log', icon: ListFilter },
                { id: 'positions', label: 'Active Positions', icon: Activity },
                { id: 'rationale', label: 'Trade Rationale', icon: BrainCircuit },
                { id: 'nodes', label: 'Logic Nodes', icon: Network },
                ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
                ))}
            </div>

            <div className="min-h-[300px] pb-12">
                {activeTab === 'trades' && <TradeList trades={agentTrades} />}
                {activeTab === 'positions' && <PositionTable positions={agentPositions} />}
                
                {activeTab === 'rationale' && (
                    <div className="space-y-6 max-w-4xl">
                        <div className="p-4 bg-indigo-900/10 border border-indigo-900/30 rounded-lg mb-6 text-sm text-indigo-300 flex items-center gap-3">
                            <BrainCircuit size={20} className="shrink-0" />
                            <div>
                                <strong>Deep Dive Analysis:</strong> This tab reveals the raw "internal monologue" and Chain-of-Thought (CoT) processes for recent key decisions.
                            </div>
                        </div>
                        {agentTrades.filter(t => t.thoughts).map(trade => (
                            <div key={trade.id} className="mb-8">
                                <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                                    <span className="font-mono">{trade.timestamp}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className={`font-bold ${trade.side === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>{trade.side} {trade.symbol}</span>
                                </div>
                                <ThinkingTrace thoughts={trade.thoughts!} agentName={agent.name} />
                            </div>
                        ))}
                        {agentTrades.filter(t => t.thoughts).length === 0 && (
                            <div className="text-center text-gray-500 py-12">No extended rationale data available for recent trades.</div>
                        )}
                    </div>
                )}

                {activeTab === 'nodes' && (
                <div className="space-y-4">
                    <div 
                    onDoubleClick={() => onOpenNodeEditor && onOpenNodeEditor(agent.id)} 
                    className="group relative h-[400px] w-full bg-black border border-gray-800 rounded-xl overflow-hidden cursor-pointer"
                    >
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-20" 
                            style={{ 
                                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                                backgroundSize: '20px 20px' 
                            }}>
                        </div>
                        
                        {/* Mock Node Graph Preview */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity">
                            <div className="relative w-[600px] h-[300px]">
                                {/* Lines */}
                                <svg className="absolute inset-0 w-full h-full">
                                    <path d="M 100 150 L 250 100" stroke="#444" strokeWidth="2" />
                                    <path d="M 100 150 L 250 200" stroke="#444" strokeWidth="2" />
                                    <path d="M 250 100 L 400 150" stroke="#444" strokeWidth="2" />
                                    <path d="M 250 200 L 400 150" stroke="#444" strokeWidth="2" />
                                </svg>
                                {/* Nodes */}
                                <div className="absolute left-[50px] top-[130px] w-12 h-12 bg-indigo-900 border border-indigo-500 rounded-lg"></div>
                                <div className="absolute left-[250px] top-[80px] w-12 h-12 bg-gray-800 border border-gray-600 rounded-lg"></div>
                                <div className="absolute left-[250px] top-[180px] w-12 h-12 bg-gray-800 border border-gray-600 rounded-lg"></div>
                                <div className="absolute left-[400px] top-[130px] w-12 h-12 bg-emerald-900 border border-emerald-500 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Overlay CTA */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="bg-gray-900/90 backdrop-blur border border-gray-700 px-6 py-4 rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform">
                                <Network size={32} className="mx-auto mb-2 text-indigo-400" />
                                <h3 className="text-lg font-bold text-white mb-1">View Node Logic</h3>
                                <p className="text-xs text-gray-400">Double-click to open Agent Builder</p>
                            </div>
                        </div>
                    </div>
                    <button 
                    onClick={() => onOpenNodeEditor && onOpenNodeEditor(agent.id)}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                    <Network size={16} /> Open Strategy Builder
                    </button>
                </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};