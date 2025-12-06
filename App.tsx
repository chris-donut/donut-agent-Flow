import React, { useState } from 'react';
import { ArenaView } from './views/ArenaView';
import { AgentDetailView } from './views/AgentDetailView';
import { NodeBuilderView } from './views/NodeBuilderView'; // Import the new view
import { DepositModal } from './components/DepositModal';
import { agents, trades, positions, equityData } from './data';
import { UserHolding } from './types';
import { PieChart, Bell, Settings, User, Wallet } from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'arena' | 'detail' | 'node-editor'>('arena');
  const [previousScreen, setPreviousScreen] = useState<'arena' | 'detail'>('arena');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  
  // User Portfolio State
  const [userHoldings, setUserHoldings] = useState<Record<string, UserHolding>>({
    'kimi-01': { agentId: 'kimi-01', investedAmount: 5000, currentValue: 5240.50 }
  });

  const handleSelectAgent = (id: string) => {
    setSelectedAgentId(id);
  };

  const handleOpenVault = (id: string) => {
    setSelectedAgentId(id);
    setIsDepositModalOpen(true);
  };

  const handleOpenNodeEditor = (id: string) => {
    setSelectedAgentId(id);
    setPreviousScreen(currentScreen === 'node-editor' ? 'arena' : currentScreen);
    setCurrentScreen('node-editor');
  }

  const handleCloseNodeEditor = () => {
    setCurrentScreen(previousScreen);
  }

  const handleDeposit = (amount: number) => {
    setUserHoldings((prev: Record<string, UserHolding>) => ({
      ...prev,
      [selectedAgentId]: {
        agentId: selectedAgentId,
        investedAmount: (prev[selectedAgentId]?.investedAmount || 0) + amount,
        currentValue: (prev[selectedAgentId]?.currentValue || 0) + amount 
      }
    }));
    setIsDepositModalOpen(false);
  };

  const totalBalance = (Object.values(userHoldings) as UserHolding[]).reduce((sum, h) => sum + h.currentValue, 12450);
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-indigo-500/30">
      
      {/* Node Builder Overlay (Fullscreen) */}
      {currentScreen === 'node-editor' && (
        <NodeBuilderView agent={selectedAgent} onClose={handleCloseNodeEditor} />
      )}

      {/* Main App Content - Hidden when Editor is open to prevent scroll/interaction issues if we wanted to overlay, but replacing is cleaner */}
      {currentScreen !== 'node-editor' && (
        <>
          {/* Top Navigation Bar */}
          <nav className="h-16 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <PieChart className="text-white" size={20} />
                </div>
                DONUT
              </div>
              
              <div className="hidden md:flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                <button 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentScreen === 'arena' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setCurrentScreen('arena')}
                >
                  Live Arena
                </button>
                <button 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentScreen === 'detail' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setCurrentScreen('detail')}
                >
                  Agent Detail
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:block text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Balance</div>
                <div className="text-sm font-mono font-bold text-white flex items-center gap-2 justify-end">
                    ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(totalBalance)}
                </div>
              </div>
              <div className="flex items-center gap-4 border-l border-gray-800 pl-6">
                <Bell size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-gray-700">
                  <User size={16} className="text-white" />
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            {currentScreen === 'arena' ? (
              <ArenaView 
                agents={agents}
                trades={trades}
                positions={positions}
                equityData={equityData}
                selectedAgentId={selectedAgentId}
                onSelectAgent={handleSelectAgent}
                onOpenVault={handleOpenVault}
                onOpenNodeEditor={handleOpenNodeEditor}
                onNavigateToDetail={() => setCurrentScreen('detail')}
                userHoldings={userHoldings}
              />
            ) : (
              <AgentDetailView 
                agents={agents}
                userHoldings={userHoldings}
                selectedAgentId={selectedAgentId}
                onSelectAgent={handleSelectAgent}
                trades={trades}
                positions={positions}
                equityData={equityData}
                onBack={() => setCurrentScreen('arena')}
                onOpenNodeEditor={(id) => handleOpenNodeEditor(id || selectedAgentId)}
              />
            )}
          </main>

          {/* Modals */}
          {isDepositModalOpen && (
            <DepositModal 
              agent={selectedAgent} 
              onClose={() => setIsDepositModalOpen(false)}
              onDeposit={handleDeposit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;