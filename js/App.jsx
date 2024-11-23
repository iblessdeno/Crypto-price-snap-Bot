import { useEffect, useState } from 'react'
import CryptoCard from './components/CryptoCard'
import CryptoGrid from './components/CryptoGrid'
import GlobalMetrics from './components/GlobalMetrics'

export default function App() {
  const [cryptoData, setCryptoData] = useState({
    price: '$0.00',
    change24h: '0.00',
    change7d: '0.00'
  });

  const [topCryptos, setTopCryptos] = useState([]);
  const [view, setView] = useState('single'); // 'single' or 'grid'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol');
    const pathname = window.location.pathname;

    if (pathname === '/top') {
      setView('grid');
      fetchTopCryptos();
    } else if (symbol) {
      setView('single');
      fetchCryptoData(symbol);
    }
  }, [window.location.search, window.location.pathname]);

  const fetchTopCryptos = async () => {
    try {
      const response = await fetch('/api/top');
      const data = await response.json();
      
      if (data.error) {
        console.error('Error fetching top cryptos:', data.error);
        return;
      }

      setTopCryptos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCryptoData = async (symbol) => {
    try {
      const response = await fetch(`/api/crypto?symbol=${symbol}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Error fetching crypto data:', data.error);
        return;
      }

      setCryptoData({
        price: `$${Number(data.price).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
        })}`,
        change24h: data.percent_change_24h.toFixed(2),
        change7d: data.percent_change_7d.toFixed(2)
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8">
      {view === 'single' ? (
        <div className="w-full max-w-4xl mx-auto">
          <CryptoCard {...cryptoData} />
        </div>
      ) : (
        <>
          <GlobalMetrics />
          <CryptoGrid cryptos={topCryptos} />
        </>
      )}
    </div>
  );
}
