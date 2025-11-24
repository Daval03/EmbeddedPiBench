import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AlgorithmsPage from "../../src/pages/algorithm_page";
import { fetchAlgorithms } from "../../src/services/apiService";

// ---- mock api service ----
vi.mock("../../src/services/apiService", () => ({
  fetchAlgorithms: vi.fn(),
}));

const mockAlgorithms = [
  {
    name: "Monte Carlo π",
    type: "Probability",
    description: "Uses random sampling to estimate π.",
    code: "float pi = estimate();"
  },
  {
    name: "Gauss–Legendre Method",
    type: "Numerical Methods",
    description: "Very fast convergence to π.",
    code: "double pi = computeGaussLegendre();"
  }
];

describe("AlgorithmsPage", () => {
  beforeEach(() => {
    // Vitest-style mock typing
    (fetchAlgorithms as Mock).mockResolvedValue(mockAlgorithms);
  });

  it("shows loading message initially", () => {
    render(<AlgorithmsPage />);
    expect(screen.getByText(/Cargando algoritmos/i)).toBeTruthy();
  });

  it("renders algorithm cards after fetch", async () => {
    render(<AlgorithmsPage />);

    await waitFor(() =>
      expect(screen.getByText(/Monte Carlo π/)).toBeTruthy()
    );

    expect(screen.getByText("Gauss–Legendre Method")).toBeTruthy();
    expect(screen.getByText(/2 algoritmos ejecutados/i)).toBeTruthy();
  });

  it("renders code snippets", async () => {
    render(<AlgorithmsPage />);

    await screen.findByText("Monte Carlo π");

    const snippets = screen.getAllByText(/estimate|compute/i);

    expect(snippets.length).toBeGreaterThan(1);
  });

});
