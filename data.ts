import { Agent, Trade, Position, EquityPoint } from './types';

export const agents: Agent[] = [
  {
    id: "kimi-01",
    name: "KIMI-01",
    avatarUrl: "https://picsum.photos/id/1/200/200",
    styleTags: ["Trend", "Low Frequency", "BTC+ETH"],
    sinceLaunchReturnPct: 18.7,
    maxDrawdownPct: -12.3,
    sharpeEstimate: 2.1,
    tradesPerDay: 1.2,
    daysLive: 143,
    fitScoreForUser: 92,
    emotionalFirewallLevel: "Strict",
    description: "Captures multi-day trends in major caps while strictly limiting drawdown.",
    config: {
        riskProfile: "Conservative",
        aiModel: "Claude 3.5 Sonnet",
        horizon: "Swing",
        maxTokens: 8192,
        cerberus: {
            structural: 75,
            quant: 40,
            strategic: 30,
            governor: "Strong"
        },
        edge: {
            dog: 80,
            tail: 20
        }
    },
    fullStrategyMemo: {
        goal: "Outperform BTC over 6-12 month horizons with <15% Max DD.",
        dataSources: ["4H OHLCV", "Funding Rates", "Aggregated Open Interest"],
        riskGuardrails: ["Max 2% risk per trade", "Hard stop at -15% equity", "No trading during high-impact news"]
    }
  },
  {
    id: "alpha-centauri",
    name: "Alpha Centauri",
    avatarUrl: "https://picsum.photos/id/2/200/200",
    styleTags: ["Mean Reversion", "Perps ≤ 3x"],
    sinceLaunchReturnPct: 42.5,
    maxDrawdownPct: -24.1,
    sharpeEstimate: 1.6,
    tradesPerDay: 5.4,
    daysLive: 89,
    fitScoreForUser: 65,
    emotionalFirewallLevel: "Moderate",
    description: "Aggressive mean reversion on SOL and high-beta alts.",
    config: {
        riskProfile: "Aggressive",
        aiModel: "Llama 3 70B",
        horizon: "Scalp",
        maxTokens: 4096,
        cerberus: {
            structural: 30,
            quant: 80,
            strategic: 50,
            governor: "Weak"
        },
        edge: {
            dog: 40,
            tail: 60
        }
    },
    fullStrategyMemo: {
        goal: "Maximize absolute returns on high volatility assets.",
        dataSources: ["15m OHLCV", "Order Book Imbalance"],
        riskGuardrails: ["Max 5x leverage (dynamic)", "Daily loss limit 4%"]
    }
  },
  {
    id: "zenith-guard",
    name: "Zenith Guard",
    avatarUrl: "https://picsum.photos/id/3/200/200",
    styleTags: ["DeFi-Native", "Low Frequency"],
    sinceLaunchReturnPct: 8.4,
    maxDrawdownPct: -3.2,
    sharpeEstimate: 3.4,
    tradesPerDay: 0.3,
    daysLive: 210,
    fitScoreForUser: 88,
    emotionalFirewallLevel: "Strict",
    description: "Capital preservation focused strategy trading spot pairs only.",
    config: {
        riskProfile: "Very Conservative",
        aiModel: "Qwen Max",
        horizon: "Position",
        maxTokens: 16384,
        cerberus: {
            structural: 90,
            quant: 20,
            strategic: 20,
            governor: "Strong"
        },
        edge: {
            dog: 90,
            tail: 10
        }
    },
    fullStrategyMemo: {
        goal: "Steady growth with minimal volatility. Cash equivalent approach.",
        dataSources: ["Daily OHLCV", "On-chain Volume"],
        riskGuardrails: ["Spot only", "No leverage", "Stop loss at -5%"]
    }
  }
];

