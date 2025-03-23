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
      p={6}
      w="full"
      borderWidth={2}
      borderColor="brand.500"
      borderRadius="xl"
      bg="background.tertiary"
      boxShadow="lg"
    >
      <Flex direction={{ base: "column", md: "row" }} align="center" gap={6}>
        <Image
          src={dog.img}
          alt={dog.name}
          borderRadius="lg"
          maxH="300px"
          objectFit="cover"
          boxShadow="md"
          flex="1"
        />
        <VStack align="flex-start" spacing={4} flex="2">
          <Heading size="xl" color="brand.700" fontWeight="extrabold">
            You've been matched with {dog.name}!
          </Heading>
          <Text fontSize="lg">
            {dog.name} is a {dog.age === 0 ? "< 1" : dog.age} year old{" "}
            {dog.breed} who can't wait to meet you!
          </Text>
          <HStack>
            <Badge colorScheme="brand" fontSize="md" px={3} py={1}>
              {dog.breed}
            </Badge>
            <Badge colorScheme="accent" fontSize="md" px={3} py={1}>
              {dog.age === 0 ? "< 1" : dog.age} years old
            </Badge>
            <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
              ZIP: {dog.zip_code}
            </Badge>
          </HStack>
          <Text fontSize="md" color="gray.600">
            This match was made based on your favorites. We think you and{" "}
            {dog.name} will be perfect together!
          </Text>
          <Button
            leftIcon={<FaDog />}
            colorScheme="brand"
            size="lg"
            onClick={onClose}
          >
            Continue Searching
          </Button>
        </VStack>
      </Flex>
    </MotionBox>
  )
}
