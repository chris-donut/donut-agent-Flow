import React, { useState } from 'react';
import { Agent, Trade, Position, EquityPoint, UserHolding } from '../types';
import { EquityChart } from '../components/EquityChart';
import { AgentCard } from '../components/AgentCard';
import { TradeList } from '../components/TradeList';
import { PositionTable } from '../components/PositionTable';
import { StrategyPanel } from '../components/StrategyPanel';
import { ListFilter, Activity, MessageSquare, Terminal, Wallet, Settings, ArrowLeft, Layers } from 'lucide-react';

interface ArenaViewProps {
  agents: Agent[];
  trades: Trade[];
  positions: Position[];
  equityData: EquityPoint[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenVault: (id: string) => void;
  onOpenNodeEditor?: (id: string) => void; 
  onNavigateToDetail?: () => void;
  userHoldings: Record<string, UserHolding>;
}

export const ArenaView: React.FC<ArenaViewProps> = ({ 
  agents, 
  trades, 
  positions, 
  equityData, 
  selectedAgentId, 
  onSelectAgent,
  onOpenVault,
  onOpenNodeEditor,
  onNavigateToDetail,
  userHoldings
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'trades' | 'positions' | 'profile'>('agents');
  const [agentFilter, setAgentFilter] = useState<'my_agents' | 'all'>('my_agents');
  const [chartMode, setChartMode] = useState<'equity' | 'drawdown' | 'pnl'>('equity');
  const [showBenchmark, setShowBenchmark] = useState(true);

  // Filter agents for the list
  const filteredAgents = agentFilter === 'my_agents' 
    ? agents.filter(a => userHoldings[a.id]) // Show only agents user holds
    : [...agents].sort((a, b) => b.sinceLaunchReturnPct - a.sinceLaunchReturnPct);
  
  // If 'My Agents' is selected but user has none, maybe fallback or show empty state. 
  // For now let's just show them if they exist. If list is empty we can show a message in the render.

  // Filter detail data based on selected agent
  const selectedTrades = trades.filter(t => t.agentId === selectedAgentId);
  const selectedPositions = positions.filter(p => p.agentId === selectedAgentId);
  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
  const activeHolding = userHoldings[selectedAgentId];

  const handleAgentClick = (id: string) => {
    onSelectAgent(id);
    setActiveTab('profile');
  };

  const handleBackToList = () => {
    setActiveTab('agents');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden lg:flex-row">
      
      {/* Left: Main Chart Area (65%) */}
      <div className="flex-1 flex flex-col border-r border-gray-800 bg-black/40 lg:w-[65%] min-h-[400px]">
        {/* Chart Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
           <div className="flex items-center gap-4">
             <h2 className="font-semibold text-gray-200">
               {chartMode === 'equity' ? 'Equity Curve' : chartMode === 'drawdown' ? 'Drawdown %' : 'PnL %'}
             </h2>
             <div className="flex bg-gray-900 rounded p-0.5 border border-gray-800">
                <button 
                  onClick={() => setChartMode('equity')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${chartMode === 'equity' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Equity
                </button>
                <button 
                  onClick={() => setChartMode('pnl')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${chartMode === 'pnl' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  PnL %
                </button>
                <button 
                  onClick={() => setChartMode('drawdown')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${chartMode === 'drawdown' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Drawdown
                </button>
             </div>
           </div>
           <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                 <input 
                   type="checkbox" 
                   checked={showBenchmark} 
                   onChange={(e) => setShowBenchmark(e.target.checked)}
                   className="rounded border-gray-700 bg-gray-900 text-indigo-500 focus:ring-offset-0 focus:ring-0" 
                 />
                 Show BTC Benchmark
              </label>
           </div>
        </div>
        
        {/* Chart */}
        <div className="flex-1 p-4 relative">
          <EquityChart 
            data={equityData} 
            agents={filteredAgents.length > 0 ? filteredAgents : agents} // Fallback to all agents if filtered list is empty for chart
            highlightedAgentId={activeTab !== 'agents' ? selectedAgentId : undefined} 
            viewMode={chartMode}
            showBenchmark={showBenchmark}
          />
        </div>
      </div>

      {/* Right: Side Panel (35%) */}
      <div className="lg:w-[35%] flex flex-col bg-gray-950 border-t lg:border-t-0 border-gray-800 h-full">
        
        {/* Logic: If in Agent List mode, show simple header. If selected, show Agent Header + Back Button */}
        {activeTab === 'agents' ? (
           <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                 <Layers size={18} className="text-indigo-500" />
                 Agent Vaults
              </div>
              <div className="text-xs text-gray-500 font-mono">
                 {filteredAgents.length} Active
              </div>
           </div>
        ) : (
          <div className="p-4 bg-gray-900 border-b border-gray-800">
             {/* Back Button */}
             <button 
               onClick={handleBackToList}
               className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-3 transition-colors uppercase tracking-wider"
             >
               <ArrowLeft size={14} /> Back to List
             </button>

             {/* Selected Agent Header */}
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                   <img src={activeAgent.avatarUrl} className="w-10 h-10 rounded-lg object-cover border border-gray-700" alt="" />
                   <div>
                      <div className="font-bold text-white text-base">{activeAgent.name}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                         <span className={`w-1.5 h-1.5 rounded-full ${activeAgent.sinceLaunchReturnPct >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                         {activeAgent.sinceLaunchReturnPct}% Total Return
                      </div>
                   </div>
                </div>
                
                {/* Updated Settings Button -> Navigates to Agent Detail View */}
                <button 
                   onClick={() => onNavigateToDetail && onNavigateToDetail()}
                   className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 transition-colors"
                   title="View Full Details"
                >
                  <Settings size={16} />
                </button>
             </div>

             {activeHolding ? (
               <div className="w-full py-2 bg-emerald-900/30 border border-emerald-900 text-emerald-400 rounded font-semibold text-xs flex items-center justify-center gap-2">
                 <Wallet size={14} />
                 Invested: ${activeHolding.currentValue.toLocaleString()}
               </div>
             ) : (
               <button 
                 onClick={() => onOpenVault(activeAgent.id)}
                 className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
               >
                 <Wallet size={14} />
                 Invest
               </button>
             )}
          </div>
        )}

        {/* Panel Tabs - Only show when NOT in agents list */}
        {activeTab !== 'agents' && (
          <div className="flex border-b border-gray-800">
            <button 
               onClick={() => setActiveTab('profile')}
               className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('trades')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'trades' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Trades
            </button>
            <button 
               onClick={() => setActiveTab('positions')}
               className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'positions' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Pos
            </button>
          </div>
        )}

        {/* Panel Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          
          {/* TAB 1: AGENT LIST */}
          {activeTab === 'agents' && (
            <>
              {/* Sub-filters for agents */}
              <div className="flex p-2 gap-2 border-b border-gray-800 bg-gray-900/30 sticky top-0 backdrop-blur-sm z-10">
                <button 
                  onClick={() => setAgentFilter('my_agents')}
                  className={`flex-1 py-1.5 px-3 text-xs rounded border ${agentFilter === 'my_agents' ? 'bg-indigo-900/30 text-indigo-400 border-indigo-900' : 'bg-transparent border-transparent text-gray-500'}`}
                >
                  My Agents
                </button>
                <button 
                  onClick={() => setAgentFilter('all')}
                  className={`flex-1 py-1.5 px-3 text-xs rounded border ${agentFilter === 'all' ? 'bg-indigo-900/30 text-indigo-400 border-indigo-900' : 'bg-transparent border-transparent text-gray-500'}`}
                >
                  All Agents
                </button>
              </div>
              
              <div className="divide-y divide-gray-800 pb-12">
                {filteredAgents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No agents found in your portfolio.
                    </div>
                ) : (
                    filteredAgents.map(agent => (
                    <AgentCard 
                        key={agent.id} 
                        agent={agent} 
                        isSelected={agent.id === selectedAgentId} 
                        onClick={() => handleAgentClick(agent.id)}
                        onDoubleClick={() => onNavigateToDetail && onNavigateToDetail()}
                        showFitScore={false}
                        holding={userHoldings[agent.id]}
                    />
                    ))
                )}
              </div>
            </>
          )}

          {/* TAB 2: TRADES */}
          {activeTab === 'trades' && (
            <div className="bg-gray-950 pb-12">
               <div className="p-3 bg-gray-900/50 border-b border-gray-800 text-xs text-gray-400 flex justify-between items-center">
                  <span>Showing trades for <strong className="text-white">{activeAgent.name}</strong></span>
               </div>
               <TradeList trades={selectedTrades} />
            </div>
          )}

          {/* TAB 3: POSITIONS */}
          {activeTab === 'positions' && (
             <div className="bg-gray-950 pb-12">
                <div className="p-3 bg-gray-900/50 border-b border-gray-800 text-xs text-gray-400 flex justify-between items-center">
                   <span>Active positions for <strong className="text-white">{activeAgent.name}</strong></span>
                </div>
                <PositionTable positions={selectedPositions} />
             </div>
          )}

           {/* TAB 4: AGENT PROFILE */}
           {activeTab === 'profile' && (
             <StrategyPanel agent={activeAgent} onOpenNodeEditor={onOpenNodeEditor} />
          )}

        </div>
      </div>
    </div>
  );
};