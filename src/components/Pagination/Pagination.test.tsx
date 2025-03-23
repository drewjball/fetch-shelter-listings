import { render, screen, fireEvent } from "../../test/test-utils"
import { vi, describe, it, expect } from "vitest"
import { Pagination } from "./Pagination"

describe("Pagination", () => {
  const defaultProps = {
    isLoading: false,
    currentPage: 2,
    totalPages: 5,
    total: 100,
    showOnlyFavorites: false,
    favCount: 10,
    hasNext: true,
    hasPrev: true,
    onNextPage: vi.fn(),
    onPrevPage: vi.fn(),
  }

  it("renders pagination info correctly", () => {
    render(<Pagination {...defaultProps} />)

    // Use regex to match text that might be broken across elements
    expect(screen.getByText(/Page/)).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText(/of/)).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText(/100 dogs/)).toBeInTheDocument()
  })

  it("renders loading text when isLoading is true", () => {
    render(<Pagination {...defaultProps} isLoading={true} />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows favorite count when showOnlyFavorites is true", () => {
    render(<Pagination {...defaultProps} showOnlyFavorites={true} />)

    expect(screen.getByText("Showing 10 favorites")).toBeInTheDocument()
  })

  it("doesn't show pagination buttons when showOnlyFavorites is true", () => {
    render(<Pagination {...defaultProps} showOnlyFavorites={true} />)

    expect(screen.queryByText("Previous")).not.toBeInTheDocument()
    expect(screen.queryByText("Next")).not.toBeInTheDocument()
  })

  it("calls onNextPage when Next button is clicked", () => {
    render(<Pagination {...defaultProps} />)

    const nextButton = screen.getByText("Next")
    fireEvent.click(nextButton)

    expect(defaultProps.onNextPage).toHaveBeenCalledTimes(1)
  })

  it("calls onPrevPage when Previous button is clicked", () => {
    render(<Pagination {...defaultProps} />)

    const prevButton = screen.getByText("Previous")
    fireEvent.click(prevButton)

    expect(defaultProps.onPrevPage).toHaveBeenCalledTimes(1)
  })

  it("disables Previous button when hasPrev is false", () => {
    render(<Pagination {...defaultProps} hasPrev={false} />)

    const prevButton = screen.getByText("Previous")
    expect(prevButton).toBeDisabled()
  })

  it("disables Next button when hasNext is false", () => {
    render(<Pagination {...defaultProps} hasNext={false} />)

    const nextButton = screen.getByText("Next")
    expect(nextButton).toBeDisabled()
  })
})
