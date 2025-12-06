import React, { useState } from 'react';
import { X, Wallet, ArrowRight, ShieldCheck } from 'lucide-react';
import { Agent } from '../types';

interface DepositModalProps {
  agent: Agent;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ agent, onClose, onDeposit }) => {
  const [amount, setAmount] = useState<string>('1000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
      onDeposit(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
             <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-6">
             <img src={agent.avatarUrl} className="w-12 h-12 rounded-full border border-gray-600" alt={agent.name} />
             <div>
                <h2 className="text-lg font-bold text-white">Open {agent.name} Vault</h2>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                   <ShieldCheck size={12} className="text-emerald-500"/> Verified Strategy
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
                <label className="block text-sm text-gray-400 mb-2">Deposit Amount (USDC)</label>
                <div className="relative">
                   <Wallet className="absolute left-3 top-3 text-gray-500" size={18} />
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="w-full bg-black border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white font-mono focus:border-indigo-500 focus:outline-none"
                     placeholder="0.00"
                     min="100"
                   />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                   <span>Min: $100</span>
                   <span>Balance: $12,450.00</span>
                </div>
             </div>

             <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800 space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Management Fee</span>
                   <span className="text-white">0%</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Performance Fee</span>
                   <span className="text-white">10% (on profits)</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-sm">
                   <span className="text-gray-300">Est. Annual Return</span>
                   <span className="text-emerald-400 font-bold">~{agent.sinceLaunchReturnPct}%</span>
                </div>
             </div>

             <button 
               type="submit"
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
             >
               Confirm Deposit <ArrowRight size={16} />
             </button>
          </form>
       </div>
    </div>
  );
};