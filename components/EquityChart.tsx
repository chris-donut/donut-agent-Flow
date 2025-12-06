import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { EquityPoint, Agent } from '../types';

interface EquityChartProps {
  data: EquityPoint[];
  agents: Agent[];
  highlightedAgentId?: string;
  showBenchmark?: boolean;
  viewMode: 'equity' | 'drawdown' | 'pnl';
}

export const EquityChart: React.FC<EquityChartProps> = ({ 
  data, 
  agents, 
  highlightedAgentId, 
  showBenchmark = true,
  viewMode
}) => {
  const isDrawdown = viewMode === 'drawdown';
  const isPnL = viewMode === 'pnl';

  // Calculate PnL Data on the fly if needed
  const chartData = useMemo(() => {
    if (viewMode !== 'pnl' || data.length === 0) return data;

    const firstPoint = data[0];
    const initialValues: Record<string, number> = {};
    
    // Capture initial values
    agents.forEach(a => {
        initialValues[a.id] = Number(firstPoint[a.id]);
    });
    initialValues['btc'] = Number(firstPoint['btc']);

    return data.map(point => {
        const newPoint = { ...point };
        
        // Calculate PnL % for agents
        agents.forEach(a => {
            const val = Number(point[a.id]);
            const init = initialValues[a.id];
            // Avoid division by zero, though equity shouldn't be 0
            newPoint[`${a.id}_pnl`] = init ? Number((((val - init) / init) * 100).toFixed(2)) : 0;
        });

        // Calculate PnL % for BTC
        const btcVal = Number(point['btc']);
        const btcInit = initialValues['btc'];
        newPoint['btc_pnl'] = btcInit ? Number((((btcVal - btcInit) / btcInit) * 100).toFixed(2)) : 0;

        return newPoint;
    });
  }, [data, viewMode, agents]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#71717a', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={isDrawdown ? ['auto', 0] : ['auto', 'auto']} 
            tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => (isDrawdown || isPnL) ? `${value}%` : `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '6px', fontSize: '12px' }}
            itemStyle={{ color: '#e4e4e7' }}
            formatter={(value: number) => [
              (isDrawdown || isPnL) ? `${value}%` : `$${value.toLocaleString()}`, 
              ''
            ]}
            labelStyle={{ color: '#a1a1aa', marginBottom: '0.5rem' }}
          />
          
          {/* BTC Benchmark - Updated to Orange */}
          {showBenchmark && (
            <Line 
              type="monotone" 
              dataKey={isDrawdown ? 'btc_dd' : (isPnL ? 'btc_pnl' : 'btc')} 
              stroke="#f97316" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false} 
              activeDot={false}
              name="BTC Benchmark"
            />
          )}

          {/* Render lines for all agents passed in props */}
          {agents.map((agent, index) => {
            // Colors palette
            const colors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];
            const color = colors[index % colors.length];
            const isHighlighted = highlightedAgentId === agent.id;
            const isFaded = highlightedAgentId && !isHighlighted;
            
            // Determine data key based on mode
            const dataKey = isDrawdown ? `${agent.id}_dd` : (isPnL ? `${agent.id}_pnl` : agent.id);

            return (
              <Line
                key={agent.id}
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={isHighlighted ? 3 : 1.5}
                strokeOpacity={isFaded ? 0.2 : 1}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name={agent.name}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};