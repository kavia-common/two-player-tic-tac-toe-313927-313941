import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders game title and initial turn status", () => {
  render(<App />);
  expect(screen.getByText(/tic tac toe/i)).toBeInTheDocument();
  expect(screen.getByText(/turn:\s*x/i)).toBeInTheDocument();
});
