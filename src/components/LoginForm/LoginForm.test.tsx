import { render, screen, fireEvent } from "../../test/test-utils"
import { vi, describe, it, expect } from "vitest"
import { LoginForm } from "./LoginForm"

describe("LoginForm", () => {
  const defaultProps = {
    name: "",
    email: "",
    error: null,
    isLoading: false,
    onNameChange: vi.fn(),
    onEmailChange: vi.fn(),
    onSubmit: vi.fn(),
  }

  it("renders form elements correctly", () => {
    render(<LoginForm {...defaultProps} />)

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Start Finding Dogs" })
    ).toBeInTheDocument()
  })

  it("displays input values correctly", () => {
    render(
      <LoginForm {...defaultProps} name="John Doe" email="john@example.com" />
    )

    const nameInput = screen.getByPlaceholderText(
      "Enter your name"
    ) as HTMLInputElement
    const emailInput = screen.getByPlaceholderText(
      "Enter your email"
    ) as HTMLInputElement

    expect(nameInput.value).toBe("John Doe")
    expect(emailInput.value).toBe("john@example.com")
  })

  it("calls event handlers when inputs change", () => {
    render(<LoginForm {...defaultProps} />)

    const nameInput = screen.getByPlaceholderText("Enter your name")
    const emailInput = screen.getByPlaceholderText("Enter your email")

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } })
    fireEvent.change(emailInput, { target: { value: "jane@example.com" } })

    expect(defaultProps.onNameChange).toHaveBeenCalled()
    expect(defaultProps.onEmailChange).toHaveBeenCalled()
  })

  it("calls onSubmit when form is submitted", () => {
    render(<LoginForm {...defaultProps} />)

    // Get the form element using querySelector since it doesn't have a role
    const form = document.querySelector("form")
    expect(form).not.toBeNull()
    if (form) {
      fireEvent.submit(form)
      expect(defaultProps.onSubmit).toHaveBeenCalled()
    }
  })

  it("displays error message when provided", () => {
    const errorMessage = "Invalid email address"

    render(<LoginForm {...defaultProps} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it("disables button and shows loading state when isLoading is true", () => {
    render(<LoginForm {...defaultProps} isLoading={true} />)

    // Look for the button with type="submit" and check if it's disabled
    const button = screen.getByRole("button", { name: /Signing in/i })
    expect(button).toBeDisabled()
  })
})
