import { render, screen, fireEvent } from "../../test/test-utils"
import { vi, describe, it, expect } from "vitest"
import { EmptyFavorites } from "./EmptyFavorites"

describe("EmptyFavorites", () => {
  it("renders empty favorites message", () => {
    const onShowAllDogsClick = vi.fn()
    render(<EmptyFavorites onShowAllDogsClick={onShowAllDogsClick} />)

    expect(screen.getByText("No favorites yet")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Click the heart icon on any dog to add them to your favorites"
      )
    ).toBeInTheDocument()
    expect(screen.getByText("See All Dogs")).toBeInTheDocument()
  })

  it("calls onShowAllDogsClick when button is clicked", () => {
    const onShowAllDogsClick = vi.fn()
    render(<EmptyFavorites onShowAllDogsClick={onShowAllDogsClick} />)

    const button = screen.getByText("See All Dogs")
    fireEvent.click(button)

    expect(onShowAllDogsClick).toHaveBeenCalledTimes(1)
  })
})
