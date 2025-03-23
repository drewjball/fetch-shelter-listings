import { Box, Skeleton, Stack } from "@chakra-ui/react"

export const DogCardSkeleton = () => {
  return (
    <Box borderRadius="lg" overflow="hidden" boxShadow="md">
      <Skeleton height="200px" data-testid="skeleton-image" />
      <Stack p={4} spacing={2}>
        <Skeleton height="24px" width="50%" data-testid="skeleton-title" />
        <Skeleton height="20px" width="70%" data-testid="skeleton-text-1" />
        <Skeleton height="20px" width="30%" data-testid="skeleton-text-2" />
      </Stack>
    </Box>
  )
}
