import { extendTheme } from "@chakra-ui/react"

const colors = {
  brand: {
    50: "#FFF5E6",
    100: "#FFE6BF",
    200: "#FFD699",
    300: "#FFC773",
    400: "#FFB84D",
    500: "#FFA826",
    600: "#E69219",
    700: "#CC7D0C",
    800: "#B36800",
    900: "#995700",
  },
  accent: {
    50: "#E6F9FF",
    100: "#B3EBFF",
    200: "#80DEFF",
    300: "#4DD2FF",
    400: "#1AC5FF",
    500: "#00B8F0",
    600: "#0095CC",
    700: "#0073A8",
    800: "#005285",
    900: "#003861",
  },
  background: {
    primary: "#FFFAF0",
    secondary: "#FFF5E6",
    tertiary: "#FFEDD6",
  },
}

interface ButtonVariantProps {
  colorScheme: string
  [key: string]: any
}

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors,
  fonts: {
    heading: "'Nunito', sans-serif",
    body: "'Open Sans', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "background.primary",
        color: "gray.800",
      },
      a: {
        _focus: {
          boxShadow: "0 0 0 3px rgba(255, 168, 38, 0.6)",
          outline: "none",
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "md",
        _focus: {
          boxShadow: "0 0 0 3px rgba(255, 168, 38, 0.6)",
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        solid: (props: ButtonVariantProps) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.600" : undefined,
            transform: "translateY(-2px)",
            boxShadow: "md",
          },
          transition: "all 0.2s ease-in-out",
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "lg",
          overflow: "hidden",
          boxShadow: "md",
          transition: "all 0.3s ease",
          _hover: {
            boxShadow: "lg",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "gray.800",
        fontWeight: "700",
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        px: 3,
        py: 1,
        fontWeight: "600",
      },
    },
  },
  layerStyles: {
    card: {
      bg: "white",
      borderRadius: "lg",
      boxShadow: "md",
      overflow: "hidden",
      transition: "all 0.3s ease",
      _hover: {
        boxShadow: "lg",
        transform: "translateY(-4px)",
      },
    },
    cardSelected: {
      bg: "background.tertiary",
      borderRadius: "lg",
      boxShadow: "md",
      borderWidth: "2px",
      borderColor: "brand.500",
      overflow: "hidden",
    },
  },
})
