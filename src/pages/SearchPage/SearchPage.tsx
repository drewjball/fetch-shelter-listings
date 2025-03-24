import {
  AppHeader,
  DogCardGrid,
  EmptyFavorites,
  FavoritesToggle,
  MatchBanner,
  Pagination,
  SearchControls,
} from "../../components"
import { Box, Button, Container, Stack, Text, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { AnimatePresence } from "framer-motion"
import { BreedOption } from "../../types"
import { Dog } from "../../types"
import { getMatch } from "../../services/api"
import { useAuth } from "../../hooks/useAuth"
import { useDogSearch } from "../../hooks/useDogSearch"
import { useFavoritesStore } from "../../store/favorites/favorites"

export const SearchPage = () => {
  const DEFAULT_PAGE_SIZE = 12

  const {
    dogs,
    total,
    hasNext,
    hasPrev,
    isSearching,
    filters,
    breeds,
    updateFilters,
    nextPage,
    prevPage,
    toggleSort,
    currentPage,
    totalPages,
    sortField,
    sortDirection,
    setSortField,
  } = useDogSearch()

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null)
  const { logout } = useAuth()
  const toast = useToast()

  const favorites = useFavoritesStore((state) => state.favorites)
  const toggleFav = useFavoritesStore((state) => state.toggleFavorite)

  const favCount = favorites.length

  const isFavorite = useCallback(
    (id: string) => favorites.some((dog: Dog) => dog.id === id),
    [favorites]
  )

  const favBreeds = useMemo(() => {
    const breeds = [...new Set(favorites.map((dog: Dog) => dog.breed))]
    return breeds.sort()
  }, [favorites])

  const breedOptions = useMemo<BreedOption[]>(
    () =>
      (showOnlyFavorites ? favBreeds : breeds).map((breed) => ({
        value: breed,
        label: breed,
      })),
    [breeds, favBreeds, showOnlyFavorites]
  )

  const selectedBreedOptions = useMemo<BreedOption[]>(() => {
    if (!filters.breeds?.length) return []
    return filters.breeds.map((breed) => ({
      value: breed,
      label: breed,
    }))
  }, [filters.breeds])

  const displayedDogs = useMemo(() => {
    if (!showOnlyFavorites) return dogs

    let filtered = [...favorites]

    if (filters.breeds?.length) {
      filtered = filtered.filter((dog) => filters.breeds!.includes(dog.breed))
    }

    if (filters.ageMin !== undefined) {
      filtered = filtered.filter((dog) => dog.age >= filters.ageMin!)
    }

    if (filters.ageMax !== undefined) {
      filtered = filtered.filter((dog) => dog.age <= filters.ageMax!)
    }

    if (filters.zipCodes?.length) {
      filtered = filtered.filter((dog) =>
        filters.zipCodes!.includes(dog.zip_code)
      )
    }

    if (filters.sort) {
      const [field, direction] = filters.sort.split(":")
      const multiplier = direction === "asc" ? 1 : -1

      filtered.sort((a, b) => {
        if (field === "name") {
          return multiplier * a.name.localeCompare(b.name)
        } else if (field === "breed") {
          return multiplier * a.breed.localeCompare(b.breed)
        } else if (field === "age") {
          return multiplier * (a.age - b.age)
        }
        return 0
      })
    }

    const pageSize = filters.size || DEFAULT_PAGE_SIZE
    const startIndex = filters.from || 0
    return filtered.slice(startIndex, startIndex + pageSize)
  }, [dogs, favorites, filters, showOnlyFavorites, DEFAULT_PAGE_SIZE])

  const filteredFavoritesTotal = useMemo(() => {
    if (!showOnlyFavorites) return total

    let filtered = [...favorites]

    if (filters.breeds?.length) {
      filtered = filtered.filter((dog) => filters.breeds!.includes(dog.breed))
    }

    if (filters.ageMin !== undefined) {
      filtered = filtered.filter((dog) => dog.age >= filters.ageMin!)
    }

    if (filters.ageMax !== undefined) {
      filtered = filtered.filter((dog) => dog.age <= filters.ageMax!)
    }

    if (filters.zipCodes?.length) {
      filtered = filtered.filter((dog) =>
        filters.zipCodes!.includes(dog.zip_code)
      )
    }

    return filtered.length
  }, [
    favorites,
    filters.ageMax,
    filters.ageMin,
    filters.breeds,
    filters.zipCodes,
    showOnlyFavorites,
    total,
  ])

  const favoritesTotalPages = useMemo(() => {
    if (!showOnlyFavorites) return totalPages
    const pageSize = filters.size || DEFAULT_PAGE_SIZE
    return Math.ceil(filteredFavoritesTotal / pageSize)
  }, [filteredFavoritesTotal, filters.size, showOnlyFavorites, totalPages])

  const favoritesCurrentPage = useMemo(() => {
    if (!showOnlyFavorites) return currentPage
    const pageSize = filters.size || DEFAULT_PAGE_SIZE
    return Math.floor((filters.from || 0) / pageSize) + 1
  }, [currentPage, filters.from, filters.size, showOnlyFavorites])

  const favoritesHasNext = useMemo(() => {
    if (!showOnlyFavorites) return hasNext
    return favoritesCurrentPage < favoritesTotalPages
  }, [favoritesCurrentPage, favoritesTotalPages, hasNext, showOnlyFavorites])

  const favoritesHasPrev = useMemo(() => {
    if (!showOnlyFavorites) return hasPrev
    return favoritesCurrentPage > 1
  }, [favoritesCurrentPage, hasPrev, showOnlyFavorites])

  const handleBreedsChange = (options: BreedOption[]) => {
    updateFilters({
      breeds: options.map((option) => option.value),
    })
  }

  const handleNextPage = () => {
    if (showOnlyFavorites) {
      const pageSize = filters.size || DEFAULT_PAGE_SIZE
      const nextFrom = (filters.from || 0) + pageSize
      updateFilters({ from: nextFrom })
    } else {
      nextPage()
    }
  }

  const handlePrevPage = () => {
    if (showOnlyFavorites) {
      const pageSize = filters.size || DEFAULT_PAGE_SIZE
      const prevFrom = Math.max(0, (filters.from || 0) - pageSize)
      updateFilters({ from: prevFrom })
    } else {
      prevPage()
    }
  }

  const toggleFavoritesMode = () => {
    const newMode = !showOnlyFavorites

    if (newMode && filters.breeds?.length) {
      const hasInvalidBreed = filters.breeds.some(
        (breed) => !favBreeds.includes(breed)
      )

      if (hasInvalidBreed) {
        updateFilters({ breeds: [] })
      }
    }

    if (newMode) {
      updateFilters({ from: 0 })
    } else {
      updateFilters({ from: 0 })
    }

    setShowOnlyFavorites(newMode)
  }

  const handleMatch = async () => {
    if (favCount === 0) {
      toast({
        title: "Error",
        description: "Please select at least one dog to match with",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const favoriteIds = favorites.map((dog: Dog) => dog.id)
      const { match } = await getMatch(favoriteIds)

      const matchedDog = favorites.find((dog: Dog) => dog.id === match)

      if (matchedDog) {
        setMatchedDog(matchedDog)

        toast({
          title: "It's a match! 🎉",
          description: `You've been matched with ${matchedDog.name}!`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate match",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    if (showOnlyFavorites && favoritesCurrentPage > 1) {
      if (displayedDogs.length === 0 && filteredFavoritesTotal > 0) {
        const pageSize = filters.size || DEFAULT_PAGE_SIZE
        const prevFrom = Math.max(0, (filters.from || 0) - pageSize)
        updateFilters({ from: prevFrom })
      }
    }
  }, [
    showOnlyFavorites,
    displayedDogs.length,
    favoritesCurrentPage,
    filteredFavoritesTotal,
    filters.size,
    filters.from,
    updateFilters,
  ])

  return (
    <Container maxW="container.xl" py={8}>
      <Stack direction="column" spacing={8}>
        <AppHeader onLogout={logout} />
        <AnimatePresence>
          {matchedDog && (
            <MatchBanner dog={matchedDog} onClose={() => setMatchedDog(null)} />
          )}
        </AnimatePresence>
        <SearchControls
          breedOptions={breedOptions}
          selectedBreeds={selectedBreedOptions}
          onBreedsChange={handleBreedsChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={setSortField}
          onSortToggle={toggleSort}
          onMatchClick={handleMatch}
          matchCount={favCount}
          disableMatch={!favCount}
          showingFavorites={showOnlyFavorites}
          ageMin={filters.ageMin}
          ageMax={filters.ageMax}
          zipCode={filters.zipCodes?.[0]}
          onAgeFilterChange={(min, max) => {
            updateFilters({
              ageMin: min,
              ageMax: max,
            })
          }}
          onZipCodeChange={(zip) => {
            updateFilters({
              zipCodes: zip ? [zip] : undefined,
            })
          }}
        />
        <FavoritesToggle
          isChecked={showOnlyFavorites}
          onChange={toggleFavoritesMode}
        />
        {showOnlyFavorites && favCount === 0 ? (
          <EmptyFavorites
            onShowAllDogsClick={() => setShowOnlyFavorites(false)}
          />
        ) : (
          <Box>
            {displayedDogs.length === 0 && !isSearching ? (
              <Box
                textAlign="center"
                bg="white"
                p={10}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  No matching dogs found
                </Text>
                <Text color="gray.600" mb={4}>
                  Try adjusting your filters or sorting criteria
                </Text>
                <Button
                  colorScheme="brand"
                  onClick={() => {
                    updateFilters({
                      breeds: [],
                      ageMin: undefined,
                      ageMax: undefined,
                      zipCodes: undefined,
                      sort: "breed:asc",
                    })
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <DogCardGrid
                dogs={displayedDogs}
                isLoading={isSearching}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFav}
              />
            )}
            <Box mt={6} width="100%">
              <Pagination
                isLoading={isSearching}
                currentPage={
                  showOnlyFavorites ? favoritesCurrentPage : currentPage
                }
                totalPages={
                  showOnlyFavorites ? favoritesTotalPages : totalPages
                }
                total={showOnlyFavorites ? filteredFavoritesTotal : total}
                showOnlyFavorites={showOnlyFavorites}
                favCount={favCount}
                hasNext={showOnlyFavorites ? favoritesHasNext : hasNext}
                hasPrev={showOnlyFavorites ? favoritesHasPrev : hasPrev}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  )
}
