import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "../../test/test-utils"

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

    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText(/of/)).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText(/100 dogs/)).toBeInTheDocument()
  })

  it("renders loading text when isLoading is true", () => {
    render(<Pagination {...defaultProps} isLoading={true} />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows favorite count when showOnlyFavorites is true and totalPages <= 1", () => {
    render(
      <Pagination
        {...defaultProps}
        showOnlyFavorites={true}
        total={10}
        totalPages={1}
      />
    )

    expect(screen.getByText(/Showing 10 favorites/)).toBeInTheDocument()
  })

  it("shows pagination controls when showOnlyFavorites is true with multiple pages", () => {
    render(<Pagination {...defaultProps} showOnlyFavorites={true} />)

    expect(screen.getByText("Previous")).toBeInTheDocument()
    expect(screen.getByText("Next")).toBeInTheDocument()
    expect(screen.getByText(/\(100 dogs\)/)).toBeInTheDocument()
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
