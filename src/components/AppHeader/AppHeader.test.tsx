import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "../../test/test-utils"

import { AppHeader } from "./AppHeader"

describe("AppHeader", () => {
  const defaultProps = {
    onLogout: vi.fn(),
  }

  it("renders with default title", () => {
    render(<AppHeader {...defaultProps} />)

    expect(screen.getByText("Dog Finder")).toBeInTheDocument()
    expect(screen.getByLabelText("Logo")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("renders with custom title", () => {
    const customTitle = "Pet Adoption"
    render(<AppHeader {...defaultProps} title={customTitle} />)

    expect(screen.getByText(customTitle)).toBeInTheDocument()
  })

  it("calls onLogout when logout button is clicked", () => {
    render(<AppHeader {...defaultProps} />)

    const logoutButton = screen.getByText("Logout")
    fireEvent.click(logoutButton)

    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1)
  })
})
