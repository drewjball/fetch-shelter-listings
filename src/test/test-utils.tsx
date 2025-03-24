import { RenderOptions, render } from "@testing-library/react"

import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { ReactElement } from "react"
import { theme } from "../theme"

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <ChakraProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ChakraProvider>
    ),
    ...options,
  })
}

export * from "@testing-library/react"

export { customRender as render }
