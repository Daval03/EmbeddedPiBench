// fetchAlgorithms.js

export async function fetchAlgorithms() {
  try {
    const response = await fetch('http://192.168.18.3:5000/api/send-top-estimations');
    const data = await response.json();

    if (!data.estimations || data.status !== 'success') {
      throw new Error('Respuesta inválida del servidor');
    }

    // Mapa de colores por algoritmo
    const colorMap = {
      chudnovsky: 'from-purple-500 to-pink-500',
      ramanujan: 'from-blue-500 to-cyan-500',
      gauss_legendre: 'from-green-500 to-emerald-500',
      bbp: 'from-orange-500 to-red-500',
    };

    // Transformamos los datos
    const algorithms = data.estimations.map(item => ({
      name: capitalize(item.algorithm.replace('_', '-')),
      digits: item.correct_digits,
      time: item.time_seconds,
      color: colorMap[item.algorithm] || 'from-gray-500 to-gray-700',
    }));

    return algorithms;
  } catch (error) {
    console.error('Error al obtener algoritmos:', error);
    return [];
  }
}

// Helper para capitalizar
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
