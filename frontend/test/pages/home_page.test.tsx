import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import PiHomepage from '../../src/pages/home_page';

// Helper function to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('PiHomepage Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<PiHomepage />);
    expect(screen.getByText(/Calculando/i)).toBeInTheDocument();
  });

  describe('Hero Section', () => {
    it('displays the main heading with π symbol', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/Calculando/i)).toBeInTheDocument();
      expect(screen.getByText('π')).toBeInTheDocument();
      expect(screen.getByText(/en Tiempo Real/i)).toBeInTheDocument();
    });

    it('displays the hero description', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/Comparación de 12 algoritmos ejecutándose en una Raspberry Pi 4/i)).toBeInTheDocument();
      expect(screen.getByText(/Desde métodos probabilísticos hasta series infinitas/i)).toBeInTheDocument();
    });
  });

  describe('Algorithm Categories - What is π', () => {
    it('displays "¿Qué es π?" section heading', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText('¿Qué es π?')).toBeInTheDocument();
    });

    it('displays π definition', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/La constante matemática que relaciona la circunferencia de un círculo con su diámetro/i)).toBeInTheDocument();
      expect(screen.getByText(/Es un número irracional y trascendente con infinitos dígitos no periódicos/i)).toBeInTheDocument();
    });

    it('displays π approximation value', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/3.14159265358979323846/i)).toBeInTheDocument();
    });
  });

  describe('Algorithm Categories - Calculation Methods', () => {
    it('displays "Métodos de Cálculo" section heading', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText('Métodos de Cálculo')).toBeInTheDocument();
    });

    it('displays calculation methods description', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/Desde aproximaciones geométricas hasta series infinitas y algoritmos modernos/i)).toBeInTheDocument();
      expect(screen.getByText(/Cada método tiene diferente eficiencia y precisión/i)).toBeInTheDocument();
    });

    it('displays method types', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/Probabilísticos • Series • Algoritmos iterativos/i)).toBeInTheDocument();
    });
  });

  describe('Algorithm Categories - Technical Limitations', () => {
    it('displays "Limitaciones Técnicas" section heading', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText('Limitaciones Técnicas')).toBeInTheDocument();
    });

    it('displays technical limitations description', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/En este sistema \(Raspberry Pi 4 con C\/long double\) la precisión máxima es de 33 dígitos/i)).toBeInTheDocument();
      expect(screen.getByText(/Los algoritmos modernos alcanzan este límite rápidamente/i)).toBeInTheDocument();
    });

    it('displays precision specifications', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/Máx. 33 dígitos \| Precisión de hardware/i)).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders Target icon for π definition', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const targetSection = screen.getByText('¿Qué es π?').closest('div');
      expect(targetSection).toBeInTheDocument();
    });

    it('renders Zap icon for calculation methods', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const zapSection = screen.getByText('Métodos de Cálculo').closest('div');
      expect(zapSection).toBeInTheDocument();
    });

    it('renders Activity icon for technical limitations', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const activitySection = screen.getByText('Limitaciones Técnicas').closest('div');
      expect(activitySection).toBeInTheDocument();
    });

    it('renders Code icon in CTA section', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const codeSection = screen.getByText('Explora los Algoritmos').closest('div');
      expect(codeSection).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('displays CTA heading', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText('Explora los Algoritmos')).toBeInTheDocument();
    });

    it('displays CTA description', () => {
      renderWithRouter(<PiHomepage />);
      expect(screen.getByText(/Descubre cómo funcionan estos algoritmos, compara su rendimiento y explora las matemáticas detrás del cálculo de π/i)).toBeInTheDocument();
    });

    it('renders "Ver Algoritmos" link', () => {
      renderWithRouter(<PiHomepage />);
      const algorithmsLink = screen.getByRole('link', { name: /ver algoritmos/i });
      expect(algorithmsLink).toBeInTheDocument();
      expect(algorithmsLink).toHaveAttribute('href', '/algorithms');
    });

    it('renders "Ver Comparativa" link', () => {
      renderWithRouter(<PiHomepage />);
      const compareLink = screen.getByRole('link', { name: /ver comparativa/i });
      expect(compareLink).toBeInTheDocument();
      expect(compareLink).toHaveAttribute('href', '/compare');
    });
  });

  describe('Navigation Links', () => {
    it('both navigation links have correct href attributes', () => {
      renderWithRouter(<PiHomepage />);
      
      const algorithmsLink = screen.getByRole('link', { name: /ver algoritmos/i });
      const compareLink = screen.getByRole('link', { name: /ver comparativa/i });
      
      expect(algorithmsLink).toHaveAttribute('href', '/algorithms');
      expect(compareLink).toHaveAttribute('href', '/compare');
    });

    it('navigation links have no-underline class', () => {
      renderWithRouter(<PiHomepage />);
      
      const algorithmsLink = screen.getByRole('link', { name: /ver algoritmos/i });
      const compareLink = screen.getByRole('link', { name: /ver comparativa/i });
      
      expect(algorithmsLink).toHaveClass('no-underline');
      expect(compareLink).toHaveClass('no-underline');
    });
  });

  describe('Styling and Layout', () => {
    it('applies gradient background to main container', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const mainDiv = container.querySelector('.bg-gradient-to-br');
      expect(mainDiv).toHaveClass('from-slate-900', 'via-slate-800', 'to-slate-900');
    });

    it('applies grid layout to algorithm categories', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const grid = container.querySelector('.grid.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('applies gradient text to π symbol', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const piSymbol = screen.getByText('π');
      expect(piSymbol).toHaveClass('bg-gradient-to-r', 'from-purple-400', 'to-pink-400', 'bg-clip-text', 'text-transparent');
    });

    it('applies gradient background to CTA section', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const ctaSection = screen.getByText('Explora los Algoritmos').closest('.bg-gradient-to-r');
      expect(ctaSection).toHaveClass('from-purple-500/20', 'to-pink-500/20');
    });

    it('applies gradient to "Ver Algoritmos" button', () => {
      renderWithRouter(<PiHomepage />);
      const algorithmsButton = screen.getByRole('link', { name: /ver algoritmos/i });
      expect(algorithmsButton).toHaveClass('bg-gradient-to-r', 'from-purple-500', 'to-pink-500');
    });
  });

  describe('Content Cards', () => {
    it('renders three algorithm category cards', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const cards = container.querySelectorAll('.grid.md\\:grid-cols-3 > div');
      expect(cards).toHaveLength(3);
    });

    it('each card has appropriate border and background colors', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      
      // First card (purple)
      const piCard = screen.getByText('¿Qué es π?').closest('div');
      expect(piCard).toHaveClass('border-purple-500/20');
      
      // Second card (blue)
      const methodsCard = screen.getByText('Métodos de Cálculo').closest('div');
      expect(methodsCard).toHaveClass('border-blue-500/20');
      
      // Third card (green)
      const limitationsCard = screen.getByText('Limitaciones Técnicas').closest('div');
      expect(limitationsCard).toHaveClass('border-green-500/20');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive text sizes to heading', () => {
      renderWithRouter(<PiHomepage />);
      const heading = screen.getByText(/Calculando/i).closest('h1');
      expect(heading).toHaveClass('text-5xl', 'md:text-6xl');
    });

    it('applies responsive flex wrap to CTA buttons', () => {
      const { container } = renderWithRouter(<PiHomepage />);
      const buttonContainer = screen.getByRole('link', { name: /ver algoritmos/i }).parentElement;
      expect(buttonContainer).toHaveClass('flex', 'gap-4', 'flex-wrap');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic heading tags', () => {
      renderWithRouter(<PiHomepage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(/Calculando/i);
      
      const h2 = screen.getByRole('heading', { level: 2, name: /explora los algoritmos/i });
      expect(h2).toBeInTheDocument();
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThanOrEqual(3);
    });

    it('all links have accessible text', () => {
      renderWithRouter(<PiHomepage />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveTextContent(/.+/);
      });
    });
  });

  describe('Router Integration', () => {
    it('renders correctly when wrapped in BrowserRouter', () => {
      render(
        <BrowserRouter>
          <PiHomepage />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/Calculando/i)).toBeInTheDocument();
    });

    it('links are properly configured as React Router Links', () => {
      renderWithRouter(<PiHomepage />);
      
      const algorithmsLink = screen.getByRole('link', { name: /ver algoritmos/i });
      const compareLink = screen.getByRole('link', { name: /ver comparativa/i });
      
      // React Router Link components should have href attribute
      expect(algorithmsLink.getAttribute('href')).toBe('/algorithms');
      expect(compareLink.getAttribute('href')).toBe('/compare');
    });
  });

  describe('Text Content Verification', () => {
    it('contains all key informational text', () => {
      renderWithRouter(<PiHomepage />);
      
      // Verify all main text sections are present
      expect(screen.getByText(/número irracional y trascendente/i)).toBeInTheDocument();
      expect(screen.getByText(/aproximaciones geométricas/i)).toBeInTheDocument();
      expect(screen.getByText(/Raspberry Pi 4 con C\/long double/i)).toBeInTheDocument();
    });

    it('displays all technical specifications', () => {
      renderWithRouter(<PiHomepage />);
      
      expect(screen.getByText(/Aproximación: 3.14159265358979323846/i)).toBeInTheDocument();
      expect(screen.getByText(/Máx. 33 dígitos/i)).toBeInTheDocument();
    });
  });
});