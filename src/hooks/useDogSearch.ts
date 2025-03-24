import { Dog, SearchFilters } from "../types"
import { getBreeds, getDogs, searchDogs } from "../services/api"
import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY_FILTERS = "search_filters"

export const useDogSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY_FILTERS)
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          sort: "breed:asc",
          from: 0,
          size: 12,
        }
  })

  const [dogs, setDogs] = useState<Dog[]>([])
  const [breeds, setBreeds] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [field, order] = (filters.sort || "breed:asc").split(":")
  const sortField = field
  const sortDirection = order as "asc" | "desc"

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const fetchedBreeds = await getBreeds()
        setBreeds(fetchedBreeds)
      } catch (error) {
        console.error("Error fetching breeds:", error)
      }
    }
    fetchBreeds()
  }, [])

  useEffect(() => {
    const fetchDogs = async () => {
      setIsSearching(true)
      try {
        const searchResponse = await searchDogs(filters)
        const resultsData = await getDogs(searchResponse.resultIds)
        setDogs(resultsData)
        setTotal(searchResponse.total)
        setTotalPages(Math.ceil(searchResponse.total / (filters.size || 12)))
        setCurrentPage(
          Math.floor((filters.from || 0) / (filters.size || 12)) + 1
        )
      } catch (error) {
        console.error("Error searching dogs:", error)
      } finally {
        setIsSearching(false)
      }
    }
    fetchDogs()
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => {
      if (
        (newFilters.breeds ||
          newFilters.ageMin ||
          newFilters.ageMax ||
          newFilters.sort) &&
        !newFilters.hasOwnProperty("from")
      ) {
        return { ...prev, ...newFilters, from: 0 }
      }
      return { ...prev, ...newFilters }
    })
  }, [])

  const nextPage = useCallback(() => {
    const nextFrom = (filters.from || 0) + (filters.size || 12)
    updateFilters({ from: nextFrom })
  }, [filters.from, filters.size, updateFilters])

  const prevPage = useCallback(() => {
    const prevFrom = Math.max(0, (filters.from || 0) - (filters.size || 12))
    updateFilters({ from: prevFrom })
  }, [filters.from, filters.size, updateFilters])

  const toggleSort = useCallback(() => {
    const [currentField, currentOrder] = (filters.sort || "breed:asc").split(
      ":"
    )
    const newOrder = currentOrder === "asc" ? "desc" : "asc"
    updateFilters({ sort: `${currentField}:${newOrder}` })
  }, [filters.sort, updateFilters])

  const setSortField = useCallback(
    (field: string) => {
      updateFilters({ sort: `${field}:${sortDirection}` })
    },
    [sortDirection, updateFilters]
  )

  return {
    dogs,
    breeds,
    filters,
    isSearching,
    total,
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    sortField,
    sortDirection,
    updateFilters,
    nextPage,
    prevPage,
    toggleSort,
    setSortField,
  }
}
