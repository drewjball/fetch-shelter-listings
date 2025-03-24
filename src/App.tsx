import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom"

import { Analytics } from "@vercel/analytics/react"
import { ChakraProvider } from "@chakra-ui/react"
import { LoginPage } from "./pages/LoginPage/LoginPage"
import { SearchPage } from "./pages/SearchPage/SearchPage"
import { SessionTimeoutWarning } from "./components/SessionTimeoutWarning/SessionTimeoutWarning"
import { theme } from "./theme"
import { useAuth } from "./hooks/useAuth"
import { useSessionActivity } from "./hooks/useSessionActivity"

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  useSessionActivity()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return (
    <>
      {children}
      <SessionTimeoutWarning />
    </>
  )
}

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/search"
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <LoginPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Analytics />
      </Router>
    </ChakraProvider>
  )
}
