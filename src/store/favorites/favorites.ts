import { createJSONStorage, persist } from "zustand/middleware"

import { Dog } from "../../types"
import { create } from "zustand"

interface FavoritesState {
  favorites: Dog[]
  toggleFavorite: (dog: Dog) => void
  addFavorite: (dog: Dog) => void
  removeFavorite: (id: string) => void
}

const getOldFavorites = (): Dog[] => {
  try {
    const oldFavorites = localStorage.getItem("favorite-dogs")
    if (!oldFavorites) return []

    const parsed = JSON.parse(oldFavorites)
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      Array.isArray(parsed[0])
    ) {
      return parsed.map((p) => p[1])
    }
    return []
  } catch (e) {
    return []
  }
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: getOldFavorites(),
      addFavorite: (dog: Dog) =>
        set((state) => ({
          favorites: [...state.favorites.filter((d) => d.id !== dog.id), dog],
        })),
      removeFavorite: (id: string) =>
        set((state) => ({
          favorites: state.favorites.filter((d) => d.id !== id),
        })),
      toggleFavorite: (dog: Dog) =>
        set((state) => {
          const exists = state.favorites.some((d) => d.id === dog.id)
          return {
            favorites: exists
              ? state.favorites.filter((d) => d.id !== dog.id)
              : [...state.favorites, dog],
          }
        }),
    }),
    {
      name: "favorite-dogs",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
