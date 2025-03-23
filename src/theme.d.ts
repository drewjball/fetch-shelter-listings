import "@chakra-ui/react"

declare module "@chakra-ui/react" {
  interface ThemeConfig {
    initialColorMode: "light" | "dark"
    useSystemColorMode: boolean
  }
}

declare module "*.ts" {
  const value: any
  export default value
}
