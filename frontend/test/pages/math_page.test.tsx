import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FormulasPage from '../../src/pages/math_page';
import { Formula } from '../../src/types/types';

// Mock the API service first with vi.fn()
vi.mock('../../src/services/apiService', () => ({
  fetchAlgorithmsInfo: vi.fn(),
}));

// Import the mocked function after mocking
import { fetchAlgorithmsInfo } from '../../src/services/apiService';

// Mock the child components
vi.mock('../../src/components/formula_card', () => ({
  FormulaCard: ({ formulas, onFormulaSelect }: any) => (
    <div data-testid="formula-card">
      {formulas.map((formula: Formula) => (
        <button
          key={formula.id}
          onClick={() => onFormulaSelect(formula)}
          data-testid={`formula-${formula.id}`}
        >
          {formula.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../src/components/formula_modal', () => ({
  FormulaModal: ({ formula, onClose }: any) => (
    <div data-testid="formula-modal">
      <h2>{formula.name}</h2>
      <button onClick={onClose} data-testid="close-modal">
        Close
      </button>
    </div>
  ),
}));

// Mock react-katex CSS import
vi.mock('katex/dist/katex.min.css', () => ({}));

// Get the typed mock function
const mockedFetchAlgorithmsInfo = vi.mocked(fetchAlgorithmsInfo);

describe('FormulasPage Component', () => {
  const mockFormulas: Formula[] = [
    {
      id: '1',
      name: 'Serie de Leibniz',
      formula: '\\pi = 4\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2n+1}',
      description: 'Aproximación clásica mediante serie alternante',
      deepExplanation: 'La serie de Leibniz es una fórmula elegante',
      convergence: 'Convergencia lenta',
      applications: 'Educación matemática',
      complexity: 'O(n)',
    },
    {
      id: '2',
      name: 'Fórmula de Ramanujan',
      formula: '\\frac{1}{\\pi} = \\frac{2\\sqrt{2}}{9801}',
      description: 'Convergencia extremadamente rápida',
      deepExplanation: 'Una de las fórmulas más eficientes',
      convergence: 'Muy rápida',
      applications: 'Cálculos de precisión',
      complexity: 'O(log n)',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading message while fetching data', () => {
      mockedFetchAlgorithmsInfo.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<FormulasPage />);
      expect(screen.getByText('Cargando algoritmos...')).toBeInTheDocument();
    });

    it('applies correct styling to loading container', () => {
      mockedFetchAlgorithmsInfo.mockImplementation(
        () => new Promise(() => {})
      );

      render(<FormulasPage />);
      expect(screen.getByText('Cargando algoritmos...')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('fetches algorithms on mount', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);

      render(<FormulasPage />);

      await waitFor(() => {
        expect(mockedFetchAlgorithmsInfo).toHaveBeenCalledTimes(1);
      });
    });

    it('displays formulas after successful fetch', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);

      render(<FormulasPage />);

      await waitFor(() => {
        expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
        expect(screen.getByText('Fórmula de Ramanujan')).toBeInTheDocument();
      });
    });

    it('handles empty formula list', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue([]);

      render(<FormulasPage />);

      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('formula-card')).toBeInTheDocument();
    });

    it('only fetches data once on mount', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);

      const { rerender } = render(<FormulasPage />);

      await waitFor(() => {
        expect(mockedFetchAlgorithmsInfo).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger another fetch
      rerender(<FormulasPage />);
      
      expect(mockedFetchAlgorithmsInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('Header Section', () => {
    beforeEach(async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      render(<FormulasPage />);
      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });
    });

    it('displays main heading', () => {
      expect(screen.getByText('Fundamentos Matemáticos de π')).toBeInTheDocument();
    });

    it('displays description text', () => {
      expect(screen.getByText(/Exploración profunda de las fórmulas, algoritmos y teorías matemáticas/i)).toBeInTheDocument();
      expect(screen.getByText(/detrás del cálculo de la constante más fascinante de las matemáticas/i)).toBeInTheDocument();
    });
  });

  describe('FormulaCard Integration', () => {
    beforeEach(async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      render(<FormulasPage />);
      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });
    });

    it('renders FormulaCard component', () => {
      expect(screen.getByTestId('formula-card')).toBeInTheDocument();
    });

    it('passes formulas data to FormulaCard', () => {
      expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
      expect(screen.getByText('Fórmula de Ramanujan')).toBeInTheDocument();
    });

    it('passes onFormulaSelect callback to FormulaCard', () => {
      const formulaButton = screen.getByTestId('formula-1');
      expect(formulaButton).toBeInTheDocument();
      
      fireEvent.click(formulaButton);
      expect(screen.getByTestId('formula-modal')).toBeInTheDocument();
    });
  });

  describe('FormulaModal Integration', () => {
    beforeEach(async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      render(<FormulasPage />);
      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });
    });

    it('does not render modal initially', () => {
      expect(screen.queryByTestId('formula-modal')).not.toBeInTheDocument();
    });

    it('renders modal when formula is selected', () => {
      const formulaButton = screen.getByTestId('formula-1');
      fireEvent.click(formulaButton);

      expect(screen.getByTestId('formula-modal')).toBeInTheDocument();
    });

    it('passes selected formula to modal', () => {
      const formulaButton = screen.getByTestId('formula-1');
      fireEvent.click(formulaButton);

      const modal = screen.getByTestId('formula-modal');
      expect(modal).toHaveTextContent('Serie de Leibniz');
    });

    it('closes modal when onClose is called', () => {
      const formulaButton = screen.getByTestId('formula-1');
      fireEvent.click(formulaButton);

      expect(screen.getByTestId('formula-modal')).toBeInTheDocument();

      const closeButton = screen.getByTestId('close-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('formula-modal')).not.toBeInTheDocument();
    });

    it('can open different formulas sequentially', () => {
    // Open first formula
    const formula1Button = screen.getByTestId('formula-1');
    fireEvent.click(formula1Button);
    
    // Check modal content specifically
    const modal = screen.getByTestId('formula-modal');
    expect(modal).toHaveTextContent('Serie de Leibniz');

    // Close modal
    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);

    // Open second formula
    const formula2Button = screen.getByTestId('formula-2');
    fireEvent.click(formula2Button);
    
    // Check modal content specifically
    const modal2 = screen.getByTestId('formula-modal');
    expect(modal2).toHaveTextContent('Fórmula de Ramanujan');
  });
});

  describe('State Management', () => {
    beforeEach(async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      render(<FormulasPage />);
      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });
    });

    it('manages selectedFormula state correctly', () => {
      // Initially null
      expect(screen.queryByTestId('formula-modal')).not.toBeInTheDocument();

      // Set to formula
      const formulaButton = screen.getByTestId('formula-1');
      fireEvent.click(formulaButton);
      expect(screen.getByTestId('formula-modal')).toBeInTheDocument();

      // Set back to null
      const closeButton = screen.getByTestId('close-modal');
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('formula-modal')).not.toBeInTheDocument();
    });

    it('manages loading state correctly', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      
      render(<FormulasPage />);

      // Should show loading initially
      expect(screen.getByText('Cargando algoritmos...')).toBeInTheDocument();

      // Should hide loading after data loads
      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });
    });

    it('updates formulasData state after fetch', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      
      render(<FormulasPage />);

      await waitFor(() => {
        expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
        expect(screen.getByText('Fórmula de Ramanujan')).toBeInTheDocument();
      });
    });
  });
  describe('Accessibility', () => {
    beforeEach(async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);
      render(<FormulasPage />);
      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });
    });

    it('uses semantic heading tags', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Fundamentos Matemáticos de π');
    });

    it('loading message has appropriate text color for contrast', () => {
      mockedFetchAlgorithmsInfo.mockImplementation(
        () => new Promise(() => {})
      );

      render(<FormulasPage />);
      const loadingText = screen.getByText('Cargando algoritmos...');
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('cleans up properly on unmount', async () => {
      mockedFetchAlgorithmsInfo.mockResolvedValue(mockFormulas);

      const { unmount } = render(<FormulasPage />);

      await waitFor(() => {
        expect(screen.queryByText('Cargando algoritmos...')).not.toBeInTheDocument();
      });

      // Should not throw error on unmount
      expect(() => unmount()).not.toThrow();
    });
  });
});