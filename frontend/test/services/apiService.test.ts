// src/test/services/apiService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAlgorithms, fetchEstimations, fetchAlgorithmsInfo } from '../../src/services/apiService';

// Mock global fetch
vi.stubGlobal('fetch', vi.fn());

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // fetchAlgorithms Tests
  // ==========================================
  describe('fetchAlgorithms', () => {
    it('should fetch and transform algorithms successfully', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          algorithms: {
            leibniz_series: {
              description: 'Leibniz formula for π',
              type: 'series',
              implementation: 'def leibniz():\n  pass'
            },
            monte_carlo: {
              description: 'Monte Carlo method',
              type: 'probabilistic',
              implementation: 'def monte_carlo():\n  pass'
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithms();

      expect(fetch).toHaveBeenCalledWith('http://192.168.18.3:5000/api/v1/algorithms');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'LEIBNIZ SERIES',
        description: 'Leibniz formula for π',
        type: 'series',
        code: 'def leibniz():\n  pass'
      });
      expect(result[1]).toEqual({
        name: 'MONTE CARLO',
        description: 'Monte Carlo method',
        type: 'probabilistic',
        code: 'def monte_carlo():\n  pass'
      });
    });

    it('should handle algorithms without description or implementation', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          algorithms: {
            test_algo: {
              type: 'test'
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithms();

      expect(result[0]).toEqual({
        name: 'TEST ALGO',
        description: 'Sin descripción',
        type: 'test',
        code: '// Código no disponible'
      });
    });

    it('should return empty array when response status is not success', async () => {
      const mockResponse = {
        status: 'error',
        data: { algorithms: {} }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithms();

      expect(result).toEqual([]);
    });

    it('should return empty array when data.algorithms is missing', async () => {
      const mockResponse = {
        status: 'success',
        data: {}
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithms();

      expect(result).toEqual([]);
    });

    it('should return empty array on network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
      const result = await fetchAlgorithms();
      expect(result).toEqual([]);
    });

    it('should return empty array when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response);
      const result = await fetchAlgorithms();
      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // fetchEstimations Tests
  // ==========================================
  describe('fetchEstimations', () => {
    it('should fetch and transform estimations successfully', async () => {
      const mockResponse = {
        data: {
          estimations: [
            {
              id: 1,
              algorithm: 'leibniz',
              type: 'series',
              pi_estimate: 3.14159,
              correct_digits: 5,
              iterations: 1000000,
              time_seconds: 1.5,
              iterations_per_second: 666666.67,
              absolute_error: 0.00001
            },
            {
              id: 2,
              algorithm: 'monte_carlo',
              type: 'probabilistic',
              pi_estimate: 3.14,
              correct_digits: 2,
              iterations: 100000,
              time_seconds: 0.5,
              iterations_per_second: 200000,
              absolute_error: 0.002
            }
          ]
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchEstimations();

      expect(fetch).toHaveBeenCalledWith('http://192.168.18.3:5000/api/v1/estimations/basic');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        algorithm: 'leibniz',
        type: 'series',
        pi_estimate: 3.14159,
        correct_digits: 5,
        iterations: 1000000,
        time_seconds: 1.5,
        iterations_per_second: 666666.67,
        absolute_error: 0.00001
      });
    });

    it('should return empty array on network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchEstimations();

      expect(result).toEqual([]);
    });

    it('should return empty array when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      const result = await fetchEstimations();

      expect(result).toEqual([]);
    });

    it('should handle empty estimations array', async () => {
      const mockResponse = {
        data: {
          estimations: []
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchEstimations();

      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // fetchAlgorithmsInfo Tests
  // ==========================================
  describe('fetchAlgorithmsInfo', () => {
    it('should fetch and transform formulas successfully', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          formulas: {
            leibniz: {
              id: 'leibniz',
              name: 'Leibniz Formula',
              formula: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ...',
              description: 'Infinite series',
              full_description: 'Full description here',
              deep_explanation: 'Deep explanation here',
              convergence: 'Slow convergence',
              applications: 'Educational purposes',
              complexity: 'O(n)'
            },
            ramanujan: {
              id: 'ramanujan',
              name: 'Ramanujan Formula',
              formula: 'Complex formula',
              description: 'Fast convergence',
              full_description: 'Detailed description',
              deep_explanation: 'Mathematical proof',
              convergence: 'Very fast',
              applications: 'High precision calculations',
              complexity: 'O(log n)'
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(fetch).toHaveBeenCalledWith('http://192.168.18.3:5000/api/v1/formulas');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'leibniz',
        name: 'Leibniz Formula',
        formula: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ...',
        description: 'Full description here',
        deepExplanation: 'Deep explanation here',
        convergence: 'Slow convergence',
        applications: 'Educational purposes',
        complexity: 'O(n)'
      });
    });

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          formulas: {
            test_formula: {
              name: 'Test Formula'
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(result[0]).toEqual({
        id: 'test_formula',
        name: 'Test Formula',
        formula: '',
        description: 'Sin descripción',
        deepExplanation: 'Información detallada no disponible',
        convergence: 'No especificada',
        applications: 'No especificadas',
        complexity: 'No especificada'
      });
    });

    it('should return empty array when status is not success', async () => {
      const mockResponse = {
        status: 'error',
        data: { formulas: {} }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(result).toEqual([]);
    });

    it('should return empty array when formulas is missing', async () => {
      const mockResponse = {
        status: 'success',
        data: {}
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(result).toEqual([]);
    });

    it('should return empty array on network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchAlgorithmsInfo();

      expect(result).toEqual([]);
    });

    it('should return empty array when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(result).toEqual([]);
    });

    it('should use key as fallback for id and name', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          formulas: {
            custom_key: {
              formula: 'test formula'
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(result[0].id).toBe('custom_key');
      expect(result[0].name).toBe('CUSTOM KEY');
    });

    it('should prefer full_description over description', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          formulas: {
            test: {
              name: 'Test',
              description: 'Short description',
              full_description: 'Full detailed description'
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await fetchAlgorithmsInfo();

      expect(result[0].description).toBe('Full detailed description');
    });
  });

    // ==========================================
    // Generic Error Handling Tests
    // ==========================================
    describe('Error Handling', () => {
        it('should handle JSON parse errors', async () => {
            vi.mocked(fetch).mockResolvedValueOnce({ok: true,json: async () => {throw new Error('Invalid JSON');}
        } as any);

        const result = await fetchAlgorithms();
        expect(result).toEqual([]);
    });
    it('should handle network timeout', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Timeout'));
        const result = await fetchEstimations();
        expect(result).toEqual([]);});
    });
});