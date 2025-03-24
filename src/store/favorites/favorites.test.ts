import { beforeEach, describe, expect, it, vi } from "vitest"

import { act } from "@testing-library/react"
import { useFavoritesStore } from "./favorites"

describe("useFavoritesStore", () => {
  const mockDog1 = {
    id: "123",
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    zip_code: "12345",
    img: "https://example.com/dog1.jpg",
  }

  const mockDog2 = {
    id: "456",
    name: "Max",
    breed: "German Shepherd",
    age: 2,
    zip_code: "67890",
    img: "https://example.com/dog2.jpg",
  }

  beforeEach(() => {
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      clear: vi.fn(),
    })
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      clear: vi.fn(),
    })

    act(() => {
      useFavoritesStore.setState({ favorites: [] })
    })
  })

  it("should initially have empty favorites", () => {
    const state = useFavoritesStore.getState()
    expect(state.favorites).toEqual([])
  })

  it("should add a dog to favorites", () => {
    act(() => {
      useFavoritesStore.getState().addFavorite(mockDog1)
    })

    const state = useFavoritesStore.getState()
    expect(state.favorites).toHaveLength(1)
    expect(state.favorites[0]).toEqual(mockDog1)
  })

  it("should remove a dog from favorites", () => {
    act(() => {
      useFavoritesStore.getState().addFavorite(mockDog1)
      useFavoritesStore.getState().addFavorite(mockDog2)
    })

    expect(useFavoritesStore.getState().favorites).toHaveLength(2)

    act(() => {
      useFavoritesStore.getState().removeFavorite(mockDog1.id)
    })

    const state = useFavoritesStore.getState()
    expect(state.favorites).toHaveLength(1)
    expect(state.favorites[0].id).toBe(mockDog2.id)
  })

  it("should toggle a dog in favorites - add if not present", () => {
    act(() => {
      useFavoritesStore.getState().toggleFavorite(mockDog1)
    })

    expect(useFavoritesStore.getState().favorites).toContainEqual(mockDog1)
  })

  it("should toggle a dog in favorites - remove if present", () => {
    act(() => {
      useFavoritesStore.getState().addFavorite(mockDog1)
    })

    expect(useFavoritesStore.getState().favorites).toContainEqual(mockDog1)

    act(() => {
      useFavoritesStore.getState().toggleFavorite(mockDog1)
    })

    expect(useFavoritesStore.getState().favorites).not.toContainEqual(mockDog1)
  })

  it("should replace a dog if adding with same ID", () => {
    act(() => {
      useFavoritesStore.getState().addFavorite(mockDog1)
    })

    const updatedDog = { ...mockDog1, name: "Updated Name" }

    act(() => {
      useFavoritesStore.getState().addFavorite(updatedDog)
    })

    const state = useFavoritesStore.getState()
    expect(state.favorites).toHaveLength(1)
    expect(state.favorites[0].name).toBe("Updated Name")
  })
})
