import { AppProvider, Frame } from "@shopify/polaris"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import enTranslations from "@shopify/polaris/locales/en.json"
import "@shopify/polaris/build/esm/styles.css"

// Import pages
import HomePage from "./pages/HomePage"
import CreateTaskPage from "./pages/CreateTaskPage"
import EditTaskPage from "./pages/EditTaskPage"

// Import context provider
import { TaskProvider } from "./context/TaskContext"

// Import custom styles
import "./styles/fonts.css"

function App() {
  // Custom theme for Polaris
  const theme = {
    colors: {
      surface: "#ffffff",
      onSurface: "#1e293b",
      interactive: "#6366f1",
      secondary: "#f59e0b",
      primary: "#6366f1",
      critical: "#ef4444",
      warning: "#f59e0b",
      highlight: "#10b981",
      success: "#10b981",
      decorative: "#4f46e5",
    },
  }

  return (
    <BrowserRouter>
      <AppProvider i18n={enTranslations} theme={theme}>
        <Frame>
          <TaskProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateTaskPage />} />
              <Route path="/edit/:id" element={<EditTaskPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TaskProvider>
        </Frame>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
