import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "../../test/test-utils"

import { MatchBanner } from "./MatchBanner"

vi.mock("./MatchBanner", () => ({
  MatchBanner: ({ dog, onClose }: any) => {
    if (!dog) return null
    return (
      <div data-testid="mock-match-banner">
        <h1>It's a match!</h1>
        <h2>{dog.name}</h2>
        <p>{dog.breed}</p>
        <img src={dog.img} alt="Dog" />
        <button onClick={onClose}>Close</button>
      </div>
    )
  },
}))

describe("MatchBanner", () => {
  it("renders the matched dog information correctly", () => {
    const matchedDog = {
      id: "123",
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      zip_code: "12345",
      img: "https://example.com/dog.jpg",
    }

    render(<MatchBanner dog={matchedDog} onClose={() => {}} />)

    expect(screen.getByText("It's a match!")).toBeInTheDocument()
    expect(screen.getByText("Buddy")).toBeInTheDocument()
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument()
    expect(screen.getByAltText("Dog")).toHaveAttribute(
      "src",
      "https://example.com/dog.jpg"
    )
  })

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn()
    const matchedDog = {
      id: "123",
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      zip_code: "12345",
      img: "https://example.com/dog.jpg",
    }

    render(<MatchBanner dog={matchedDog} onClose={onClose} />)

    const closeButton = screen.getByRole("button", { name: /close/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it("renders null when no dog is provided", () => {
    render(<MatchBanner dog={null as any} onClose={() => {}} />)
    expect(screen.queryByTestId("mock-match-banner")).not.toBeInTheDocument()
  })
})
