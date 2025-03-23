import { Flex, Switch, Text } from "@chakra-ui/react"
import { FaFilter } from "react-icons/fa"

interface FavoritesToggleProps {
  isChecked: boolean
  onChange: () => void
}

export const FavoritesToggle = ({
  isChecked,
  onChange,
}: FavoritesToggleProps) => {
  return (
    <Flex
      align="center"
      bg="white"
      p={3}
      borderRadius="lg"
      boxShadow="sm"
      justify="space-between"
    >
      <Flex align="center">
        <FaFilter color="#FFA826" style={{ marginRight: "8px" }} />
        <Text fontWeight="medium">Show only my favorites</Text>
      </Flex>
      <Switch
        id="favorites-toggle"
        colorScheme="brand"
        size="lg"
        isChecked={isChecked}
        onChange={onChange}
      />
    </Flex>
  )
}
