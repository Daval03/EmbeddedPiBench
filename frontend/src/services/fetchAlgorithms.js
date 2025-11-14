// fetchAlgorithms.js

export async function fetchTopPerformers() {
  try {
    const response = await fetch('http://192.168.18.3:5000/api/v1/estimations/top');
    const data = await response.json();

    if (!data.data || !data.data.estimations || data.status !== 'success') {
      throw new Error('Respuesta inválida del servidor');
    }

    // Paleta de colores fija
    const colorPalette = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-yellow-500 to-amber-500',
      'from-indigo-500 to-purple-500'
    ];

    // Transformamos los datos
    const algorithms = data.data.estimations.map((item, index) => ({
      name: capitalize(item.algorithm.replace(/_/g, ' ')),
      digits: item.correct_digits,
      time: item.time_seconds,
      color: colorPalette[index % colorPalette.length],
    }));
    return algorithms;
    
  } catch (error) {
    console.error('Error al obtener algoritmos:', error);
    return [];
  }
}

// Helper para capitalizar
function capitalize(str) {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}