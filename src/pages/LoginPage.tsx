import { AuthLayout, LoginForm } from "../components"
import React, { FormEvent, useState } from "react"

import { useAuth } from "../hooks/useAuth"
import { useToast } from "@chakra-ui/react"

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    try {
      await login({ name, email })
    } catch (err) {
      console.error("Login submission error:", err)
    }
  }

  return (
    <AuthLayout
      title="Find Your Perfect Companion"
      subtitle="Start your journey to find a furry friend who's waiting just for you"
    >
      <LoginForm
        name={name}
        email={email}
        error={error}
        isLoading={isLoading}
        onNameChange={(e) => setName(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  )
}
