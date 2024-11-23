import React from 'react';
import { formatCryptoPrice, formatPercentageChange } from '../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CryptoGrid = ({ cryptos = [] }) => {
  // Color mapping for specific cryptocurrencies
  const colorScheme = {
    BTC: {
      name: 'Bitcoin',
      textColor: '#F7931A',
      boxBg: 'rgba(247, 147, 26, 0.1)',
      borderColor: 'rgba(247, 147, 26, 0.2)'
    },
    ETH: {
      name: 'Ethereum',
      textColor: '#627EEA',
      boxBg: 'rgba(98, 126, 234, 0.1)',
      borderColor: 'rgba(98, 126, 234, 0.2)'
    },
    SOL: {
      name: 'Solana',
      textColor: '#9945FF',
      boxBg: 'rgba(153, 69, 255, 0.1)',
      borderColor: 'rgba(153, 69, 255, 0.2)'
    },
    TON: {
      name: 'Toncoin',
      textColor: '#0088CC',
      boxBg: 'rgba(0, 136, 204, 0.1)',
      borderColor: 'rgba(0, 136, 204, 0.2)'
    },
    LTC: {
      name: 'Litecoin',
      textColor: '#BFBBBB',
      boxBg: 'rgba(191, 187, 187, 0.1)',
      borderColor: 'rgba(191, 187, 187, 0.2)'
    },
    XMR: {
      name: 'Monero',
      textColor: '#FF6B00',
      boxBg: 'rgba(255, 107, 0, 0.1)',
      borderColor: 'rgba(255, 107, 0, 0.2)'
    }
  };

  // Default color scheme for other cryptocurrencies
  const defaultColors = {
    textColor: '#ffffff',
    boxBg: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  };

  const getColors = (symbol) => {
    return colorScheme[symbol] || {
      name: symbol,
      ...defaultColors
    };
  };

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
              Top Cryptocurrencies
            </h1>
          </div>

          {/* Grid */}
          <div className="crypto-grid grid grid-cols-2 md:grid-cols-3 gap-4">
            {cryptos.map((crypto) => {
              const colors = getColors(crypto.symbol);
              const isPositive = parseFloat(crypto.percent_change_24h) >= 0;

              return (
                <div
                  key={crypto.symbol}
                  className="relative rounded-xl p-4"
                  style={{
                    background: colors.boxBg,
                    border: `1px solid ${colors.borderColor}`
                  }}
                >
                  {/* Coin Info */}
                  <div className="flex items-center gap-3 mb-3">
                    {crypto.logo ? (
                      <img
                        src={crypto.logo}
                        alt={crypto.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center p-2 text-center"
                        style={{
                          background: `linear-gradient(135deg, ${colors.textColor}20, ${colors.textColor}10)`,
                          border: `1px solid ${colors.borderColor}`
                        }}
                      >
                        <span 
                          className="text-[0.6rem] font-bold leading-tight"
                          style={{ color: colors.textColor }}
                        >
                          COIN NOT FOUND
                        </span>
                      </div>
                    )}
                    <div>
                      <h2
                        className="text-lg font-bold"
                        style={{ color: colors.textColor }}
                      >
                        {colors.name}
                      </h2>
                      <p className="text-sm text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <p className="text-xl font-bold text-white">
                      {formatCryptoPrice(crypto.price)}
                    </p>
                  </div>

                  {/* 24h Change */}
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium ${
                      isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {isPositive ? 
                      <TrendingUp className="w-4 h-4 mr-1" /> : 
                      <TrendingDown className="w-4 h-4 mr-1" />
                    }
                    {formatPercentageChange(crypto.percent_change_24h)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoGrid;
