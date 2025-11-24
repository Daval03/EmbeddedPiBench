import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AlgorithmCard } from '../../src/components/algorithm_card';
import { AlgorithmInfo } from '../../src/types/types';
import { describe, expect, it } from 'vitest';


describe('AlgorithmCard', () => {
  const mockAlgorithm: AlgorithmInfo = {
    name: 'Binary Search',
    description: 'A search algorithm that finds the position of a target value within a sorted array',
    code: 'int binarySearch(int arr[], int l, int r, int x) {\n  // implementation\n}',
    type: 'Search'
  };

  it('renders algorithm name', () => {
    render(<AlgorithmCard algorithm={mockAlgorithm} />);
    expect(screen.getByText('Binary Search')).toBeInTheDocument();
  });

  it('renders algorithm type badge', () => {
    render(<AlgorithmCard algorithm={mockAlgorithm} />);
    expect(screen.getByText('Type: Search')).toBeInTheDocument();
  });

  it('renders language badge', () => {
    render(<AlgorithmCard algorithm={mockAlgorithm} />);
    expect(screen.getByText('Language: C')).toBeInTheDocument();
  });

  it('renders algorithm description when provided', () => {
    render(<AlgorithmCard algorithm={mockAlgorithm} />);
    expect(screen.getByText(mockAlgorithm.description!)).toBeInTheDocument();
  });

  it('does not render description section when description is not provided', () => {
    const algorithmWithoutDescription = { ...mockAlgorithm, description: undefined };
    render(<AlgorithmCard algorithm={algorithmWithoutDescription} />);
    expect(screen.queryByText(/A search algorithm/)).not.toBeInTheDocument();
  });

  it('renders algorithm code', () => {
    render(<AlgorithmCard algorithm={mockAlgorithm} />);
    expect(screen.getByText(/int binarySearch/)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<AlgorithmCard algorithm={mockAlgorithm} className="custom-class" />);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-class');
  });

  it('applies shadow-sm class by default', () => {
    const { container } = render(<AlgorithmCard algorithm={mockAlgorithm} />);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('shadow-sm');
  });
});