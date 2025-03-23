import { describe, expect, it } from "vitest"
import { render, screen } from "../../test/test-utils"

import { AuthLayout } from "./AuthLayout"

describe("AuthLayout", () => {
  const defaultProps = {
    title: "Welcome to Dog Finder",
    subtitle: "Find your perfect companion",
    children: <div data-testid="auth-content">Login Form Content</div>,
  }

  it("renders title and subtitle", () => {
    render(<AuthLayout {...defaultProps} />)

    expect(screen.getByText("Welcome to Dog Finder")).toBeInTheDocument()
    expect(screen.getByText("Find your perfect companion")).toBeInTheDocument()
  })

  it("renders children content", () => {
    render(<AuthLayout {...defaultProps} />)

    expect(screen.getByTestId("auth-content")).toBeInTheDocument()
    expect(screen.getByText("Login Form Content")).toBeInTheDocument()
  })

  it("renders with custom image URL", () => {
    const customImageUrl = "https://example.com/custom-dog-image.jpg"
    render(<AuthLayout {...defaultProps} imageUrl={customImageUrl} />)

    const image = screen.getByAltText("Happy dog")
    expect(image).toHaveAttribute("src", customImageUrl)
  })

  it("renders with default image URL when not provided", () => {
    render(<AuthLayout {...defaultProps} />)

    const image = screen.getByAltText("Happy dog")
    expect(image).toHaveAttribute(
      "src",
      "https://images.unsplash.com/photo-1544568100-847a948585b9"
    )
  })
})
