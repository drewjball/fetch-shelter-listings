import { Box, Button, Flex, HStack, IconButton } from "@chakra-ui/react"
import { FaHeart, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"

import { BreedOption } from "../../types"
import { Select } from "chakra-react-select"

interface SearchControlsProps {
  breedOptions: BreedOption[]
  selectedBreed: BreedOption | null
  onBreedChange: (option: BreedOption | null) => void
  sortDirection: "asc" | "desc"
  onSortToggle: () => void
  onMatchClick: () => void
  matchCount: number
  disableMatch: boolean
  showingFavorites: boolean
}

export const SearchControls = ({
  breedOptions,
  selectedBreed,
  onBreedChange,
  sortDirection,
  onSortToggle,
  onMatchClick,
  matchCount,
  disableMatch,
  showingFavorites,
}: SearchControlsProps) => {
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: "gray.300",
      _focus: {
        borderColor: "brand.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      bg: state.isSelected
        ? "brand.500"
        : state.isFocused
        ? "brand.50"
        : "white",
      color: state.isSelected ? "white" : "gray.800",
    }),
  }

  return (
    <Flex
      w="full"
      direction={{ base: "column", md: "row" }}
      gap={4}
      align={{ base: "stretch", md: "center" }}
      bg="white"
      p={4}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Box flex={{ base: "1", md: "3" }}>
        <Select<BreedOption, false>
          placeholder={
            showingFavorites
              ? "Filter your favorites by breed"
              : "Find a breed..."
          }
          options={breedOptions}
          value={selectedBreed}
          onChange={onBreedChange}
          isClearable
          chakraStyles={customSelectStyles}
          size="lg"
          maxMenuHeight={300}
          menuPlacement="auto"
        />
      </Box>
      <HStack spacing={3} flex="1">
        {!showingFavorites && (
          <IconButton
            aria-label={
              sortDirection === "desc" ? "Sort ascending" : "Sort descending"
            }
            icon={
              sortDirection === "desc" ? (
                <FaSortAlphaDown size="1.2rem" />
              ) : (
                <FaSortAlphaUp size="1.2rem" />
              )
            }
            onClick={onSortToggle}
            size="lg"
            colorScheme="accent"
            variant="outline"
          />
        )}
        <Button
          colorScheme="brand"
          size="lg"
          leftIcon={<FaHeart />}
          onClick={onMatchClick}
          isDisabled={disableMatch}
          flex="1"
        >
          Match ({matchCount})
        </Button>
      </HStack>
    </Flex>
  )
}
