import { Button, Flex, Heading, IconButton } from "@chakra-ui/react"
import { FaPaw, FaSignOutAlt } from "react-icons/fa"

interface AppHeaderProps {
  onLogout: () => void
  title?: string
}

export const AppHeader = ({
  onLogout,
  title = "Dog Finder",
}: AppHeaderProps) => {
  return (
    <Flex
      w="full"
      justify="space-between"
      align="center"
      borderBottomWidth="1px"
      borderColor="gray.200"
      pb={4}
    >
      <Flex align="center">
        <IconButton
          aria-label="Logo"
          icon={<FaPaw size="1.5rem" />}
          variant="ghost"
          colorScheme="brand"
          mr={3}
          size="lg"
          isRound
        />
        <Heading size="lg" color="brand.600">
          {title}
        </Heading>
      </Flex>
      <Button
        leftIcon={<FaSignOutAlt />}
        variant="outline"
        onClick={onLogout}
        colorScheme="brand"
      >
        Logout
      </Button>
    </Flex>
  )
}
