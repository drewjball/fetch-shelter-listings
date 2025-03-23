# 🐾 Fetch Dog Adoption

Find your perfect furry companion with our simple, modern adoption search tool.

## ✨ What This App Does

A friendly way to browse adoptable shelter dogs:

- **Browse dogs** by breed, see their age and location
- **Save favorites** to revisit and compare your top choices
- **Get matched** with a dog from your favorites
- **Sort and filter** to find exactly what you're looking for

## 🛠️ Tech Stack

- **React 18** with TypeScript for type safety
- **Chakra UI** for components
- **Zustand** for simple state management
- **Vite** for lightning-fast development

## 🚀 Quick Start

Getting started is easy:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 📋 Project Structure

```
src/
  ├── components/  # Reusable UI building blocks
  ├── pages/       # Main application screens
  ├── hooks/       # Custom React hooks for shared logic
  ├── services/    # API interaction and business logic
  ├── store/       # Zustand state management
  ├── types/       # TypeScript type definitions
```

## 👩‍💻 Development Notes

- User favorites persist between sessions using local storage
- No env variables needed - API connections are pre-configured
- Components are designed to be reusable with clear prop interfaces

## 📚 API

The app connects to the Fetch shelter dog API, which provides:

- Dog listings with filtering and pagination
- Breed information
- Dog matching algorithms
