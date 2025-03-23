import { render, screen, fireEvent } from "../../test/test-utils"
import { vi, describe, it, expect } from "vitest"
import { FavoritesToggle } from "./FavoritesToggle"

describe("FavoritesToggle", () => {
  it("renders toggle with correct label", () => {
    const onChange = vi.fn()
    render(<FavoritesToggle isChecked={false} onChange={onChange} />)

    expect(screen.getByText("Show only my favorites")).toBeInTheDocument()
    const toggle = screen.getByRole("checkbox")
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()
  })

  it("displays correct state when checked", () => {
    const onChange = vi.fn()
    render(<FavoritesToggle isChecked={true} onChange={onChange} />)

    const toggle = screen.getByRole("checkbox")
    expect(toggle).toBeChecked()
  })

  it("calls onChange when toggle is clicked", () => {
    const onChange = vi.fn()
    render(<FavoritesToggle isChecked={false} onChange={onChange} />)

    const toggle = screen.getByRole("checkbox")
    fireEvent.click(toggle)

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
