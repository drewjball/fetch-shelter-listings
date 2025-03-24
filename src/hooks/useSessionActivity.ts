import { useCallback, useEffect, useRef } from "react"

import { useAuth } from "./useAuth"

const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
]

export const useSessionActivity = () => {
  const { isAuthenticated, sessionExpiring } = useAuth()
  const lastActivityTime = useRef<number>(Date.now())

  const handleUserActivity = useCallback(() => {
    const now = Date.now()
    lastActivityTime.current = now
  }, [sessionExpiring])

  useEffect(() => {
    if (!isAuthenticated) return

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true })
    })

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleUserActivity)
      })
    }
  }, [isAuthenticated, handleUserActivity])
}
