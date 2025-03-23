import {
  AppHeader,
  DogCardGrid,
  EmptyFavorites,
  FavoritesToggle,
  MatchBanner,
  Pagination,
  SearchControls,
} from "../components"
import { Box, Container, Stack, useToast } from "@chakra-ui/react"
import { useCallback, useMemo, useState } from "react"

import { AnimatePresence } from "framer-motion"
import { BreedOption } from "../types"
import { Dog } from "../types"
import { getMatch } from "../services/api/api"
import { useAuth } from "../hooks/useAuth"
import { useDogSearch } from "../hooks/useDogSearch"
import { useFavoritesStore } from "../store/favorites"

export const SearchPage = () => {
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

  const selectedBreedOption = useMemo<BreedOption | null>(() => {
    const selectedBreed = filters.breeds?.[0]
    return selectedBreed ? { value: selectedBreed, label: selectedBreed } : null
  }, [filters.breeds])

  const displayedDogs = useMemo(() => {
    if (!showOnlyFavorites) return dogs

    const result = filters.breeds?.length
      ? favorites.filter((d: Dog) => d.breed === filters.breeds![0])
      : favorites

    return result
  }, [dogs, favorites, filters.breeds, showOnlyFavorites])

  const handleBreedChange = (option: BreedOption | null) => {
    updateFilters({
      breeds: !option ? [] : [option.value],
    })
  }

  const toggleFavoritesMode = () => {
    const newMode = !showOnlyFavorites

    if (
      newMode &&
      filters.breeds?.length &&
      !favBreeds.includes(filters.breeds[0])
    ) {
      updateFilters({ breeds: [] })
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

  const sortDirection = (filters.sort || "").includes(":desc") ? "desc" : "asc"

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
          selectedBreed={selectedBreedOption}
          onBreedChange={handleBreedChange}
          sortDirection={sortDirection}
          onSortToggle={toggleSort}
          onMatchClick={handleMatch}
          matchCount={favCount}
          disableMatch={!favCount}
          showingFavorites={showOnlyFavorites}
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
            <DogCardGrid
              dogs={displayedDogs}
              isLoading={isSearching}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFav}
            />
            <Box mt={6}>
              <Pagination
                isLoading={isSearching}
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                showOnlyFavorites={showOnlyFavorites}
                favCount={favCount}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  )
}
