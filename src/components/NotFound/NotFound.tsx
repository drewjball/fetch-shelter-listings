import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react"

import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export const NotFound = () => {
  const { isAuthenticated } = useAuth()
  const redirectPath = isAuthenticated ? "/search" : "/"
  const redirectLabel = isAuthenticated ? "Return to Search" : "Return to Login"

  return (
    <Container maxW="container.xl" p={10}>
      <VStack spacing={8} align="center" justify="center" minH="80vh">
        <Box
          w="200px"
          h="200px"
          borderRadius="full"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Lost dog"
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </Box>
        <Heading as="h1" size="2xl" textAlign="center" color="brand.600">
          404: Page Not Found
        </Heading>
        <Text fontSize="xl" textAlign="center" maxW="600px">
          Oops! Looks like this dog has wandered off. We can't find the page
          you're looking for.
        </Text>
        <Button
          as={Link}
          to={redirectPath}
          colorScheme="brand"
          size="lg"
          mt={4}
        >
          {redirectLabel}
        </Button>
      </VStack>
    </Container>
  )
}