export const trades: Trade[] = [
  {
    id: "t1",
    agentId: "kimi-01",
    timestamp: "2024-05-12 10:24",
    symbol: "BTCUSDT",
    side: "LONG",
    entryPrice: 61200,
    exitPrice: 62450,
    quantity: 0.5,
    notional: 30600,
    holdingTimeMinutes: 340,
    pnlDollar: 625,
    pnlPct: 2.04,
    ruleTag: "Trend Pullback Buy",
    actionTag: "TakeProfit",
    explanation: "Price pulled back to support inside an uptrend with neutral funding and rising open interest. Exited on resistance test.",
    thoughts: {
        summary: "I'm closing my BTC position as we've tagged the 4H resistance block at 62.4k. While structure remains bullish, funding has spiked to 0.02% suggesting local overheating. I prefer to bank the 2% gain and wait for a reload lower.",
        marketState: `1. Global Structure: 4h uptrend near range highs.
2. Local Funding: +0.02% (Long bias crowded).
3. Rel. Vol: Declining on approach to resistance.
4. Dog vs Tail: 60% Dog (Structure) / 40% Tail (Sentiment).`,
        chainOfThought: `1.  **Observation**: Price is testing the upper bound of the weekly value area ($62,400).
2.  **Analysis**: Order book shows significant ask depth at $62,500. CVD (Cumulative Volume Delta) is diverging negatively on the 15m chart.
3.  **Risk Check**: My R:R on this trade has diminished to 1:0.5 if I hold for breakout.
4.  **Synthesis**: The probability of a rejection here > probability of clean breakout immediately.`,
        decisionProtocol: `ACTION: CLOSE_LONG
SIZE: 100%
LIMIT: $62,450
REASON: Take Profit at technical resistance + funding arbitrage.`
    }
  },
  {
    id: "t2",
    agentId: "kimi-01",
    timestamp: "2024-05-11 14:00",
    symbol: "ETHUSDT",
    side: "SHORT",
    entryPrice: 3400,
    exitPrice: 3450,
    quantity: 5,
    notional: 17000,
    holdingTimeMinutes: 120,
    pnlDollar: -250,
    pnlPct: -1.47,
    ruleTag: "Volatility Defense",
    actionTag: "StopLoss",
    explanation: "Sudden spike in volatility triggered defensive stop-loss to preserve capital.",
    thoughts: {
        summary: "Forced to cut the ETH short. The invalidation level at 3440 was breached with high volume. My thesis of a rejection at the 3400 pivot is nullified by the spot buying absorption.",
        marketState: `1. Global Structure: Choppy/Sideways.
2. Local Funding: Neutral.
3. Volatility: Spiked 15% in last hour.`,
        chainOfThought: `1. **Trigger**: Price > 3440 (Stop Level).
2. **Assessment**: Is this a fake-out? Volume profile suggests real capital inflow, not just a liquidity hunt.
3. **Execution**: Market buy to close. Do not wait for limit.`,
        decisionProtocol: `ACTION: STOP_LOSS
SIZE: 100%
TYPE: MARKET
REASON: Structural invalidation.`
    }
  },
   {
    id: "t3",
    agentId: "alpha-centauri",
    timestamp: "2024-05-12 09:15",
    symbol: "SOLUSDT",
    side: "LONG",
    entryPrice: 145,
    exitPrice: 152,
    quantity: 100,
    notional: 14500,
    holdingTimeMinutes: 45,
    pnlDollar: 700,
    pnlPct: 4.8,
    ruleTag: "RSI Divergence",
    actionTag: "Entry",
    explanation: "Detected bullish divergence on 15m RSI while price made lower low.",
    thoughts: {
      summary: "Entering aggressive scalp long on SOL. 15m RSI printed a classic bullish divergence while price swept the $144 lows. Order book shows bid replenishment.",
      marketState: `1. Price Action: Lower Low ($144.20).
2. Oscillator: Higher Low (RSI 32 -> 38).
3. Venue: Binance Perp.`,
      chainOfThought: `1. **Signal**: Bullish Divergence detected.
2. **Context**: SOL is lagging ETH recovery. Catch-up trade potential.
3. **Target**: $152 (Previous hourly S/R).`,
      decisionProtocol: `ACTION: OPEN_LONG
SIZE: 200 SOL
LEVERAGE: 3x`
    }
  }
];

export const positions: Position[] = [
  {
    id: "p1",
    agentId: "kimi-01",
    symbol: "BTCUSDT",
    side: "LONG",
    entryPrice: 63100,
    currentPrice: 63850,
    liquidationPrice: 45000,
    size: 0.8,
    leverage: 2,
    unrealizedPnlDollar: 600,
    unrealizedPnlPct: 1.18,
    explanation: "Holding as long as 4H trend structure remains intact above $62k.",
    exitPlan: {
      targetPrice: 68500,
      stopLossPrice: 59800,
      description: "Invalid Condition: Daily close below 60k invalidates the bull flag structure. Target based on 1.618 Fib extension of recent swing."
    }
  },
  {
    id: "p2",
    agentId: "alpha-centauri",
    symbol: "DOGEUSDT",
    side: "SHORT",
    entryPrice: 0.15,
    currentPrice: 0.148,
    liquidationPrice: 0.18,
    size: 50000,
    leverage: 5,
    unrealizedPnlDollar: 100,
    unrealizedPnlPct: 1.3,
    explanation: "Mean reversion play targeting 0.145 support area.",
    exitPlan: {
      targetPrice: 0.135,
      stopLossPrice: 0.158,
      description: "Invalid Condition: If price accepts above 0.155 volume node for > 1 hour, the mean reversion thesis is invalidated."
    }
  }
];

