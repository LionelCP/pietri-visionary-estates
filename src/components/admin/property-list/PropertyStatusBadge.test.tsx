import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PropertyStatusBadge } from "./PropertyStatusBadge";

describe("PropertyStatusBadge", () => {
  it.each([
    ["draft", "Brouillon"],
    ["published", "Publié"],
    ["archived", "Archivé"],
  ])("renders %s as %s", (status, label) => {
    render(<PropertyStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByLabelText(`Statut : ${label}`)).toBeInTheDocument();
  });

  it("renders a safe fallback for unknown statuses", () => {
    render(<PropertyStatusBadge status="unexpected" />);
    expect(screen.getByText("Inconnu")).toBeInTheDocument();
  });
});
