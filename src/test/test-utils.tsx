import { ChakraProvider } from "@chakra-ui/react"
import { render, RenderOptions } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ReactElement } from "react"
import { theme } from "../theme"

// Create a custom render function that wraps the component with all necessary providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    // Wrap component with all providers it might need
    wrapper: ({ children }) => (
      <ChakraProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ChakraProvider>
    ),
    ...options,
  })
}

// Re-export everything from testing-library
export * from "@testing-library/react"

// Override render method
export { customRender as render }
