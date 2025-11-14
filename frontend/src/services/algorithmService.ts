import {AlgorithmInfo} from '../componets/algorithm_card';

export async function fetchAlgorithms(): Promise<AlgorithmInfo[]> {
  try {
    const response = await fetch('http://192.168.18.3:5000/api/v1/algorithms');
    const data = await response.json();

    if (!data.data || !data.data.algorithms || data.status !== 'success') {
      throw new Error('Respuesta inválida del servidor');
    }

    // Transformar los datos del API al formato AlgorithmInfo
    const algorithms: AlgorithmInfo[] = Object.entries(data.data.algorithms).map(([name, algoData]: [string, any]) => ({
      name: name.replace(/_/g, ' ').toUpperCase(),
      description: algoData.description || 'Sin descripción',
      type: algoData.type,
      code: algoData.implementation || '// Código no disponible'
    }));

    return algorithms;
  } catch (error) {
    console.error('Error al obtener algoritmos:', error);
    return [];
  }
}