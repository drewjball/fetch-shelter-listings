export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface SearchResponse {
  resultIds: string[]
  total: number
  next?: string
  prev?: string
}

export interface LoginCredentials {
  name: string
  email: string
}

export interface Match {
  match: string
}

export interface SearchFilters {
  breeds?: string[]
  zipCodes?: string[]
  ageMin?: number
  ageMax?: number
  size?: number
  from?: number
  sort?: string
}

export interface LocationSearchParams {
  city?: string
  states?: string[]
  geoBoundingBox?: {
    top?: number
    left?: number
    bottom?: number
    right?: number
    bottom_left?: Coordinates
    top_right?: Coordinates
  }
  size?: number
  from?: number
}

export interface LocationSearchResponse {
  results: Location[]
  total: number
}

export interface BreedOption {
  value: string
  label: string
}
