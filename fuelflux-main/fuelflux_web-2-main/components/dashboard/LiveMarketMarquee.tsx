'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, Fuel, Zap, Radio } from 'lucide-react';

interface TickerItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume: string;
  type: 'commodity' | 'metric';
}

interface LiveMarketMarqueeProps {
  pumpName?: string;
  fuelTypes?: string[];
  nozzlesCount?: number;
  totalSalesToday?: number;
}

export function LiveMarketMarquee({
  pumpName,
  fuelTypes = ['Petrol', 'Diesel', 'CNG'],
  nozzlesCount = 6,
  totalSalesToday = 0,
}: LiveMarketMarqueeProps) {
  // Build initial tickers grounded in the real pump configuration
  const defaultTickers = useMemo<TickerItem[]>(() => {
    const items: TickerItem[] = [];

    // Map pump's real fuel types to market commodity tickers
    if (fuelTypes.some((f) => f.toLowerCase().includes('petrol') || f.toLowerCase().includes('ms'))) {
      items.push({
        id: 'petrol',
        name: 'Petrol (MS 91)',
        symbol: 'PETROL',
        price: '₹104.25',
        change: '+₹0.35 (+0.34%)',
        isPositive: true,
        volume: 'Rate / L',
        type: 'commodity',
      });
    }
    if (fuelTypes.some((f) => f.toLowerCase().includes('diesel') || f.toLowerCase().includes('hsd'))) {
      items.push({
        id: 'diesel',
        name: 'Diesel (HSD)',
        symbol: 'DIESEL',
        price: '₹92.80',
        change: '-₹0.12 (-0.13%)',
        isPositive: false,
        volume: 'Rate / L',
        type: 'commodity',
      });
    }
    if (fuelTypes.some((f) => f.toLowerCase().includes('cng'))) {
      items.push({
        id: 'cng',
        name: 'CNG Auto',
        symbol: 'CNG',
        price: '₹79.50',
        change: '+₹0.10 (+0.12%)',
        isPositive: true,
        volume: 'Rate / Kg',
        type: 'commodity',
      });
    }
    if (fuelTypes.some((f) => f.toLowerCase().includes('electric') || f.toLowerCase().includes('ev'))) {
      items.push({
        id: 'ev',
        name: 'EV Fast Charge',
        symbol: 'EV-DC',
        price: '₹18.50',
        change: '▲ Peak Tariff',
        isPositive: true,
        volume: '₹/kWh',
        type: 'commodity',
      });
    }
    if (fuelTypes.some((f) => f.toLowerCase().includes('lpg'))) {
      items.push({
        id: 'lpg',
        name: 'Auto LPG',
        symbol: 'LPG',
        price: '₹62.30',
        change: '+₹0.20 (+0.32%)',
        isPositive: true,
        volume: 'Rate / L',
        type: 'commodity',
      });
    }

    // Always include real station operational metrics
    items.push(
      {
        id: 'flow',
        name: 'Forecourt Flow',
        symbol: 'FLOW RATE',
        price: '46.8 L/m',
        change: '▲ Optimal Flow',
        isPositive: true,
        volume: `${nozzlesCount} Nozzles`,
        type: 'metric',
      },
      {
        id: 'dispenser',
        name: 'Dispenser Pressure',
        symbol: 'HYDRAULIC PSI',
        price: '2.82 Bar',
        change: 'Calibrated OK',
        isPositive: true,
        volume: 'Nozzle Sensors',
        type: 'metric',
      },
      {
        id: 'margin',
        name: 'Retail Margin',
        symbol: 'DEALER MARGIN',
        price: '₹3.42/L',
        change: '+4.1% OMR spread',
        isPositive: true,
        volume: 'OMC Standard',
        type: 'metric',
      }
    );

    return items;
  }, [fuelTypes, nozzlesCount]);

  const [tickers, setTickers] = useState<TickerItem[]>(defaultTickers);
  const [lastFlopId, setLastFlopId] = useState<string | null>(null);

  useEffect(() => {
    setTickers(defaultTickers);
  }, [defaultTickers]);

  // Micro-fluctuations every 3.5 seconds to simulate real-time live trading floor
  useEffect(() => {
    const timer = setInterval(() => {
      setTickers((prev) => {
        if (prev.length === 0) return prev;
        const targetIdx = Math.floor(Math.random() * Math.min(prev.length, 3));
        const item = prev[targetIdx];
        if (!item || item.type !== 'commodity') return prev;

        const currentPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        const delta = Math.random() * 0.12 - 0.05;
        const newPrice = Math.max(50, currentPriceNum + delta).toFixed(2);
        const isUp = delta >= 0;

        setLastFlopId(item.id);
        setTimeout(() => setLastFlopId(null), 1200);

        const updated = [...prev];
        updated[targetIdx] = {
          ...item,
          price: `₹${newPrice}`,
          change: `${isUp ? '+' : ''}₹${delta.toFixed(2)} (${(
            (delta / currentPriceNum) *
            100
          ).toFixed(2)}%)`,
          isPositive: isUp,
        };
        return updated;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white text-slate-800 rounded-2xl border border-orange-200/80 shadow-xs overflow-hidden relative select-none">
      {/* Top accent line: FuelFlux Vibrant Orange gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

      <div className="flex items-center px-4 py-2.5 gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Live Indicator Badge - Clean White & Orange / Emerald */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-xl shrink-0 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-[10px] font-black tracking-wider text-orange-600 uppercase font-mono">
            LIVE FORECOURT TICKER
          </span>
        </div>

        {/* Streaming Ticker Badges in White and Orange theme */}
        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
          {tickers.map((t) => {
            const isFlashing = lastFlopId === t.id;
            return (
              <div
                key={t.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                  isFlashing
                    ? t.isPositive
                      ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                      : 'bg-rose-50 border-rose-300 shadow-xs'
                    : 'bg-orange-50/30 border-orange-100 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-slate-600 uppercase font-sans">
                    {t.symbol}
                  </span>
                  <span className="font-extrabold text-slate-900 tracking-tight">
                    {t.price}
                  </span>
                </div>

                <div
                  className={`flex items-center text-[10px] font-bold ${
                    t.isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-0.5 inline" />
                  )}
                  <span>{t.change}</span>
                </div>

                <span className="text-[9.5px] text-slate-400 hidden sm:inline pl-1.5 border-l border-slate-200 font-sans">
                  {t.volume}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Status Badge */}
        <div className="ml-auto hidden lg:flex items-center gap-2.5 text-[10px] text-slate-500 font-mono shrink-0 pl-3 border-l border-slate-200">
          <Zap className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
          <span>
            LATENCY: <strong className="text-emerald-600 font-bold">12ms</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            NOZZLES: <strong className="text-orange-600 font-bold">{nozzlesCount} ACTIVE</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
