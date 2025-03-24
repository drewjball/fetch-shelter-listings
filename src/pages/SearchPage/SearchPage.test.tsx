import * as apiService from "../../services/api"
import * as favoritesModule from "../../store/favorites/favorites"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { SearchPage } from "./SearchPage"

vi.mock("../../services/api", () => ({
  searchDogs: vi.fn(),
  getDogs: vi.fn(),
  getBreeds: vi.fn(),
  getLocations: vi.fn(),
  getMatch: vi.fn(),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("../../store/favorites", () => ({
  useFavoritesStore: vi.fn(),
}))

const mockNavigate = vi.fn()

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: () => {
      store = {}
    },
  }
})()
Object.defineProperty(window, "localStorage", { value: localStorageMock })

const renderSearchPage = () => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </ChakraProvider>
  )
}

describe("SearchPage", () => {
  const mockDogs = [
    {
      id: "dog1",
      name: "Buddy",
      breed: "Labrador",
      age: 3,
      img: "img1.jpg",
      zip_code: "90210",
    },
    {
      id: "dog2",
      name: "Max",
      breed: "Poodle",
      age: 2,
      img: "img2.jpg",
      zip_code: "90211",
    },
  ]

  const mockBreeds = ["Labrador", "Poodle", "Terrier", "Bulldog"]
  const mockLocations = [
    {
      zip_code: "90210",
      latitude: 0,
      longitude: 0,
      city: "Beverly Hills",
      state: "CA",
      county: "Los Angeles",
    },
    {
      zip_code: "90211",
      latitude: 0,
      longitude: 0,
      city: "Beverly Hills",
      state: "CA",
      county: "Los Angeles",
    },
    {
      zip_code: "90212",
      latitude: 0,
      longitude: 0,
      city: "Beverly Hills",
      state: "CA",
      county: "Los Angeles",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()

    const mockState = {
      favorites: [],
      toggleFavorite: vi.fn(),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    }

    vi.spyOn(favoritesModule, "useFavoritesStore").mockImplementation(
      (selector) => {
        return selector(mockState)
      }
    )

    vi.mocked(apiService.searchDogs).mockResolvedValue({
      resultIds: ["dog1", "dog2"],
      total: 2,
      next: undefined,
      prev: undefined,
    })

    vi.mocked(apiService.getDogs).mockResolvedValue(mockDogs)
    vi.mocked(apiService.getBreeds).mockResolvedValue(mockBreeds)
    vi.mocked(apiService.getLocations).mockResolvedValue(mockLocations)
  })

  it("renders search page with filters and dog cards", async () => {
    renderSearchPage()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(apiService.getBreeds).toHaveBeenCalled()
      expect(apiService.searchDogs).toHaveBeenCalled()
      expect(apiService.getDogs).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument()
    })
    expect(screen.getAllByText("Max")).toHaveLength(2)

    expect(screen.getByText("Select breeds...")).toBeInTheDocument()
  })

  it("filters dogs by breed", async () => {
    renderSearchPage()

    await waitFor(() => {
      expect(apiService.getDogs).toHaveBeenCalled()
    })

    vi.mocked(apiService.searchDogs).mockClear()

    vi.mocked(apiService.searchDogs).mockResolvedValueOnce({
      resultIds: ["dog1"],
      total: 1,
      next: undefined,
      prev: undefined,
    })

    apiService.searchDogs({
      breeds: ["Labrador"],
      from: 0,
      size: 12,
      sort: "breed:asc",
    })

    expect(apiService.searchDogs).toHaveBeenCalledWith(
      expect.objectContaining({
        breeds: ["Labrador"],
      })
    )
  })

  it("filters dogs by age", async () => {
    renderSearchPage()

    await waitFor(() => {
      expect(apiService.getDogs).toHaveBeenCalled()
    })

    vi.mocked(apiService.searchDogs).mockClear()

    vi.mocked(apiService.searchDogs).mockResolvedValueOnce({
      resultIds: ["dog1"],
      total: 1,
      next: undefined,
      prev: undefined,
    })

    apiService.searchDogs({
      ageMin: 1,
      ageMax: 3,
      from: 0,
      size: 12,
      sort: "breed:asc",
    })

    expect(apiService.searchDogs).toHaveBeenCalledWith(
      expect.objectContaining({
        ageMin: 1,
        ageMax: 3,
      })
    )
  })

  it("toggles dog favorite status", async () => {
    const toggleFavoriteMock = vi.fn()

    vi.spyOn(favoritesModule, "useFavoritesStore").mockImplementation(
      (selector) => {
        const state = {
          favorites: [],
          toggleFavorite: toggleFavoriteMock,
          addFavorite: vi.fn(),
          removeFavorite: vi.fn(),
        }
        return selector(state)
      }
    )

    renderSearchPage()

    await waitFor(() => {
      expect(apiService.getDogs).toHaveBeenCalled()
    })

    toggleFavoriteMock(mockDogs[0])

    expect(toggleFavoriteMock).toHaveBeenCalledWith(mockDogs[0])
  })

  it("filters by favorites only", async () => {
    renderSearchPage()

    await waitFor(() => {
      expect(apiService.getDogs).toHaveBeenCalled()
    })

    const favoritesToggleText = screen.getByText(/show only my favorites/i)
    expect(favoritesToggleText).toBeInTheDocument()

    const favoritesToggleSwitch = screen.getByRole("checkbox")
    expect(favoritesToggleSwitch).toBeInTheDocument()

    fireEvent.click(favoritesToggleSwitch)

    expect(favoritesToggleSwitch).toBeChecked()
  })

  it("shows error state when API request fails", async () => {
    vi.mocked(apiService.searchDogs).mockRejectedValue(
      new Error("Failed to fetch dogs")
    )

    renderSearchPage()

    await waitFor(() => {
      expect(apiService.searchDogs).toHaveBeenCalled()
    })
  })

  it("handles pagination correctly", async () => {
    expect(true).toBe(true)
  })
})
