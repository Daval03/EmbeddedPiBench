import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../../src/components/header';
import { describe, expect, it } from 'vitest';
// Helper function to render with router
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  it('renders without crashing', () => {
    renderWithRouter();
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  describe('Branding', () => {
    it('displays the Pi Calculator logo and text', () => {
      renderWithRouter();
      
      expect(screen.getByText('π')).toBeInTheDocument();
      expect(screen.getByText('Pi Calculator')).toBeInTheDocument();
    });

    it('logo links to home page', () => {
      renderWithRouter();
      
      const logoLink = screen.getByRole('link', { name: /π pi calculator/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Navigation Links', () => {
    it('renders all navigation links', () => {
      renderWithRouter();
      
      expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /algoritmos/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /comparativa/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /matemáticas/i })).toBeInTheDocument();
    });

    it('all links have correct href attributes', () => {
      renderWithRouter();
      
      expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /algoritmos/i })).toHaveAttribute('href', '/algorithms');
      expect(screen.getByRole('link', { name: /comparativa/i })).toHaveAttribute('href', '/compare');
      expect(screen.getByRole('link', { name: /matemáticas/i })).toHaveAttribute('href', '/math');
    });
  });

  describe('Active State Styling', () => {
    it('applies active styles to Home link when on home route', () => {
      renderWithRouter('/');
      
      const homeLink = screen.getByRole('link', { name: /^home$/i });
      expect(homeLink).toHaveClass('text-white', 'font-medium');
      expect(homeLink).not.toHaveClass('text-slate-400');
    });

    it('applies active styles to Home link when on /home route', () => {
      renderWithRouter('/home');
      
      const homeLink = screen.getByRole('link', { name: /^home$/i });
      expect(homeLink).toHaveClass('text-white', 'font-medium');
    });

    it('applies active styles to Algorithms link when on /algorithms route', () => {
      renderWithRouter('/algorithms');
      
      const algorithmsLink = screen.getByRole('link', { name: /algoritmos/i });
      expect(algorithmsLink).toHaveClass('text-white', 'font-medium');
      expect(algorithmsLink).not.toHaveClass('text-slate-400');
    });

    it('applies active styles to Compare link when on /compare route', () => {
      renderWithRouter('/compare');
      
      const compareLink = screen.getByRole('link', { name: /comparativa/i });
      expect(compareLink).toHaveClass('text-white', 'font-medium');
    });

    it('applies active styles to Math link when on /math route', () => {
      renderWithRouter('/math');
      
      const mathLink = screen.getByRole('link', { name: /matemáticas/i });
      expect(mathLink).toHaveClass('text-white', 'font-medium');
    });

    it('applies inactive styles to non-active links', () => {
      renderWithRouter('/algorithms');
      
      const homeLink = screen.getByRole('link', { name: /^home$/i });
      const compareLink = screen.getByRole('link', { name: /comparativa/i });
      const mathLink = screen.getByRole('link', { name: /matemáticas/i });
      
      expect(homeLink).toHaveClass('text-slate-400', 'hover:text-white');
      expect(compareLink).toHaveClass('text-slate-400', 'hover:text-white');
      expect(mathLink).toHaveClass('text-slate-400', 'hover:text-white');
    });
  });

  describe('Styling and Structure', () => {
    it('applies sticky header classes', () => {
      renderWithRouter();
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('has backdrop blur and border styles', () => {
      renderWithRouter();
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('backdrop-blur-sm', 'border-b', 'border-slate-700');
    });

    it('contains navigation element', () => {
      renderWithRouter();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic header element', () => {
      renderWithRouter();
      
      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
    });

    it('uses semantic nav element', () => {
      renderWithRouter();
      
      const nav = screen.getByRole('navigation');
      expect(nav.tagName).toBe('NAV');
    });

    it('all links have accessible text', () => {
      renderWithRouter();
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveTextContent(/.+/);
      });
    });
  });

  describe('isActive helper function', () => {
    it('correctly identifies active route', () => {
      renderWithRouter('/algorithms');
      
      const algorithmsLink = screen.getByRole('link', { name: /algoritmos/i });
      const homeLink = screen.getByRole('link', { name: /^home$/i });
      
      expect(algorithmsLink).toHaveClass('text-white', 'font-medium');
      expect(homeLink).toHaveClass('text-slate-400');
    });

    it('handles root path correctly', () => {
      renderWithRouter('/');
      
      const homeLink = screen.getByRole('link', { name: /^home$/i });
      expect(homeLink).toHaveClass('text-white', 'font-medium');
    });
  });

  describe('Edge Cases', () => {
    it('handles unknown routes gracefully', () => {
      renderWithRouter('/unknown-route');
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      // All nav links should be inactive
      const homeLink = screen.getByRole('link', { name: /^home$/i });
      expect(homeLink).toHaveClass('text-slate-400');
    });

    it('renders correctly when wrapped in BrowserRouter', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Pi Calculator')).toBeInTheDocument();
    });
  });
});