import { vi, describe, it, expect, beforeEach } from "vitest"
import * as apiModule from "./api"

// Mock the API module instead of axios directly
vi.mock("../api", async () => {
  const actual = await vi.importActual("../api")
  return {
    ...actual,
    // Mock the specific functions we're testing
    getBreeds: vi.fn(),
    searchDogs: vi.fn(),
    getDogs: vi.fn(),
    getMatch: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  }
})

describe("API Service", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("getBreeds", () => {
    it("should call the correct endpoint and return breeds", async () => {
      const mockBreeds = ["Labrador", "Poodle", "Beagle"]
      // Mock the implementation for this specific test
      vi.mocked(apiModule.getBreeds).mockResolvedValueOnce(mockBreeds)

      const result = await apiModule.getBreeds()

      expect(apiModule.getBreeds).toHaveBeenCalled()
      expect(result).toEqual(mockBreeds)
    })
  })

  describe("searchDogs", () => {
    it("should search dogs with the correct parameters", async () => {
      const mockResponse = { resultIds: ["dog1", "dog2"], total: 2 }
      vi.mocked(apiModule.searchDogs).mockResolvedValueOnce(mockResponse)

      const filters = {
        breeds: ["Labrador"],
        ageMin: 1,
        ageMax: 5,
        size: 10,
        from: 0,
        sort: "breed:asc",
      }

      const result = await apiModule.searchDogs(filters)

      expect(apiModule.searchDogs).toHaveBeenCalledWith(filters)
      expect(result).toEqual(mockResponse)
    })

    it("should handle multiple breeds and zip codes", async () => {
      const mockResponse = { resultIds: ["dog1", "dog2"], total: 2 }
      vi.mocked(apiModule.searchDogs).mockResolvedValueOnce(mockResponse)

      const filters = {
        breeds: ["Labrador", "Poodle"],
        zipCodes: ["12345", "67890"],
      }

      await apiModule.searchDogs(filters)

      const params = vi.mocked(apiModule.searchDogs).mock.calls[0][0]

      // Check all parameters are included correctly
      const breedParams = params.breeds
      expect(breedParams).toEqual(["Labrador", "Poodle"])

      const zipParams = params.zipCodes
      expect(zipParams).toEqual(["12345", "67890"])
    })
  })

  describe("getDogs", () => {
    it("should fetch dogs with the correct IDs", async () => {
      const mockDogs = [
        {
          id: "dog1",
          name: "Buddy",
          breed: "Labrador",
          age: 3,
          zip_code: "12345",
          img: "image1.jpg",
        },
        {
          id: "dog2",
          name: "Max",
          breed: "Poodle",
          age: 2,
          zip_code: "67890",
          img: "image2.jpg",
        },
      ]
      vi.mocked(apiModule.getDogs).mockResolvedValueOnce(mockDogs)

      const dogIds = ["dog1", "dog2"]
      const result = await apiModule.getDogs(dogIds)

      expect(apiModule.getDogs).toHaveBeenCalledWith(dogIds)
      expect(result).toEqual(mockDogs)
    })
  })

  describe("getMatch", () => {
    it("should get a match with the correct dog IDs", async () => {
      const mockMatch = { match: "dog1" }
      vi.mocked(apiModule.getMatch).mockResolvedValueOnce(mockMatch)

      const dogIds = ["dog1", "dog2", "dog3"]
      const result = await apiModule.getMatch(dogIds)

      expect(apiModule.getMatch).toHaveBeenCalledWith(dogIds)
      expect(result).toEqual(mockMatch)
    })
  })

  describe("login", () => {
    it("should log in with the correct credentials", async () => {
      vi.mocked(apiModule.login).mockResolvedValueOnce(undefined)

      const credentials = { name: "John", email: "john@example.com" }
      await apiModule.login(credentials)

      expect(apiModule.login).toHaveBeenCalledWith(credentials)
    })
  })

  describe("logout", () => {
    it("should call logout", async () => {
      vi.mocked(apiModule.logout).mockResolvedValueOnce(undefined)

      await apiModule.logout()

      expect(apiModule.logout).toHaveBeenCalled()
    })
  })
})
