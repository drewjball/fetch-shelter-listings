import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken,
} from "../services/api"
import { useCallback, useEffect, useRef, useState } from "react"

import { LoginCredentials } from "../types"
import { useNavigate } from "react-router-dom"

const SESSION_TIMEOUT = 60 * 60 * 1000
const WARNING_TIME = 5 * 60 * 1000

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem("isAuthenticated") === "true"
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionExpiring, setSessionExpiring] = useState<boolean>(false)
  const navigate = useNavigate()

  const logoutRef = useRef<() => Promise<void>>()
  const checkSessionRef = useRef<() => void>()

  useEffect(() => {
    if (!isAuthenticated) return

    const loginTime = sessionStorage.getItem("loginTime")
    if (!loginTime) return

    const checkSessionStatus = () => {
      const now = Date.now()
      const loginTimeValue = parseInt(
        sessionStorage.getItem("loginTime") || "0",
        10
      )
      const elapsedTime = now - loginTimeValue
      const remainingTime = SESSION_TIMEOUT - elapsedTime

      if (remainingTime > 0 && remainingTime < WARNING_TIME) {
        setSessionExpiring(true)
      } else if (remainingTime <= 0) {
        logoutRef.current?.()
      } else {
        setSessionExpiring(false)
      }
    }

    checkSessionRef.current = checkSessionStatus

    const interval = setInterval(checkSessionStatus, 5000)

    checkSessionStatus()

    return () => clearInterval(interval)
  }, [isAuthenticated])

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
        setSessionExpiring(false)

        const loginTime = Date.now().toString()
        sessionStorage.setItem("loginTime", loginTime)
        sessionStorage.setItem("isAuthenticated", "true")
        sessionStorage.setItem("userName", credentials.name)
        sessionStorage.setItem("userEmail", credentials.email)

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
        sessionStorage.removeItem("loginTime")
        sessionStorage.removeItem("userName")
        sessionStorage.removeItem("userEmail")
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
      setSessionExpiring(false)
      sessionStorage.removeItem("isAuthenticated")
      sessionStorage.removeItem("loginTime")
      sessionStorage.removeItem("userName")
      sessionStorage.removeItem("userEmail")
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

  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  const getRemainingSessionTime = useCallback(() => {
    const loginTime = sessionStorage.getItem("loginTime")
    if (!loginTime) return 0

    const elapsedTime = Date.now() - parseInt(loginTime, 10)
    const remainingTime = Math.max(0, SESSION_TIMEOUT - elapsedTime)

    return Math.ceil(remainingTime / 1000)
  }, [])

  const extendSession = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true)
      try {
        await refreshToken()
        const now = Date.now()
        sessionStorage.setItem("loginTime", now.toString())
        setSessionExpiring(false)
        setTimeout(() => {
          checkSessionRef.current?.()
        }, 100)
      } catch (err) {
        console.error("Failed to extend session:", err)
        setSessionExpiring(true)
      } finally {
        setIsLoading(false)
      }
    }
  }, [isAuthenticated])

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    sessionExpiring,
    getRemainingSessionTime,
    extendSession,
    sessionTimeout: SESSION_TIMEOUT,
    warningTime: WARNING_TIME,
  }
}
