import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import { FaHeart } from "react-icons/fa"

interface EmptyFavoritesProps {
  onShowAllDogsClick: () => void
}

export const EmptyFavorites = ({ onShowAllDogsClick }: EmptyFavoritesProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={12}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
    >
      <Box fontSize="5xl" mb={4} color="gray.400">
        <FaHeart />
      </Box>
      <Heading size="md" mb={2} color="gray.600">
        No favorites yet
      </Heading>
      <Text textAlign="center" color="gray.500">
        Click the heart icon on any dog to add them to your favorites
      </Text>
      <Button mt={6} colorScheme="brand" onClick={onShowAllDogsClick}>
        See All Dogs
      </Button>
    </Flex>
  )
}
