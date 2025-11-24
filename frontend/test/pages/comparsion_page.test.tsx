import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PiAlgorithmsComparison from "../../src/pages/comparison_page";
import { fetchEstimations } from "../../src/services/apiService";

// Mock fetch function
vi.mock("../../src/services/apiService", () => ({
  fetchEstimations: vi.fn(),
}));

const mockData = [
  {
    id: 2,
    algorithm: "Test Algo B",
    type: "Probability",
    correct_digits: 300,
    iterations: 2000,
    time_seconds: 2.5,
    iterations_per_second: 1000,
    absolute_error: 0.05,
    pi_estimate: 3.14,
  },
  {
    id: 1,
    algorithm: "Test Algo A",
    type: "Numerical Methods",
    correct_digits: 500,
    iterations: 3000,
    time_seconds: 1.2,
    iterations_per_second: 1500,
    absolute_error: 0.01,
    pi_estimate: 3.14159,
  },
];

describe("PiAlgorithmsComparison Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (fetchEstimations as vi.Mock).mockResolvedValue(mockData);
  });

  it("shows loading state initially", () => {
    render(<PiAlgorithmsComparison />);
    expect(screen.getByText(/Cargando datos/i)).toBeTruthy();
  });

  it("renders fetched data", async () => {
    render(<PiAlgorithmsComparison />);

    // Wait until all matching UI elements are rendered
    const items = await screen.findAllByText(/Test Algo A/);

    // We expect at least 1 card with the title
    expect(items.length).toBeGreaterThanOrEqual(1);

    expect(fetchEstimations).toHaveBeenCalled();
  });


  it("sorts by precision when clicking button", async () => {
    render(<PiAlgorithmsComparison />);

    // Wait for the mock response to be rendered
    await screen.findByText(/Comparación de Algoritmos/i);

    const precisionButton = screen.getByRole("button", { name: /precisión/i });
    fireEvent.click(precisionButton);

    // Get ONLY card titles using heading role level 3
    const cardTitles = await screen.findAllByRole("heading", { level: 3 });

    // First item should be the one with highest precision (Test Algo A)
    expect(cardTitles[0].textContent).toContain("Test Algo A");
    expect(cardTitles[1].textContent).toContain("Test Algo B");
  });


});
