import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";

type WrapperOptions = {
  route?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = "/" }: WrapperOptions = {},
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
    options,
  );
}
