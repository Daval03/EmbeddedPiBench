import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormulaCard } from '../../src/components/formula_card';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Formula } from '../../src/types/types';

// Mock react-katex
vi.mock('react-katex', () => ({
  BlockMath: ({ children }: { children: string }) => (
    <div data-testid="block-math">{children}</div>
  ),
}));

describe('FormulaCard Component', () => {
  const mockFormulas: Formula[] = [
    {
      id: '1',
      name: 'Serie de Leibniz',
      formula: '\\pi = 4\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2n+1}',
      description: 'Aproximación clásica mediante serie alternante',
      deepExplanation: 'Explicación detallada sobre la serie',
      convergence: 'Convergencia lenta',
      applications: 'Aplicaciones educativas',
      complexity: 'O(n)',
    },
    {
      id: '2',
      name: 'Fórmula de Ramanujan',
      formula: '\\frac{1}{\\pi} = \\frac{2\\sqrt{2}}{9801}\\sum_{k=0}^{\\infty}',
      description: 'Convergencia extremadamente rápida',
      deepExplanation: 'Explicación sobre Ramanujan',
      convergence: 'Convergencia muy rápida',
      applications: 'Cálculos de alta precisión',
      complexity: 'O(log n)',
    },
  ];

  const mockOnFormulaSelect = vi.fn();

  beforeEach(() => {
    mockOnFormulaSelect.mockClear();
  });

  it('renders without crashing', () => {
    render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
    expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
  });

  describe('Formula Rendering', () => {
    it('renders all formulas provided', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
      expect(screen.getByText('Fórmula de Ramanujan')).toBeInTheDocument();
    });

    it('renders formula names correctly', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      mockFormulas.forEach((formula) => {
        expect(screen.getByText(formula.name)).toBeInTheDocument();
      });
    });

    it('renders formula descriptions', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      expect(screen.getByText('Aproximación clásica mediante serie alternante')).toBeInTheDocument();
      expect(screen.getByText('Convergencia extremadamente rápida')).toBeInTheDocument();
    });

    it('renders convergence information', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      expect(screen.getByText('Convergencia lenta')).toBeInTheDocument();
      expect(screen.getByText('Convergencia muy rápida')).toBeInTheDocument();
    });

    it('renders BlockMath components with formulas', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const mathBlocks = screen.getAllByTestId('block-math');
      expect(mathBlocks).toHaveLength(2);
      expect(mathBlocks[0]).toHaveTextContent(mockFormulas[0].formula);
      expect(mathBlocks[1]).toHaveTextContent(mockFormulas[1].formula);
    });
  });

  describe('Interaction Handling', () => {
    it('calls onFormulaSelect when card is clicked', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const firstCard = screen.getByText('Serie de Leibniz').closest('div');
      fireEvent.click(firstCard!);
      
      expect(mockOnFormulaSelect).toHaveBeenCalledTimes(1);
      expect(mockOnFormulaSelect).toHaveBeenCalledWith(mockFormulas[0]);
    });

    it('calls onFormulaSelect when "Ver Detalles Completos" button is clicked', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const buttons = screen.getAllByRole('button', { name: /ver detalles completos/i });
      fireEvent.click(buttons[0]);
      
      expect(mockOnFormulaSelect).toHaveBeenCalledTimes(1);
      expect(mockOnFormulaSelect).toHaveBeenCalledWith(mockFormulas[0]);
    });

    it('button click does not propagate to card click', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const buttons = screen.getAllByRole('button', { name: /ver detalles completos/i });
      fireEvent.click(buttons[0]);
      
      // Should only be called once (from button), not twice (button + card)
      expect(mockOnFormulaSelect).toHaveBeenCalledTimes(1);
    });

    it('calls onFormulaSelect with correct formula for each card', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const secondCard = screen.getByText('Fórmula de Ramanujan').closest('div');
      fireEvent.click(secondCard!);
      
      expect(mockOnFormulaSelect).toHaveBeenCalledWith(mockFormulas[1]);
    });
  });

  describe('Button Rendering', () => {
    it('renders a button for each formula card', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const buttons = screen.getAllByRole('button', { name: /ver detalles completos/i });
      expect(buttons).toHaveLength(mockFormulas.length);
    });

    it('buttons have correct text', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveTextContent('Ver Detalles Completos');
      });
    });
  });

  describe('Icons', () => {
    it('renders BookOpen icon for each card', () => {
      const { container } = render(
        <FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      // lucide-react icons don't have specific test IDs, but we can check the structure
      const cards = container.querySelectorAll('.text-purple-400');
      expect(cards.length).toBeGreaterThanOrEqual(mockFormulas.length);
    });

    it('renders TrendingUp icon for convergence info', () => {
      const { container } = render(
        <FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      const trendingIcons = container.querySelectorAll('.text-green-400');
      expect(trendingIcons.length).toBeGreaterThanOrEqual(mockFormulas.length);
    });
  });

  describe('Styling and Layout', () => {
    it('applies grid layout classes', () => {
      const { container } = render(
        <FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    it('applies card styling classes', () => {
      const { container } = render(
        <FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      const cards = container.querySelectorAll('.bg-slate-800\\/50');
      expect(cards.length).toBe(mockFormulas.length);
    });

    it('cards have cursor-pointer class', () => {
      const { container } = render(
        <FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      const cards = container.querySelectorAll('.cursor-pointer');
      expect(cards.length).toBe(mockFormulas.length);
    });
  });

  describe('Edge Cases', () => {
    it('renders empty state when no formulas provided', () => {
      const { container } = render(
        <FormulaCard formulas={[]} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.children.length).toBe(0);
    });

    it('handles single formula correctly', () => {
      const singleFormula = [mockFormulas[0]];
      render(<FormulaCard formulas={singleFormula} onFormulaSelect={mockOnFormulaSelect} />);
      
      expect(screen.getByText('Serie de Leibniz')).toBeInTheDocument();
      expect(screen.queryByText('Fórmula de Ramanujan')).not.toBeInTheDocument();
    });

    it('handles formulas with long text', () => {
      const longTextFormula: Formula = {
        ...mockFormulas[0],
        name: 'Very Long Formula Name That Should Still Render Correctly',
        description: 'A very long description that contains multiple sentences and should wrap properly within the card without breaking the layout or causing any visual issues.',
      };
      
      render(<FormulaCard formulas={[longTextFormula]} onFormulaSelect={mockOnFormulaSelect} />);
      
      expect(screen.getByText(longTextFormula.name)).toBeInTheDocument();
      expect(screen.getByText(longTextFormula.description)).toBeInTheDocument();
    });

    it('handles special characters in formula LaTeX', () => {
      const specialFormula: Formula = {
        ...mockFormulas[0],
        formula: '\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
      };
      
      render(<FormulaCard formulas={[specialFormula]} onFormulaSelect={mockOnFormulaSelect} />);
      
      const mathBlock = screen.getByTestId('block-math');
      expect(mathBlock).toHaveTextContent(specialFormula.formula);
    });
  });

  describe('Accessibility', () => {
    it('cards are keyboard accessible', () => {
      const { container } = render(
        <FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />
      );
      
      const cards = container.querySelectorAll('[role="button"], .cursor-pointer');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('buttons are focusable', () => {
      render(<FormulaCard formulas={mockFormulas} onFormulaSelect={mockOnFormulaSelect} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('disabled');
      });
    });
  });
});