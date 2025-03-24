import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"

import { Dog } from "../../types"
import { FaDog } from "react-icons/fa"
import { motion } from "framer-motion"

const MotionBox = motion(Box)

interface MatchBannerProps {
  dog: Dog
  onClose: () => void
}

export const MatchBanner = ({ dog, onClose }: MatchBannerProps) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      p={{ base: 4, md: 6 }}
      w="full"
      borderWidth={2}
      borderColor="brand.500"
      borderRadius="xl"
      bg="background.tertiary"
      boxShadow="lg"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "flex-start" }}
        gap={{ base: 4, md: 6 }}
      >
        <Box
          width={{ base: "full", md: "auto" }}
          maxW={{ base: "280px", md: "320px" }}
          textAlign="center"
        >
          <Image
            src={dog.img}
            alt={dog.name}
            borderRadius="lg"
            maxH={{ base: "200px", md: "300px" }}
            objectFit="cover"
            objectPosition="center 30%"
            boxShadow="md"
            mx="auto"
          />
        </Box>
        <VStack
          align={{ base: "center", md: "flex-start" }}
          spacing={{ base: 3, md: 4 }}
          flex="2"
          width="full"
        >
          <Heading
            size={{ base: "lg", md: "xl" }}
            color="brand.700"
            fontWeight="extrabold"
            textAlign={{ base: "center", md: "left" }}
          >
            You've been matched with {dog.name}!
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            textAlign={{ base: "center", md: "left" }}
          >
            {dog.name} is a {dog.age === 0 ? "< 1" : dog.age} year old{" "}
            {dog.breed} who can't wait to meet you!
          </Text>
          <Wrap
            spacing={2}
            justify={{ base: "center", md: "flex-start" }}
            width="full"
          >
            <WrapItem>
              <Badge colorScheme="brand" fontSize="md" px={3} py={1}>
                {dog.breed}
              </Badge>
            </WrapItem>
            <WrapItem>
              <Badge colorScheme="accent" fontSize="md" px={3} py={1}>
                {dog.age === 0 ? "< 1" : dog.age} years old
              </Badge>
            </WrapItem>
            <WrapItem>
              <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
                ZIP: {dog.zip_code}
              </Badge>
            </WrapItem>
          </Wrap>
          <Text
            fontSize="md"
            color="gray.600"
            textAlign={{ base: "center", md: "left" }}
            px={{ base: 2, md: 0 }}
          >
            This match was made based on your favorites. We think you and{" "}
            {dog.name} will be perfect together!
          </Text>
          <Button
            leftIcon={<FaDog />}
            colorScheme="brand"
            size="lg"
            onClick={onClose}
            width={{ base: "full", md: "auto" }}
            mt={{ base: 2, md: 0 }}
          >
            Continue Searching
          </Button>
        </VStack>
      </Flex>
    </MotionBox>
  )
}
