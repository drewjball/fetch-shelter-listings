import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ChangeEvent, FormEvent } from "react"

interface LoginFormProps {
  name: string
  email: string
  error: string | null
  isLoading: boolean
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent) => void
}

export const LoginForm = ({
  name,
  email,
  error,
  isLoading,
  onNameChange,
  onEmailChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      p={8}
      borderWidth={1}
      borderRadius="xl"
      borderColor="gray.200"
      boxShadow="lg"
      bg="white"
      w="full"
      maxW="450px"
    >
      <Stack direction="column" spacing={5}>
        <FormControl isRequired>
          <FormLabel fontWeight="600">Your Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Enter your name"
            size="lg"
            borderRadius="md"
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight="600">Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email"
            size="lg"
            borderRadius="md"
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
        </FormControl>
        {error && (
          <Text color="red.500" fontSize="sm" fontWeight="medium">
            {error}
          </Text>
        )}
        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          width="full"
          isLoading={isLoading}
          loadingText="Signing in"
          mt={2}
          fontSize="md"
          fontWeight="bold"
        >
          Start Finding Dogs
        </Button>
      </Stack>
    </Box>
  )
}
