import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  ScaleFade,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ReactNode } from "react"
import { keyframes } from "@emotion/react"

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

interface AuthLayoutProps {
  title: string
  subtitle: string
  imageUrl?: string
  children: ReactNode
}

export const AuthLayout = ({
  title,
  subtitle,
  imageUrl = "https://images.unsplash.com/photo-1544568100-847a948585b9",
  children,
}: AuthLayoutProps) => {
  return (
    <Container maxW="container.lg" py={10} centerContent>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        w="full"
        gap={8}
      >
        <ScaleFade initialScale={0.9} in={true}>
          <Box
            animation={`${floatAnimation} 6s ease-in-out infinite`}
            display={{ base: "none", md: "block" }}
            maxW="md"
          >
            <Image
              src={imageUrl}
              alt="Happy dog"
              borderRadius="xl"
              shadow="xl"
              objectFit="cover"
              height="400px"
            />
          </Box>
        </ScaleFade>
        <Box flex="1" w={{ base: "full", md: "auto" }}>
          <Stack
            direction="column"
            spacing={8}
            align={{ base: "center", md: "flex-start" }}
          >
            <Box textAlign={{ base: "center", md: "left" }}>
              <Heading size="2xl" color="brand.600" lineHeight="1.2" mb={3}>
                {title}
              </Heading>
              <Text mt={2} color="gray.600" fontSize="lg">
                {subtitle}
              </Text>
            </Box>
            {children}
          </Stack>
        </Box>
      </Flex>
    </Container>
  )
}
