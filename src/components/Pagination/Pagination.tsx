import { Button, Flex, HStack, Text } from "@chakra-ui/react"

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
    <Flex
      w="full"
      justify="space-between"
      align="center"
      bg="white"
      p={3}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Text fontWeight="medium" color="gray.600">
        {isLoading ? (
          "Loading..."
        ) : showOnlyFavorites ? (
          <>Showing {favCount} favorites</>
        ) : (
          <>
            Page{" "}
            <Text as="span" fontWeight="bold" color="brand.600">
              {currentPage}
            </Text>{" "}
            of{" "}
            <Text as="span" fontWeight="bold" color="brand.600">
              {totalPages}
            </Text>{" "}
            <Text as="span" fontSize="sm" color="gray.500">
              ({total} dogs)
            </Text>
          </>
        )}
      </Text>
      {!showOnlyFavorites && (
        <HStack spacing={2}>
          <Button
            size="md"
            onClick={onPrevPage}
            isDisabled={!hasPrev}
            variant="outline"
            colorScheme="brand"
          >
            Previous
          </Button>
          <Button
            size="md"
            onClick={onNextPage}
            isDisabled={!hasNext}
            variant="outline"
            colorScheme="brand"
          >
            Next
          </Button>
        </HStack>
      )}
    </Flex>
  )
}
