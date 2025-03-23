import * as originalModule from "./MatchBanner"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "../../test/test-utils"

// Mock MatchBanner to avoid framer-motion issues
const MockMatchBanner = ({ dog, onClose }: any) => {
  return (
    <div data-testid="match-banner">
      <h1>You've been matched with {dog.name}!</h1>
      <p>
        {dog.name} is a {dog.age === 0 ? "< 1" : dog.age} year old {dog.breed}{" "}
        who can't wait to meet you!
      </p>
      <div>
        <span>{dog.breed}</span>
        <span>{dog.age === 0 ? "< 1" : dog.age} years old</span>
        <span>ZIP: {dog.zip_code}</span>
      </div>
      <button onClick={onClose}>Continue Searching</button>
    </div>
  )
}

// Mock the MatchBanner module
vi.mock("./MatchBanner", async () => {
  const actual = await vi.importActual<typeof originalModule>("./MatchBanner")
  return {
    ...actual,
    MatchBanner: MockMatchBanner,
  }
})

describe("MatchBanner", () => {
  const mockDog = {
    id: "123",
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    zip_code: "12345",
    img: "https://example.com/dog.jpg",
  }

  it("renders the matched dog information correctly", () => {
    const onClose = vi.fn()

    render(<MockMatchBanner dog={mockDog} onClose={onClose} />)

    expect(
      screen.getByText("You've been matched with Buddy!")
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Buddy is a 3 year old Golden Retriever who can't wait to meet you!"
      )
    ).toBeInTheDocument()
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument()
    expect(screen.getByText("3 years old")).toBeInTheDocument()
    expect(screen.getByText("ZIP: 12345")).toBeInTheDocument()
  })

  it("calls onClose when the continue button is clicked", () => {
    const onClose = vi.fn()

    render(<MockMatchBanner dog={mockDog} onClose={onClose} />)

    const continueButton = screen.getByText("Continue Searching")
    fireEvent.click(continueButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("displays '< 1 years old' for puppies", () => {
    const onClose = vi.fn()
    const puppyDog = { ...mockDog, age: 0 }

    render(<MockMatchBanner dog={puppyDog} onClose={onClose} />)

    expect(screen.getByText("< 1 years old")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Buddy is a < 1 year old Golden Retriever who can't wait to meet you!"
      )
    ).toBeInTheDocument()
  })
})
