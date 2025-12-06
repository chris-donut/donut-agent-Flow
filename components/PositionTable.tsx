import React from 'react';
import { Position } from '../types';
import { Target, AlertOctagon } from 'lucide-react';

interface PositionTableProps {
  positions: Position[];
}

export const PositionTable: React.FC<PositionTableProps> = ({ positions }) => {
  if (positions.length === 0) {
    return <div className="p-8 text-center text-gray-500">No active positions.</div>;
  }

  return (
    <div className="overflow-visible md:overflow-visible overflow-x-auto min-h-[300px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-500 border-b border-gray-800 bg-gray-900/50">
            <th className="p-3 font-medium">Symbol</th>
            <th className="p-3 font-medium">Side</th>
            <th className="p-3 font-medium">Size (Lev)</th>
            <th className="p-3 font-medium">Entry</th>
            <th className="p-3 font-medium text-right">Unrealized PnL</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {positions.map(pos => (
            <React.Fragment key={pos.id}>
              <tr className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 font-mono font-bold text-gray-200 align-top">
                    <div className="flex items-center gap-2 relative">
                        {pos.symbol}
                        {pos.exitPlan && (
                            <div className="group relative">
                                <button className="text-[10px] font-bold text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider cursor-help transition-colors flex items-center gap-1">
                                    <Target size={10} /> Exit Plan
                                </button>
                                {/* Tooltip Popover */}
                                <div className="absolute left-0 top-full mt-2 w-72 bg-[#18181b] border border-gray-700 rounded-lg shadow-2xl p-0 z-50 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                                    <div className="p-3 border-b border-gray-800 bg-gray-900/50 rounded-t-lg flex justify-between items-center">
                                        <h4 className="font-bold text-white text-xs">Exit Strategy</h4>
                                        <span className="text-[10px] text-gray-500 font-mono">ID: {pos.id}</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400">Target Price</span>
                                            <span className="text-emerald-400 font-mono font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">${pos.exitPlan.targetPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400">Stop Loss</span>
                                            <span className="text-rose-400 font-mono font-bold bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/50">${pos.exitPlan.stopLossPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-800">
                                            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1.5">
                                                <AlertOctagon size={12} className="text-orange-500" />
                                                <span className="font-semibold text-gray-300">Invalidation Condition</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                {pos.exitPlan.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute -top-1.5 left-8 w-3 h-3 bg-[#18181b] border-t border-l border-gray-700 transform rotate-45"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </td>
                <td className="p-3 align-top">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${pos.side === 'LONG' ? 'text-emerald-400 bg-emerald-900/20' : 'text-rose-400 bg-rose-900/20'}`}>
                    {pos.side}
                  </span>
                </td>
                <td className="p-3 font-mono text-gray-300 align-top">
                  ${pos.size.toLocaleString()} <span className="text-gray-500 text-xs">({pos.leverage}x)</span>
                </td>
                <td className="p-3 font-mono text-gray-300 align-top">${pos.entryPrice.toLocaleString()}</td>
                <td className={`p-3 font-mono font-bold text-right align-top ${pos.unrealizedPnlDollar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${pos.unrealizedPnlDollar} ({pos.unrealizedPnlPct}%)
                </td>
              </tr>
              {/* Short explanation row */}
              <tr className="border-b border-gray-800">
                <td colSpan={5} className="px-3 pb-3 pt-0">
                   <div className="bg-gray-900 rounded p-2 text-xs text-gray-400 border border-gray-800/50 flex gap-2">
                      <span className="font-semibold text-indigo-400 whitespace-nowrap">Strategy:</span>
                      {pos.explanation}
                   </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};