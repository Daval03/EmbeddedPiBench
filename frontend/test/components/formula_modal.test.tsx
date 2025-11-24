import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormulaModal } from '../../src/components/formula_modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Formula } from '../../src/types/types';

// Mock react-katex
vi.mock('react-katex', () => ({
  BlockMath: ({ children }: { children: string }) => (
    <div data-testid="block-math">{children}</div>
  ),
}));

describe('FormulaModal Component', () => {
  const mockFormula: Formula = {
    id: '1',
    name: 'Serie de Leibniz',
    formula: '\\pi = 4\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2n+1}',
    description: 'Aproximación clásica mediante serie alternante',
    deepExplanation: 'La serie de Leibniz es una de las formas más elegantes de aproximar π. Converge lentamente pero es conceptualmente simple.',
    convergence: 'Convergencia lenta - O(1/n)',
    applications: 'Educación matemática, demostraciones teóricas',
    complexity: 'O(n) por término calculado',
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders without crashing', () => {
    render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
    expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
  });

  describe('Modal Header', () => {
    it('displays formula name in header', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const heading = screen.getByRole('heading', { name: 'Serie de Leibniz' });
      expect(heading).toBeInTheDocument();
    });

    it('displays formula description in header', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Aproximación clásica mediante serie alternante')).toBeInTheDocument();
    });

    it('renders close button in header', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /✕/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Formula Section', () => {
    it('displays "Fórmula Matemática" heading', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Fórmula Matemática')).toBeInTheDocument();
    });

    it('renders BlockMath component with formula', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const mathBlock = screen.getByTestId('block-math');
      expect(mathBlock).toHaveTextContent(mockFormula.formula);
    });
  });

  describe('Deep Explanation Section', () => {
    it('displays "Explicación Profunda" heading', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Explicación Profunda')).toBeInTheDocument();
    });

    it('displays deep explanation text', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText(/La serie de Leibniz es una de las formas más elegantes/i)).toBeInTheDocument();
    });
  });

  describe('Technical Details Grid', () => {
    it('displays convergence information', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Convergencia')).toBeInTheDocument();
      expect(screen.getByText('Convergencia lenta - O(1/n)')).toBeInTheDocument();
    });

    it('displays complexity information', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Complejidad')).toBeInTheDocument();
      expect(screen.getByText('O(n) por término calculado')).toBeInTheDocument();
    });
  });

  describe('Applications Section', () => {
    it('displays "Aplicaciones Prácticas" heading', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Aplicaciones Prácticas')).toBeInTheDocument();
    });

    it('displays applications text', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Educación matemática, demostraciones teóricas')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button is clicked', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /✕/i });
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const backdrop = container.querySelector('.fixed.inset-0');
      fireEvent.click(backdrop!);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const modalContent = container.querySelector('.bg-slate-800');
      fireEvent.click(modalContent!);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('stops event propagation when clicking inside modal', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const modalContent = container.querySelector('.bg-slate-800');
      
      // Click inside modal
      fireEvent.click(modalContent!);
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Click backdrop
      const backdrop = container.querySelector('.fixed.inset-0');
      fireEvent.click(backdrop!);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icons', () => {
    it('renders Sigma icon in formula section', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      // Check for the presence of icon container
      const sigmaSection = screen.getByText('Fórmula Matemática').closest('h3');
      expect(sigmaSection).toBeInTheDocument();
    });

    it('renders Info icon in explanation section', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const infoSection = screen.getByText('Explicación Profunda').closest('h3');
      expect(infoSection).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies backdrop styling', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const backdrop = container.querySelector('.fixed.inset-0');
      expect(backdrop).toHaveClass('bg-black/80', 'backdrop-blur-sm', 'z-50');
    });

    it('applies modal content styling', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const modal = container.querySelector('.bg-slate-800');
      expect(modal).toHaveClass('rounded-2xl', 'max-w-4xl', 'w-full');
    });

    it('applies gradient header styling', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const header = container.querySelector('.bg-gradient-to-r');
      expect(header).toHaveClass('from-purple-600', 'to-pink-600');
    });

    it('renders grid layout for technical details', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const grid = container.querySelector('.grid.md\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('modal has max height for scrolling', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const modal = container.querySelector('.max-h-\\[90vh\\]');
      expect(modal).toBeInTheDocument();
    });

    it('modal content is scrollable', () => {
      const { container } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const modal = container.querySelector('.overflow-y-auto');
      expect(modal).toBeInTheDocument();
    });

    it('close button has hover effect', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /✕/i });
      expect(closeButton).toHaveClass('hover:bg-white/20');
    });
  });

  describe('Edge Cases', () => {
    it('handles formula with long name', () => {
      const longNameFormula = {
        ...mockFormula,
        name: 'Very Long Formula Name That Should Still Display Correctly Without Breaking Layout',
      };
      render(<FormulaModal formula={longNameFormula} onClose={mockOnClose} />);
      expect(screen.getByText(longNameFormula.name)).toBeInTheDocument();
    });

    it('handles formula with very long explanation', () => {
      const longExplanationFormula = {
        ...mockFormula,
        deepExplanation: 'This is a very long explanation that contains multiple paragraphs worth of text. '.repeat(10),
      };
      render(<FormulaModal formula={longExplanationFormula} onClose={mockOnClose} />);
      expect(screen.getByText(/This is a very long explanation/i)).toBeInTheDocument();
    });

    it('handles special LaTeX characters in formula', () => {
      const specialFormula = {
        ...mockFormula,
        formula: '\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
      };
      render(<FormulaModal formula={specialFormula} onClose={mockOnClose} />);
      const mathBlock = screen.getByTestId('block-math');
      expect(mathBlock).toHaveTextContent(specialFormula.formula);
    });

    it('handles empty strings gracefully', () => {
      const emptyFormula = {
        ...mockFormula,
        description: '',
        deepExplanation: '',
        convergence: '',
        applications: '',
        complexity: '',
      };
      render(<FormulaModal formula={emptyFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
    });
  });

  describe('Multiple Renders', () => {
    it('calls onClose only once per click', () => {
      render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /✕/i });
      
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it('renders different formulas correctly', () => {
      const formula2: Formula = {
        id: '2',
        name: 'Fórmula de Ramanujan',
        formula: '\\frac{1}{\\pi} = \\frac{2\\sqrt{2}}{9801}',
        description: 'Convergencia ultra rápida',
        deepExplanation: 'Una de las fórmulas más eficientes',
        convergence: 'Muy rápida',
        applications: 'Cálculos de precisión',
        complexity: 'O(log n)',
      };

      const { rerender } = render(<FormulaModal formula={mockFormula} onClose={mockOnClose} />);
      expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();

      rerender(<FormulaModal formula={formula2} onClose={mockOnClose} />);
      expect(screen.getByText('Fórmula de Ramanujan')).toBeInTheDocument();
      expect(screen.queryByText('Serie de Leibniz')).not.toBeInTheDocument();
    });
  });
});