import { Button, Flex, Text } from "@chakra-ui/react"

interface PaginationProps {
  isLoading: boolean
  currentPage: number
  totalPages: number
  total: number
  showOnlyFavorites: boolean
  favCount: number
  hasNext: boolean
  hasPrev: boolean
  onNextPage: () => void
  onPrevPage: () => void
}

export const Pagination = ({
  isLoading,
  currentPage,
  totalPages,
  total,
  showOnlyFavorites,
  favCount,
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
}: PaginationProps) => {
  return (
    <Flex w="full" justify="center" align="center" py={6}>
      {isLoading ? (
        <Text fontWeight="medium" color="gray.600">
          Loading...
        </Text>
      ) : showOnlyFavorites && total === favCount && totalPages <= 1 ? (
        <Text fontWeight="medium" color="gray.600">
          Showing {favCount} favorites
        </Text>
      ) : (
        <Flex justify="center" align="center" gap={{ base: 3, md: 6 }}>
          <Button
            size="md"
            onClick={onPrevPage}
            isDisabled={!hasPrev}
            variant="outline"
            colorScheme="brand"
            minW="90px"
          >
            Previous
          </Button>
          <Flex align="center" minW="100px" justify="center">
            <Text fontWeight="medium" textAlign="center">
              <Text as="span" fontWeight="bold" color="brand.600">
                {currentPage}
              </Text>{" "}
              of{" "}
              <Text as="span" fontWeight="bold" color="brand.600">
                {totalPages}
              </Text>
              <Text as="span" fontSize="sm" color="gray.500" display="block">
                ({total} dogs)
              </Text>
            </Text>
          </Flex>
          <Button
            size="md"
            onClick={onNextPage}
            isDisabled={!hasNext}
            variant="outline"
            colorScheme="brand"
            minW="90px"
          >
            Next
          </Button>
        </Flex>
      )}
    </Flex>
  )
}
