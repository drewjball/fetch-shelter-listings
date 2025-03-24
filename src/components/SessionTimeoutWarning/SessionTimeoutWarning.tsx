import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"

import { useAuth } from "../../hooks/useAuth"

export const SessionTimeoutWarning: React.FC = () => {
  const { sessionExpiring, getRemainingSessionTime, extendSession, logout } =
    useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [extending, setExtending] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (sessionExpiring && !isOpen) {
      onOpen()
    } else if (!sessionExpiring && isOpen) {
      onClose()
    }
  }, [sessionExpiring, isOpen, onOpen, onClose])

  useEffect(() => {
    if (!sessionExpiring) return

    const updateTime = () => {
      const time = getRemainingSessionTime()
      setRemainingTime(time)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [sessionExpiring, getRemainingSessionTime])

  const handleExtendSession = useCallback(async () => {
    try {
      setExtending(true)
      await extendSession()
      toast({
        title: "Session Extended!",
        description:
          "Your login has been refreshed with a new 1-hour token from the server.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      console.error("Error extending session:", error)
      if (error instanceof Error && error.message.includes("credentials")) {
        toast({
          title: "Authentication Required",
          description: "Please log in again to continue your session.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        setTimeout(() => logout(), 1000)
      } else {
        toast({
          title: "Error",
          description:
            "Could not extend your session. Please try logging in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    } finally {
      setExtending(false)
    }
  }, [extendSession, onClose, toast, logout])

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""}`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0
      ? `${minutes} minute${
          minutes !== 1 ? "s" : ""
        } and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
      : `${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  const formattedTime = formatTime(remainingTime)

  return (
    <>
      {sessionExpiring && !isOpen && (
        <Box position="fixed" bottom="20px" right="20px" zIndex={999}>
          <Alert status="warning" variant="solid" borderRadius="md">
            <AlertIcon />
            <AlertDescription mr={2}>
              Session expiring in {formattedTime}
            </AlertDescription>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleExtendSession}
              isLoading={extending}
              loadingText="Re-authenticating"
            >
              Extend
            </Button>
          </Alert>
        </Box>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Timeout Warning</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>Your session is about to expire!</AlertTitle>
                <AlertDescription>
                  For security reasons, your session will expire in{" "}
                  <strong>{formattedTime}</strong>.
                </AlertDescription>
              </Box>
            </Alert>
            <Box mb={4}>
              Please choose to extend your session or log out. If no action is
              taken, you will be automatically logged out when the session
              expires.
            </Box>
            <Box fontSize="sm" mb={3}>
              <Text fontWeight="bold" color="blue.600" mb={1}>
                How Session Extension Works:
              </Text>
              <Text color="gray.600">
                1. Your token from the server is valid for 1 hour
              </Text>
              <Text color="gray.600">
                2. When you click "Extend", we'll get a fresh 1-hour token from
                the server
              </Text>
              <Text color="gray.600">
                3. For testing, the client-side timer is set to just 1 minute
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={logout}>
              Log Out Now
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleExtendSession}
              isLoading={extending}
              loadingText="Re-authenticating"
            >
              Extend Session
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
