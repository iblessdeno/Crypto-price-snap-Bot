import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, DollarSign, Bitcoin, Database, Briefcase } from 'lucide-react';

const GlobalMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/global')
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setMetrics(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching global metrics:', error);
        setLoading(false);
      });
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(2)}%`;
  };

  const metricCards = [
    {
      title: 'Total Market Cap',
      value: metrics?.total_market_cap,
      format: formatNumber,
      icon: DollarSign,
      color: '#36F456'
    },
    {
      title: '24h Volume',
      value: metrics?.total_volume_24h,
      format: formatNumber,
      icon: Activity,
      color: '#627EEA'
    },
    {
      title: 'BTC Dominance',
      value: metrics?.btc_dominance,
      format: formatPercentage,
      icon: Bitcoin,
      color: '#F7931A'
    },
    {
      title: 'ETH Dominance',
      value: metrics?.eth_dominance,
      format: formatPercentage,
      icon: Briefcase,
      color: '#627EEA'
    },
    {
      title: 'Active Cryptos',
      value: metrics?.active_cryptocurrencies,
      format: (num) => num?.toLocaleString(),
      icon: TrendingUp,
      color: '#9945FF'
    },
    {
      title: 'Total Cryptos',
      value: metrics?.total_cryptocurrencies,
      format: (num) => num?.toLocaleString(),
      icon: Database,
      color: '#FF6B00'
    }
  ];

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="relative">
        {/* Outer Glass Container */}
        <div className="relative w-full rounded-[2rem] bg-black/30 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Glass Border Effect */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Archivo Black", serif' }}>
              Global Market Metrics
            </h1>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metricCards.map((card) => (
              <div
                key={card.title}
                className="relative rounded-xl p-4"
                style={{
                  background: `${card.color}10`,
                  border: `1px solid ${card.color}20`
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: `${card.color}20` }}
                  >
                    <card.icon
                      className="w-6 h-6"
                      style={{ color: card.color }}
                    />
                  </div>
                  <h2 className="text-sm text-gray-400">{card.title}</h2>
                </div>
                <div className="mt-2">
                  <p
                    className="text-xl font-bold"
                    style={{ color: card.color }}
                  >
                    {card.value ? card.format(card.value) : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMetrics;
