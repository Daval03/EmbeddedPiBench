import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fetchAlgorithms, fetchEstimations, fetchAlgorithmsInfo } from '../../src/services/apiService'

describe('algorithmService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchAlgorithms', () => {
    const mockAlgorithmsResponse = {
      status: 'success',
      data: {
        algorithms: {
          binary_search: {
            description: 'A search algorithm',
            type: 'Search',
            implementation: 'int binarySearch() { }'
          },
          quick_sort: {
            description: 'A sorting algorithm',
            type: 'Sort',
            implementation: 'void quickSort() { }'
          }
        }
      }
    }

    it('fetches and transforms algorithms successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlgorithmsResponse
      })

      const result = await fetchAlgorithms()

      expect(fetch).toHaveBeenCalledWith('http://192.168.18.3:5000/api/v1/algorithms')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        name: 'BINARY SEARCH',
        description: 'A search algorithm',
        type: 'Search',
        code: 'int binarySearch() { }'
      })
    })

    it('handles missing description with default value', async () => {
      const responseWithoutDescription = {
        status: 'success',
        data: {
          algorithms: {
            test_algo: {
              type: 'Test',
              implementation: 'code here'
            }
          }
        }
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithoutDescription
      })

      const result = await fetchAlgorithms()

      expect(result[0].description).toBe('Sin descripción')
    })

    it('handles missing implementation with default value', async () => {
      const responseWithoutImplementation = {
        status: 'success',
        data: {
          algorithms: {
            test_algo: {
              description: 'Test',
              type: 'Test'
            }
          }
        }
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithoutImplementation
      })

      const result = await fetchAlgorithms()

      expect(result[0].code).toBe('// Código no disponible')
    })

    it('returns empty array on invalid response status', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'error' })
      })

      const result = await fetchAlgorithms()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })

    it('returns empty array on network error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchAlgorithms()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })

    it('returns empty array when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const result = await fetchAlgorithms()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('fetchEstimations', () => {
    const mockEstimationsResponse = {
      data: {
        estimations: [
          {
            id: 1,
            algorithm: 'Monte Carlo',
            type: 'statistical',
            pi_estimate: 3.14159,
            correct_digits: 5,
            iterations: 1000000,
            time_seconds: 2.5,
            iterations_per_second: 400000,
            absolute_error: 0.00001
          }
        ]
      }
    }

    it('fetches and transforms estimations successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockEstimationsResponse
      })

      const result = await fetchEstimations()

      expect(fetch).toHaveBeenCalledWith('http://192.168.18.3:5000/api/v1/estimations/basic')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockEstimationsResponse.data.estimations[0])
    })

    it('returns empty array on fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchEstimations()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('fetchAlgorithmsInfo', () => {
    const mockFormulasResponse = {
      status: 'success',
      data: {
        formulas: {
          leibniz_formula: {
            id: 'leibniz',
            name: 'Leibniz Formula',
            formula: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ...',
            full_description: 'A series formula for π',
            deep_explanation: 'Detailed explanation here',
            convergence: 'Slow',
            applications: 'Educational purposes',
            complexity: 'O(n)'
          }
        }
      }
    }

    it('fetches and transforms formulas successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockFormulasResponse
      })

      const result = await fetchAlgorithmsInfo()

      expect(fetch).toHaveBeenCalledWith('http://192.168.18.3:5000/api/v1/formulas')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Leibniz Formula')
    })

    it('uses fallback values when fields are missing', async () => {
      const minimalResponse = {
        status: 'success',
        data: {
          formulas: {
            minimal_formula: {}
          }
        }
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => minimalResponse
      })

      const result = await fetchAlgorithmsInfo()

      expect(result[0]).toEqual({
        id: 'minimal_formula',
        name: 'MINIMAL FORMULA',
        formula: '',
        description: 'Sin descripción',
        deepExplanation: 'Información detallada no disponible',
        convergence: 'No especificada',
        applications: 'No especificadas',
        complexity: 'No especificada'
      })
    })

    it('returns empty array on network error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchAlgorithmsInfo()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })
})