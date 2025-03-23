import {
  Dog,
  Location,
  LocationSearchParams,
  LocationSearchResponse,
  LoginCredentials,
  Match,
  SearchFilters,
  SearchResponse,
} from "../../types"

import axios from "axios"

const API_BASE_URL = "https://frontend-take-home-service.fetch.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export const login = async (credentials: LoginCredentials): Promise<void> => {
  await api.post("/auth/login", credentials)
}

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout")
}

export const getBreeds = async (): Promise<string[]> => {
  const response = await api.get<string[]>("/dogs/breeds")
  return response.data
}

export const searchDogs = async (
  filters: SearchFilters
): Promise<SearchResponse> => {
  const params = new URLSearchParams()

  if (filters.breeds?.length) {
    filters.breeds.forEach((breed) => params.append("breeds", breed))
  }
  if (filters.zipCodes?.length) {
    filters.zipCodes.forEach((zip) => params.append("zipCodes", zip))
  }
  if (filters.ageMin !== undefined) {
    params.append("ageMin", filters.ageMin.toString())
  }
  if (filters.ageMax !== undefined) {
    params.append("ageMax", filters.ageMax.toString())
  }
  if (filters.size !== undefined) {
    params.append("size", filters.size.toString())
  }
  if (filters.from !== undefined && !isNaN(filters.from)) {
    params.append("from", filters.from.toString())
  }
  if (filters.sort) {
    params.append("sort", filters.sort)
  }

  const response = await api.get<SearchResponse>("/dogs/search", { params })

  return response.data
}

export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await api.post<Dog[]>("/dogs", dogIds)
  return response.data
}

export const getMatch = async (dogIds: string[]): Promise<Match> => {
  const response = await api.post<Match>("/dogs/match", dogIds)
  return response.data
}

export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await api.post<Location[]>("/locations", zipCodes)
  return response.data
}

export const searchLocations = async (
  params: LocationSearchParams
): Promise<LocationSearchResponse> => {
  const response = await api.post<LocationSearchResponse>(
    "/locations/search",
    params
  )
  return response.data
}
