import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "../../test/test-utils"

import { SearchControls } from "./SearchControls"

vi.mock("chakra-react-select", () => ({
  Select: ({ onChange, value, options, placeholder, isMulti }: any) => (
    <div data-testid="select-mock">
      <input
        data-testid="select-input"
        onChange={(e) => {
          if (isMulti) {
            const option = options.find((o: any) => o.value === e.target.value)
            const newSelection = option ? [...(value || []), option] : []
            onChange(newSelection.length ? newSelection : null)
          } else {
            onChange(
              options.find((o: any) => o.value === e.target.value) || null
            )
          }
        }}
        placeholder={placeholder}
        value={
          isMulti
            ? value?.map((v: any) => v.value).join(", ") || ""
            : value?.value || ""
        }
      />
      <select data-testid="select-options">
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}))

describe("SearchControls", () => {
  const mockBreedOptions = [
    { value: "labrador", label: "Labrador" },
    { value: "poodle", label: "Poodle" },
  ]

  const defaultProps = {
    breedOptions: mockBreedOptions,
    selectedBreeds: [],
    onBreedsChange: vi.fn(),
    sortField: "breed",
    sortDirection: "asc" as const,
    onSortFieldChange: vi.fn(),
    onSortToggle: vi.fn(),
    onMatchClick: vi.fn(),
    matchCount: 2,
    disableMatch: false,
    showingFavorites: false,
    ageMin: undefined,
    ageMax: undefined,
    zipCode: undefined,
    onAgeFilterChange: vi.fn(),
    onZipCodeChange: vi.fn(),
  }

  it("renders select with the correct placeholder when not showing favorites", () => {
    render(<SearchControls {...defaultProps} />)

    const select = screen.getByTestId("select-input")
    expect(select).toHaveAttribute("placeholder", "Select breeds...")
  })

  it("renders select with different placeholder when showing favorites", () => {
    render(<SearchControls {...defaultProps} showingFavorites={true} />)

    const select = screen.getByTestId("select-input")
    expect(select).toHaveAttribute("placeholder", "Filter your favorites...")
  })

  it("displays sort button when not showing favorites", () => {
    render(<SearchControls {...defaultProps} />)

    const sortButton = screen.getByLabelText("Sort descending")
    expect(sortButton).toBeInTheDocument()
  })

  it("shows sort buttons in favorites mode", () => {
    render(<SearchControls {...defaultProps} showingFavorites={true} />)

    expect(screen.getByLabelText("Sort descending")).toBeInTheDocument()
  })

  it("displays correct sort button based on sort direction", () => {
    render(<SearchControls {...defaultProps} sortDirection="desc" />)

    const sortButton = screen.getByLabelText("Sort ascending")
    expect(sortButton).toBeInTheDocument()
  })

  it("displays match count in the match button", () => {
    render(<SearchControls {...defaultProps} matchCount={5} />)

    const matchButton = screen.getByText("Match (5)")
    expect(matchButton).toBeInTheDocument()
  })

  it("disables match button when disableMatch is true", () => {
    render(<SearchControls {...defaultProps} disableMatch={true} />)

    const matchButton = screen.getByText("Match (2)")
    expect(matchButton).toBeDisabled()
  })

  it("calls onSortToggle when sort button is clicked", () => {
    render(<SearchControls {...defaultProps} />)

    const sortButton = screen.getByLabelText("Sort descending")
    fireEvent.click(sortButton)

    expect(defaultProps.onSortToggle).toHaveBeenCalledTimes(1)
  })

  it("calls onMatchClick when match button is clicked", () => {
    render(<SearchControls {...defaultProps} />)

    const matchButton = screen.getByText("Match (2)")
    fireEvent.click(matchButton)

    expect(defaultProps.onMatchClick).toHaveBeenCalledTimes(1)
  })
})
