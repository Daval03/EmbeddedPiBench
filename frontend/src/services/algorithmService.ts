import { AlgorithmInfo } from "../components/algorithm_card";

// -------------------------------------
// Generic Fetch Helper
// -------------------------------------
async function apiGet<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    throw error;
  }
}

// -------------------------------------
// Algorithm Service
// -------------------------------------
const ALGORITHMS_URL = "http://192.168.18.3:5000/api/v1/algorithms";

export async function fetchAlgorithms(): Promise<AlgorithmInfo[]> {
  try {
    const data = await apiGet<any>(ALGORITHMS_URL);

    if (!data?.data?.algorithms || data.status !== "success") {
      throw new Error("Respuesta inválida del servidor");
    }

    return Object.entries(data.data.algorithms).map(
      ([name, algoData]: [string, any]) => ({
        name: name.replace(/_/g, " ").toUpperCase(),
        description: algoData.description || "Sin descripción",
        type: algoData.type,
        code: algoData.implementation || "// Código no disponible",
      })
    );
  } catch (error) {
    console.error("⚠️ Error al obtener algoritmos:", error);
    return [];
  }
}

// -------------------------------------
// Estimation Service
// -------------------------------------
export interface Estimation {
  id: number;
  algorithm: string;
  pi_estimate: number;
  correct_digits: number;
  iterations: number;
  time_seconds: number;
  iterations_per_second: number;
  absolute_error: number;
  type: "Probability" | "Infinite Series" | "Numerical Methods";
}

const ESTIMATIONS_URL = "http://192.168.18.3:5000/api/v1/estimations/basic";

export async function fetchEstimations(): Promise<Estimation[]> {
  try {
    const json = await apiGet<any>(ESTIMATIONS_URL);

    return json.data.estimations.map((item: any): Estimation => ({
      id: item.id,
      algorithm: item.algorithm,
      type: item.type,
      pi_estimate: item.pi_estimate,
      correct_digits: item.correct_digits,
      iterations: item.iterations,
      time_seconds: item.time_seconds,
      iterations_per_second: item.iterations_per_second,
      absolute_error: item.absolute_error,
    }));
  } catch (error) {
    console.error("⚠️ Error fetching estimations:", error);
    return [];
  }
}
