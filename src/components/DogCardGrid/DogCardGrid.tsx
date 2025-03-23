import { Grid, SimpleGrid } from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion"
import { DogCard } from "../DogCard/DogCard"
import { DogCardSkeleton } from "../DogCardSkeleton/DogCardSkeleton"
import { Dog } from "../../types"

interface DogCardGridProps {
  dogs: Dog[]
  isLoading: boolean
  isFavorite: (id: string) => boolean
  onToggleFavorite: (dog: Dog) => void
}

export const DogCardGrid = ({
  dogs,
  isLoading,
  isFavorite,
  onToggleFavorite,
}: DogCardGridProps) => {
  if (isLoading) {
    return (
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {[...Array(6)].map((_, i) => (
          <DogCardSkeleton key={i} />
        ))}
      </Grid>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
      <AnimatePresence>
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            isFavorite={isFavorite(dog.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </SimpleGrid>
  )
}
