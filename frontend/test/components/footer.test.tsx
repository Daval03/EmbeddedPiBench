import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../src/components/footer';
import { describe, expect, it } from 'vitest';

describe('Footer Component', () => {
  const defaultProps = {
    companyName: 'Test Company',
    year: 2024,
  };

  it('renders without crashing', () => {
    render(<Footer {...defaultProps} />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the company name and year in copyright text', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText(/© 2024 Test Company/i)).toBeInTheDocument();
  });

  it('displays the Pi Calculator branding', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText('Pi Calculator')).toBeInTheDocument();
    expect(screen.getByText('π')).toBeInTheDocument();
  });

  it('displays the description text', () => {
    render(<Footer {...defaultProps} />);
    expect(
      screen.getByText(/Comparación de algoritmos para el cálculo de π/i)
    ).toBeInTheDocument();
  });

  describe('Quick Links Section', () => {
    it('renders all navigation links', () => {
      render(<Footer {...defaultProps} />);
      
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /algoritmos/i })).toHaveAttribute('href', '/algorithms');
      expect(screen.getByRole('link', { name: /comparativa/i })).toHaveAttribute('href', '/compare');
      expect(screen.getByRole('link', { name: /matemáticas/i })).toHaveAttribute('href', '/math');
    });

    it('renders the Quick Links heading', () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument();
    });
  });

  describe('Tech Stack Section', () => {
    it('renders the tech stack heading', () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByText('Stack Tecnológico')).toBeInTheDocument();
    });

    it('displays all tech stack items', () => {
      render(<Footer {...defaultProps} />);
      
      expect(screen.getByText(/• Raspberry Pi 4/i)).toBeInTheDocument();
      expect(screen.getByText(/• C \(long double\)/i)).toBeInTheDocument();
      expect(screen.getByText(/• React \+ TypeScript/i)).toBeInTheDocument();
      expect(screen.getByText(/• Tailwind CSS/i)).toBeInTheDocument();
    });
  });

  describe('Social Links', () => {
    it('renders GitHub link with correct attributes', () => {
      render(<Footer {...defaultProps} />);
      
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Daval03');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders Email link with correct attributes', () => {
      render(<Footer {...defaultProps} />);
      
      const emailLink = screen.getByRole('link', { name: /email/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:cambroneroaldo03@gmail.com');
    });
  });

  describe('Copyright Message', () => {
    it('displays the complete copyright message with heart icon', () => {
      render(<Footer {...defaultProps} />);
      
      expect(screen.getByText(/Hecho con/i)).toBeInTheDocument();
      expect(screen.getByText(/para la ciencia de la computación/i)).toBeInTheDocument();
    });

    it('renders with different year prop', () => {
      render(<Footer companyName="Another Company" year={2025} />);
      expect(screen.getByText(/© 2025 Another Company/i)).toBeInTheDocument();
    });

    it('renders with different company name prop', () => {
      render(<Footer companyName="New Brand" year={2024} />);
      expect(screen.getByText(/© 2024 New Brand/i)).toBeInTheDocument();
    });
  });

  describe('Styling and Structure', () => {
    it('applies correct CSS classes to footer element', () => {
      render(<Footer {...defaultProps} />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('border-t', 'border-slate-800', 'bg-slate-900', 'text-slate-400');
    });

    it('contains the max-width container', () => {
      const { container } = render(<Footer {...defaultProps} />);
      
      const maxWidthDiv = container.querySelector('.max-w-6xl');
      expect(maxWidthDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for icon links', () => {
      render(<Footer {...defaultProps} />);
      
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('uses semantic footer element', () => {
      render(<Footer {...defaultProps} />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });
  });
});