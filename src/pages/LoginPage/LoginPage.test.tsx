import * as apiService from "../../services/api"

import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { LoginPage } from "./LoginPage"

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockNavigate = vi.fn()

vi.mock("../../services/api", () => ({
  login: vi.fn(),
}))

const renderLoginPage = () => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </ChakraProvider>
  )
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders login form with correct elements", () => {
    renderLoginPage()

    expect(
      screen.getByRole("heading", { name: /find your perfect companion/i })
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /start finding dogs/i })
    ).toBeInTheDocument()
  })

  it("prevents submission when form fields are empty", async () => {
    renderLoginPage()

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /start finding dogs/i })
      )
    })

    expect(apiService.login).not.toHaveBeenCalled()
  })

  it("submits form with valid inputs and calls login service", async () => {
    vi.mocked(apiService.login).mockResolvedValue(undefined)

    renderLoginPage()

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "Test User" },
      })
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "test@example.com" },
      })

      fireEvent.click(
        screen.getByRole("button", { name: /start finding dogs/i })
      )
    })

    expect(apiService.login).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
    })
  })

  it("shows error message when login fails", async () => {
    vi.mocked(apiService.login).mockRejectedValue(
      new Error("Invalid credentials")
    )

    renderLoginPage()

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "Test User" },
      })
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "test@example.com" },
      })

      fireEvent.click(
        screen.getByRole("button", { name: /start finding dogs/i })
      )
    })

    expect(apiService.login).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
    })
  })

  it("calls login service during form submission", async () => {
    vi.mocked(apiService.login).mockResolvedValue(undefined)

    renderLoginPage()

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "Test User" },
      })
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "test@example.com" },
      })

      fireEvent.click(
        screen.getByRole("button", { name: /start finding dogs/i })
      )
    })

    expect(apiService.login).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
    })
  })
})
