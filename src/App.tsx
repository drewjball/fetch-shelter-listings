import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom"

import { ChakraProvider } from "@chakra-ui/react"
import { LoginPage } from "./pages/LoginPage"
import { SearchPage } from "./pages/SearchPage"
import { theme } from "./theme"
import { useAuth } from "./hooks/useAuth"

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
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
      </Router>
    </ChakraProvider>
  )
}
