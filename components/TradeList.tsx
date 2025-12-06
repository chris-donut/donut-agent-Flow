import React, { useState } from 'react';
import { Trade } from '../types';
import { Bot, Clock, ChevronDown, ChevronUp, ScanSearch, Sparkles, BrainCircuit } from 'lucide-react';
import { ThinkingTrace } from './ThinkingTrace';

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  if (trades.length === 0) {
    return <div className="p-8 text-center text-gray-500">No recent trades found for this agent.</div>;
  }

  const toggleExpand = (id: string) => {
    setExpandedTradeId(expandedTradeId === id ? null : id);
  };

  return (
    <div className="space-y-4 p-4">
      {trades.map(trade => {
        const isExpanded = expandedTradeId === trade.id;
        const hasThoughts = !!trade.thoughts;
        
        return (
          <div key={trade.id} className="bg-[#0e0e11] border border-gray-800 rounded-lg overflow-hidden shadow-sm group hover:border-gray-700 transition-colors">
            
            {/* Header / Main Card Content */}
            <div className="p-5">
              {/* Top Row: Identity + Timestamp */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                   <Bot size={16} className="text-indigo-400" />
                   <span className="font-bold text-indigo-400 font-mono tracking-tight">{trade.agentId.toUpperCase()}</span>
                   <span className="text-gray-500">completed a trade on</span>
                   <span className="font-bold text-white flex items-center gap-1">
                     <img src={`https://ui-avatars.com/api/?name=${trade.symbol}&background=random&color=fff&size=16`} className="w-4 h-4 rounded-full inline-block" alt="" />
                     {trade.symbol}
                   </span>
                </div>
                <div className="text-xs text-gray-600 font-mono">{trade.timestamp}</div>
              </div>

              {/* Data Grid - Ticket Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {/* Left Column: Stats */}
                  <div className="space-y-1 font-mono text-sm">
                     <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-24">Price:</span>
                        <span className="text-gray-300">${trade.entryPrice.toLocaleString()}</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-white font-bold">${trade.exitPrice.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-24">Quantity:</span>
                        <span className="text-gray-300">{trade.quantity}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-24">Notional:</span>
                        <span className="text-gray-300">${trade.notional.toLocaleString()}</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-gray-300">${(trade.notional + trade.pnlDollar).toLocaleString()}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-24">Holding time:</span>
                        <span className="text-gray-300">{Math.floor(trade.holdingTimeMinutes / 60)}h {trade.holdingTimeMinutes % 60}m</span>
                     </div>
                  </div>

                  {/* Right Column: NET P&L */}
                  <div className="flex flex-col justify-center items-start md:items-end mt-2 md:mt-0">
                     <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">NET P&L</span>
                     <div className={`text-3xl font-mono font-bold tracking-tight ${trade.pnlDollar >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trade.pnlDollar >= 0 ? '+' : '-'}${Math.abs(trade.pnlDollar).toFixed(2)}
                     </div>
                  </div>
              </div>
            </div>

            {/* Footer / Toggle Action */}
            {hasThoughts ? (
                <div 
                    onClick={() => toggleExpand(trade.id)}
                    className={`
                        relative px-5 py-3 cursor-pointer transition-all select-none border-t group/btn
                        ${isExpanded 
                        ? 'bg-indigo-950/20 border-indigo-500/30' 
                        : 'bg-gradient-to-r from-gray-900/80 via-gray-900/80 to-indigo-900/10 border-gray-800 hover:border-indigo-500/30 hover:bg-gray-900'
                        }
                    `}
                >
                    {/* Left Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isExpanded ? 'bg-indigo-500' : 'bg-transparent group-hover/btn:bg-indigo-500/50'}`}></div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1.5 w-full pr-8">
                            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-400 group-hover/btn:text-indigo-300 transition-colors">
                                <Sparkles size={14} className={isExpanded ? "text-indigo-400 fill-indigo-400/20" : "text-indigo-500"} /> 
                                {isExpanded ? 'Hide AI Thought Process' : 'Analyze Decision Protocol'}
                            </div>
                            
                            {!isExpanded && (
                                <div className="text-gray-400 font-mono truncate w-full text-xs pl-6 flex items-center gap-2 opacity-80 group-hover/btn:opacity-100 transition-opacity">
                                    <BrainCircuit size={12} className="text-gray-600 shrink-0" />
                                    <span className="italic">"{trade.thoughts?.summary}"</span>
                                </div>
                            )}
                        </div>
                        
                        <div className={`transition-transform duration-300 text-indigo-500 ${isExpanded ? 'rotate-180' : ''}`}>
                             <ChevronDown size={18} />
                        </div>
                    </div>
                </div>
            ) : (
               <div className="px-5 py-2 text-xs bg-gray-900/30 border-t border-gray-800 text-gray-600 italic flex items-center gap-2">
                   <ScanSearch size={14} /> Analysis data archiving...
               </div>
            )}

            {/* Expanded Thinking Trace */}
            {isExpanded && trade.thoughts && (
               <div className="px-5 pb-5 bg-indigo-950/10 border-t border-indigo-500/10 animate-in slide-in-from-top-2 duration-300">
                  <ThinkingTrace thoughts={trade.thoughts} agentName={trade.agentId.toUpperCase()} />
               </div>
            )}
            
            {isExpanded && !trade.thoughts && (
               <div className="px-5 pb-5 pt-4 text-center text-xs text-gray-600 italic">
                  Detailed reasoning data not available for this historical trade.
               </div>
            )}

          </div>
        );
      })}
    </div>
  );
};