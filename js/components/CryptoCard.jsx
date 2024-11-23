import { useEffect, useState } from 'react';
import { formatCryptoPrice, formatPercentageChange } from '../utils/formatters';

export default function CryptoCard({ price = '0', change24h = '0', change7d = '0' }) {
  const [coinInfo, setCoinInfo] = useState({
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: ''
  });

  // Get performance colors for each metric
  const is24hPositive = parseFloat(change24h) >= 0;
  const is7dPositive = parseFloat(change7d) >= 0;

  // Define color schemes based on performance
  const colorScheme = is24hPositive ? {
    gradientFrom: '#101010',
    gradientTo: '#1D7430',
    accentColor: '#36F456',
    chartColor: '#36F456',
  } : {
    gradientFrom: '#101010',
    gradientTo: '#940018',
    accentColor: '#EE0808',
    chartColor: '#EE0808',
  };

  // Get colors for each metric box
  const get24hColors = () => ({
    textColor: is24hPositive ? '#36F456' : '#EE0808',
    boxBg: is24hPositive ? '#0F3715' : '#41040B'
  });

  const get7dColors = () => ({
    textColor: is7dPositive ? '#30FD64' : '#EE0808',
    boxBg: is7dPositive ? '#2E4226' : '#41040B'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol') || 'BTC';
    
    fetch(`/api/coininfo?symbol=${symbol}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.name && data.symbol) {
          setCoinInfo({
            name: data.name,
            symbol: data.symbol.toUpperCase(),
            logo: data.logo
          });
        }
      })
      .catch(error => console.error('Error fetching coin info:', error));
  }, []);

  // Format the price using the utility function
  const formattedPrice = formatCryptoPrice(parseFloat(price.replace(/[$,]/g, '')));

  return (
    <div className="card-wrapper">
      {/* Outer Glass Container */}
      <div className="relative w-full max-w-2xl mx-auto rounded-[3rem] bg-white/5 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Glass Border Effect */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {/* Main Card Container */}
        <div 
          className="relative w-full overflow-hidden rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{
            background: `linear-gradient(to bottom, ${colorScheme.gradientFrom}, ${colorScheme.gradientTo})`
          }}
        >
          {/* Background chart line */}
          <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
            <svg
              viewBox="0 0 1000 400"
              className="absolute bottom-0 left-0 right-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 400 C 200 350, 400 300, 600 200 S 800 100, 1000 150 L 1000 400 L 0 400 Z"
                style={{ fill: colorScheme.chartColor, opacity: 0.1 }}
              />
              <path
                d="M0 400 C 200 300, 400 250, 600 150 S 800 50, 1000 100"
                fill="none"
                stroke={colorScheme.chartColor}
                strokeWidth="2"
                style={{ opacity: 0.2 }}
              />
            </svg>
          </div>

          {/* Card content */}
          <div className="relative p-8">
            {/* Header with coin info */}
            <div className="flex items-center gap-6 mb-8 bg-[#101010]/50 p-4 rounded-2xl backdrop-blur-sm">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg p-2">
                  {coinInfo.logo ? (
                    <img src={coinInfo.logo} alt={coinInfo.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl text-white tracking-wide" style={{ fontFamily: '"Archivo Black", serif' }}>{coinInfo.name}</h2>
                <p className="text-lg" style={{ fontFamily: '"Anton", sans-serif', color: colorScheme.accentColor }}>{coinInfo.symbol}</p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 text-center">
              <div 
                className="text-7xl tracking-tight"
                style={{ fontFamily: '"Anton", sans-serif' }}
              >
                <span style={{ 
                  backgroundImage: `linear-gradient(to bottom, white, ${colorScheme.accentColor}70)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block'
                }}>
                  {formattedPrice}
                </span>
              </div>
            </div>

            {/* Change percentages in boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="rounded-2xl p-4 backdrop-blur-sm" 
                style={{ backgroundColor: get24hColors().boxBg }}
              >
                <span className="block text-white mb-2 text-sm" style={{ fontFamily: '"Archivo Black", serif' }}>
                  Change (24h)
                </span>
                <div className="flex items-center" style={{ color: get24hColors().textColor, fontFamily: '"Anton", sans-serif' }}>
                  <span className="text-2xl">
                    {parseFloat(change24h) >= 0 ? '↗' : '↘'}
                  </span>
                  <span className="text-2xl ml-2">
                    {formatPercentageChange(parseFloat(change24h))}
                  </span>
                </div>
              </div>
              <div 
                className="rounded-2xl p-4 backdrop-blur-sm" 
                style={{ backgroundColor: get7dColors().boxBg }}
              >
                <span className="block text-white mb-2 text-sm" style={{ fontFamily: '"Archivo Black", serif' }}>
                  Change (7d)
                </span>
                <div className="flex items-center" style={{ color: get7dColors().textColor, fontFamily: '"Anton", sans-serif' }}>
                  <span className="text-2xl">
                    {parseFloat(change7d) >= 0 ? '↗' : '↘'}
                  </span>
                  <span className="text-2xl ml-2">
                    {formatPercentageChange(parseFloat(change7d))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