// Helper to calc drawdown
const updateDrawdown = (currentVal: number, maxVal: number) => {
    return ((currentVal - maxVal) / maxVal) * 100;
};

// Generate synthetic equity data with realistic market phases
const generateEquityData = (): EquityPoint[] => {
  const data: EquityPoint[] = [];
  const points = 180; // 6 months of data
  
  // Starting values (Normalized)
  let vals: Record<string, number> = {
    'kimi-01': 1000,
    'alpha-centauri': 1000,
    'zenith-guard': 1000,
    'btc': 1000
  };
  
  // High water marks for Drawdown calc
  let maxVals = {...vals};

  const now = new Date();

  // Simulation Logic:
  // We simulate 3 distinct market phases over the last 180 days to show different agent strengths.
  // 1. Accumulation/Chop (Days 180-120)
  // 2. Bull Trend (Days 120-40)
  // 3. Correction/Volatility (Days 40-0)
  
  for (let i = points; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Determine Market Phase
    let phase = 0; // 0 = Chop
    if (i < 120 && i >= 40) phase = 1; // 1 = Bull Trend
    if (i < 40) phase = 2; // 2 = Correction/Vol

    // --- Benchmark (BTC) Logic ---
    let btcMove = 0;
    if (phase === 0) btcMove = (Math.random() - 0.5) * 0.015; // Chop: +/- 0.75%
    if (phase === 1) btcMove = (Math.random() - 0.35) * 0.02; // Trend: Upward bias, avg +0.3% daily
    if (phase === 2) btcMove = (Math.random() - 0.55) * 0.025; // Correction: Downward bias, higher vol

    vals['btc'] *= (1 + btcMove);


    // --- KIMI-01 (Trend Follower) ---
    // Strengths: Captures Phase 1 (Bull) excellently.
    // Weakness: Whipsaws in Phase 0 & 2 (Chop/Correction).
    let kimiAlpha = 0;
    if (phase === 1) kimiAlpha = 0.0025; // Good alpha in trends
    if (phase === 0 || phase === 2) kimiAlpha = -0.001; // Bleeds slowly in chop due to false breakouts
    
    // High correlation to BTC (0.7), plus alpha
    vals['kimi-01'] *= (1 + (btcMove * 0.7) + kimiAlpha + ((Math.random() - 0.5) * 0.008));


    // --- ALPHA CENTAURI (Mean Reversion / High Vol) ---
    // Strengths: Loves Phase 0 (Chop) and Phase 2 (Vol).
    // Weakness: Can get run over in Phase 1 (Strong Trend) if counter-trading.
    let alphaAlpha = 0;
    if (phase === 0) alphaAlpha = 0.003; // Farming chop
    if (phase === 2) alphaAlpha = 0.004; // Loving the volatility
    if (phase === 1) alphaAlpha = -0.0015; // Fighting the trend slightly

    // Lower correlation to BTC (0.2), High idiosyncratic noise (0.04)
    vals['alpha-centauri'] *= (1 + (btcMove * 0.2) + alphaAlpha + ((Math.random() - 0.5) * 0.04));


    // --- ZENITH GUARD (Delta Neutral / Yield) ---
    // Strengths: Consistent in all phases.
    // Weakness: Lower ceiling.
    const zenithYield = 0.0004; // Daily ~0.04% -> ~14% APY base
    const zenithNoise = (Math.random() - 0.5) * 0.002; // Very low noise
    
    vals['zenith-guard'] *= (1 + zenithYield + zenithNoise);


    // Update Max Values for Drawdown Calculation
    Object.keys(vals).forEach(k => {
        maxVals[k] = Math.max(maxVals[k], vals[k]);
    });

    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      
      // Equity Values
      'kimi-01': Number(vals['kimi-01'].toFixed(2)),
      'alpha-centauri': Number(vals['alpha-centauri'].toFixed(2)),
      'zenith-guard': Number(vals['zenith-guard'].toFixed(2)),
      'btc': Number(vals['btc'].toFixed(2)),
      
      // Drawdown Values
      'kimi-01_dd': Number(updateDrawdown(vals['kimi-01'], maxVals['kimi-01']).toFixed(2)),
      'alpha-centauri_dd': Number(updateDrawdown(vals['alpha-centauri'], maxVals['alpha-centauri']).toFixed(2)),
      'zenith-guard_dd': Number(updateDrawdown(vals['zenith-guard'], maxVals['zenith-guard']).toFixed(2)),
      'btc_dd': Number(updateDrawdown(vals['btc'], maxVals['btc']).toFixed(2)),
    });
  }

  return data;
};

export const equityData = generateEquityData();