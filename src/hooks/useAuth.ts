import { login as apiLogin, logout as apiLogout } from "../services/api/api"
import { useCallback, useEffect, useState } from "react"

import { LoginCredentials } from "../types"
import { useNavigate } from "react-router-dom"

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem("isAuthenticated") === "true"
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.setItem("isAuthenticated", String(isAuthenticated))
  }, [isAuthenticated])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      setError(null)
      try {
        await apiLogin(credentials)
        setIsAuthenticated(true)
        sessionStorage.setItem("isAuthenticated", "true")
        setTimeout(() => {
          navigate("/search")
        }, 100)
      } catch (err: any) {
        console.error("Login error:", err)
        setError(
          err.response?.data?.message ||
            "Failed to login. Please check your credentials and try again."
        )
        setIsAuthenticated(false)
        sessionStorage.removeItem("isAuthenticated")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await apiLogout()
      setIsAuthenticated(false)
      sessionStorage.removeItem("isAuthenticated")
      navigate("/")
    } catch (err: any) {
      console.error("Logout error:", err)
      setError(
        err.response?.data?.message || "Failed to logout. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  }
}
