import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import {
  FaChevronDown,
  FaFilter,
  FaHeart,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa"
import { useEffect, useState } from "react"

import { BreedOption } from "../../types"
import { Select } from "chakra-react-select"

interface SearchControlsProps {
  breedOptions: BreedOption[]
  selectedBreeds: BreedOption[]
  onBreedsChange: (options: BreedOption[]) => void
  sortField: string
  sortDirection: "asc" | "desc"
  onSortFieldChange: (field: string) => void
  onSortToggle: () => void
  onMatchClick: () => void
  matchCount: number
  disableMatch: boolean
  showingFavorites: boolean
  ageMin?: number
  ageMax?: number
  zipCode?: string
  onAgeFilterChange: (min?: number, max?: number) => void
  onZipCodeChange: (zipCode?: string) => void
}

export const SearchControls = ({
  breedOptions,
  selectedBreeds,
  onBreedsChange,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortToggle,
  onMatchClick,
  matchCount,
  disableMatch,
  showingFavorites,
  ageMin,
  ageMax,
  zipCode,
  onAgeFilterChange,
  onZipCodeChange,
}: SearchControlsProps) => {
  const [zipInput, setZipInput] = useState(zipCode || "")

  useEffect(() => {
    if (sortField === "breed" && selectedBreeds.length === 1) {
      onSortFieldChange("name")
    }
  }, [selectedBreeds.length, sortField, onSortFieldChange])

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

  const sortFieldLabels: Record<string, string> = {
    breed: "Breed",
    name: "Name",
    age: "Age",
  }

  const hasAgeFilters = ageMin !== undefined || ageMax !== undefined
  const hasZipFilter = zipCode !== undefined && zipCode !== ""
  const hasBreedFilters = selectedBreeds.length > 0
  const hasFilters = hasAgeFilters || hasZipFilter || hasBreedFilters

  const handleZipSubmit = () => {
    onZipCodeChange(zipInput.trim() || undefined)
  }

  const handleZipKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleZipSubmit()
    }
  }

  const handleClearAllFilters = () => {
    onBreedsChange([])
    onAgeFilterChange(undefined, undefined)
    onZipCodeChange(undefined)
    setZipInput("")
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
      <Box flex={{ base: "1", md: "3" }} mb={{ base: 2, md: 0 }}>
        <Select<BreedOption, true>
          placeholder={
            showingFavorites ? "Filter your favorites..." : "Select breeds..."
          }
          options={breedOptions}
          value={selectedBreeds}
          onChange={(newValue) => onBreedsChange(newValue ? [...newValue] : [])}
          isClearable
          isMulti
          chakraStyles={customSelectStyles}
          size="lg"
          maxMenuHeight={300}
          menuPlacement="auto"
          closeMenuOnSelect={false}
        />
      </Box>
      <Flex
        direction={{ base: "column", md: "row" }}
        width="full"
        flex="1"
        alignItems={{ md: "center" }}
        justifyContent={{ md: "flex-end" }}
        gap={{ base: 2, md: 3 }}
      >
        <Flex
          alignItems="center"
          gap={{ base: 2, md: 3 }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              size="lg"
              variant="outline"
              colorScheme="accent"
              width={{ base: "auto", md: "auto" }}
              flexGrow={{ base: 1, md: 0 }}
            >
              Sort: {sortFieldLabels[sortField] || "Name"}
            </MenuButton>
            <MenuList>
              {selectedBreeds.length !== 1 && (
                <MenuItem onClick={() => onSortFieldChange("breed")}>
                  Breed
                </MenuItem>
              )}
              <MenuItem onClick={() => onSortFieldChange("name")}>
                Name
              </MenuItem>
              <MenuItem onClick={() => onSortFieldChange("age")}>Age</MenuItem>
            </MenuList>
          </Menu>
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
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <IconButton
                aria-label="Filter options"
                icon={<FaFilter size="1.2rem" />}
                size="lg"
                colorScheme="accent"
                variant={hasFilters ? "solid" : "outline"}
              />
            </PopoverTrigger>
            <PopoverContent width="300px">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Filter Options</PopoverHeader>
              <PopoverBody>
                <FormControl mb={4}>
                  <FormLabel fontWeight="medium">Age Range (years)</FormLabel>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <FormLabel fontSize="sm">Min</FormLabel>
                      <NumberInput
                        min={0}
                        max={20}
                        value={ageMin ?? ""}
                        onChange={(_, value) => {
                          const newMin = isNaN(value) ? undefined : value
                          onAgeFilterChange(newMin, ageMax)
                        }}
                      >
                        <NumberInputField placeholder="Min" />
                      </NumberInput>
                    </Box>
                    <Box>
                      <FormLabel fontSize="sm">Max</FormLabel>
                      <NumberInput
                        min={0}
                        max={20}
                        value={ageMax ?? ""}
                        onChange={(_, value) => {
                          const newMax = isNaN(value) ? undefined : value
                          onAgeFilterChange(ageMin, newMax)
                        }}
                      >
                        <NumberInputField placeholder="Max" />
                      </NumberInput>
                    </Box>
                  </SimpleGrid>
                </FormControl>
                <Divider my={3} />
                <FormControl>
                  <FormLabel fontWeight="medium">Zip Code</FormLabel>
                  <HStack>
                    <Input
                      placeholder="Enter zip code"
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value)}
                      onKeyPress={handleZipKeyPress}
                    />
                    <Button onClick={handleZipSubmit}>Apply</Button>
                  </HStack>
                  {zipCode && (
                    <Text mt={2} fontSize="sm" color="gray.600">
                      Showing results for zip:{" "}
                      <Text as="span" fontWeight="bold">
                        {zipCode}
                      </Text>
                    </Text>
                  )}
                </FormControl>

                {hasFilters && (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    mt={4}
                    onClick={handleClearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
        <Button
          colorScheme="brand"
          size="lg"
          leftIcon={<FaHeart />}
          onClick={onMatchClick}
          isDisabled={disableMatch}
          width={{ base: "100%", md: "auto" }}
          flexShrink={0}
        >
          Match ({matchCount})
        </Button>
      </Flex>
    </Flex>
  )
}
