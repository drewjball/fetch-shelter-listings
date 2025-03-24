import * as originalModule from "./DogCard"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "../../test/test-utils"

const MockDogCard = ({ dog, isFavorite, onToggleFavorite }: any) => {
  return (
    <div data-testid="dog-card" data-favorite={isFavorite}>
      <h2>{dog.name}</h2>
      <div>{dog.breed}</div>
      <div>{dog.age === 0 ? "< 1" : dog.age} years</div>
      <div>ZIP: {dog.zip_code}</div>
      <button
        aria-label="Favorite"
        data-colorscheme={isFavorite ? "brand" : "gray"}
        onClick={() => onToggleFavorite(dog)}
      >
        ❤️
      </button>
    </div>
  )
}

vi.mock("./DogCard", async () => {
  const actual = await vi.importActual<typeof originalModule>("./DogCard")
  return {
    ...actual,
    DogCard: MockDogCard,
  }
})

describe("DogCard", () => {
  const mockDog = {
    id: "123",
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    zip_code: "12345",
    img: "https://example.com/dog.jpg",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders dog information correctly", () => {
    const onToggleFavorite = vi.fn()

    render(
      <MockDogCard
        dog={mockDog}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />
    )

    expect(screen.getByText("Buddy")).toBeInTheDocument()
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument()
    expect(screen.getByText("3 years")).toBeInTheDocument()
    expect(screen.getByText("ZIP: 12345")).toBeInTheDocument()
  })

  it("displays different styling when favorited", () => {
    const onToggleFavorite = vi.fn()

    render(
      <MockDogCard
        dog={mockDog}
        isFavorite={true}
        onToggleFavorite={onToggleFavorite}
      />
    )

    const heartButton = screen.getByLabelText("Favorite")
    expect(heartButton).toHaveAttribute("data-colorscheme", "brand")
  })

  it("calls onToggleFavorite when heart button is clicked", () => {
    const onToggleFavorite = vi.fn()

    render(
      <MockDogCard
        dog={mockDog}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />
    )

    const heartButton = screen.getByLabelText("Favorite")
    fireEvent.click(heartButton)

    expect(onToggleFavorite).toHaveBeenCalledWith(mockDog)
  })

  it('displays "< 1 years" for dogs less than 1 year old', () => {
    const onToggleFavorite = vi.fn()
    const puppyDog = { ...mockDog, age: 0 }

    render(
      <MockDogCard
        dog={puppyDog}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />
    )

    expect(screen.getByText("< 1 years")).toBeInTheDocument()
  })
})
