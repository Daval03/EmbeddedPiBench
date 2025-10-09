import { useState, useEffect } from 'react';

interface PiResult {
  digits: number;
  algorithm: string;
  timestamp: string;
}

export default function PiDigitsViewer() {
  const [result, setResult] = useState<PiResult>({
    digits: 0,
    algorithm: '',
    timestamp: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/pi-digits';

  const fetchPiDigits = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Error al obtener datos');
      }
      
      const data = await response.json();
      setResult(data);
      setError('');
    } catch (err) {
      setError('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPiDigits();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchPiDigits, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-indigo-900">
            🥧 Calculadora de Pi
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Raspberry Pi 4 - Dígitos Calculados
          </p>

          {loading && !result.digits ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchPiDigits}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-lg p-6 text-center">
                <p className="text-sm text-indigo-600 font-semibold mb-2">
                  DÍGITOS CALCULADOS
                </p>
                <p className="text-5xl font-bold text-indigo-900">
                  {result.digits.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Algoritmo</p>
                  <p className="font-semibold text-gray-900">
                    {result.algorithm || 'N/A'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Última actualización</p>
                  <p className="font-semibold text-gray-900">
                    {result.timestamp || 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={fetchPiDigits}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Actualizar Ahora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}