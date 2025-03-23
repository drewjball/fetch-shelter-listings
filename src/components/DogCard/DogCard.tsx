import {
  Badge,
  Box,
  HStack,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react"
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa"

import { Dog } from "../../types"
import { motion } from "framer-motion"

const MotionBox = motion(Box)

interface DogCardProps {
  dog: Dog
  isFavorite: boolean
  onToggleFavorite: (dog: Dog) => void
}

export const DogCard = ({
  dog,
  isFavorite,
  onToggleFavorite,
}: DogCardProps) => {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      layerStyle={isFavorite ? "cardSelected" : "card"}
      p={0}
      position="relative"
      overflow="hidden"
      role="group"
    >
      <Box position="relative" overflow="hidden" height="220px">
        <Image
          src={dog.img}
          alt={dog.name}
          objectFit="cover"
          w="full"
          h="full"
          transition="transform 0.3s ease"
          _groupHover={{ transform: "scale(1.05)" }}
        />
        <IconButton
          aria-label="Favorite"
          icon={<FaHeart size="1.2rem" />}
          position="absolute"
          top={4}
          right={4}
          colorScheme={isFavorite ? "brand" : "gray"}
          onClick={() => onToggleFavorite(dog)}
          isRound
          size="md"
          boxShadow="md"
          _hover={{
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        />
      </Box>
      <Stack
        direction="column"
        spacing={3}
        p={5}
        align="start"
        w="full"
        bg="white"
      >
        <Heading size="md" color="gray.800">
          {dog.name}
        </Heading>

        <HStack spacing={2} flexWrap="wrap">
          <Badge colorScheme="brand" fontSize="0.8rem" py={1} px={2}>
            {dog.breed}
          </Badge>
          <Badge colorScheme="accent" fontSize="0.8rem" py={1} px={2}>
            {dog.age === 0 ? "< 1" : dog.age} years
          </Badge>
        </HStack>
        <HStack fontSize="sm" color="gray.500">
          <FaMapMarkerAlt />
          <Text>ZIP: {dog.zip_code}</Text>
        </HStack>
      </Stack>
    </MotionBox>
  )
}
