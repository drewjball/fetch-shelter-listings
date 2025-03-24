import { describe, expect, it, vi } from "vitest"
import { render, screen } from "../../test/test-utils"

import { DogCardGrid } from "./DogCardGrid"

vi.mock("../DogCard/DogCard", () => ({
  DogCard: ({ dog, isFavorite, onToggleFavorite }: any) => (
    <div data-testid={`dog-card-${dog.id}`} data-favorite={isFavorite}>
      <span>{dog.name}</span>
      <button onClick={() => onToggleFavorite(dog)}>Toggle favorite</button>
    </div>
  ),
}))

vi.mock("../DogCardSkeleton/DogCardSkeleton", () => ({
  DogCardSkeleton: () => <div data-testid="dog-card-skeleton" />,
}))

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe("DogCardGrid", () => {
  const mockDogs = [
    {
      id: "dog1",
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      zip_code: "12345",
      img: "https://example.com/dog1.jpg",
    },
    {
      id: "dog2",
      name: "Max",
      breed: "German Shepherd",
      age: 2,
      zip_code: "67890",
      img: "https://example.com/dog2.jpg",
    },
  ]

  const defaultProps = {
    dogs: mockDogs,
    isLoading: false,
    isFavorite: (id: string) => id === "dog1",
    onToggleFavorite: vi.fn(),
  }

  it("renders loading skeletons when isLoading is true", () => {
    render(<DogCardGrid {...defaultProps} isLoading={true} />)

    const skeletons = screen.getAllByTestId("dog-card-skeleton")
    expect(skeletons).toHaveLength(6)
  })

  it("renders dog cards when not loading", () => {
    render(<DogCardGrid {...defaultProps} />)

    expect(screen.getByTestId("dog-card-dog1")).toBeInTheDocument()
    expect(screen.getByTestId("dog-card-dog2")).toBeInTheDocument()
    expect(screen.getByText("Buddy")).toBeInTheDocument()
    expect(screen.getByText("Max")).toBeInTheDocument()
  })

  it("passes isFavorite value to dog cards", () => {
    render(<DogCardGrid {...defaultProps} />)

    expect(screen.getByTestId("dog-card-dog1")).toHaveAttribute(
      "data-favorite",
      "true"
    )
    expect(screen.getByTestId("dog-card-dog2")).toHaveAttribute(
      "data-favorite",
      "false"
    )
  })

  it("passes onToggleFavorite callback to dog cards", () => {
    render(<DogCardGrid {...defaultProps} />)

    const toggleButton = screen.getAllByText("Toggle favorite")[0]
    toggleButton.click()

    expect(defaultProps.onToggleFavorite).toHaveBeenCalledWith(mockDogs[0])
  })
})
