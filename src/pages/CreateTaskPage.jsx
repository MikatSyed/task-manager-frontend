"use client"

import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AppProvider } from "@shopify/polaris"
import enTranslations from "@shopify/polaris/locales/en.json"
import { TaskContext } from "../../context/TaskContext"
import CreateTaskPage from "../../pages/CreateTaskPage"
import { jest } from "@jest/globals"

// Mock the TaskForm component
jest.mock("../../components/TaskForm", () => {
  return function MockTaskForm({ onSubmit, isLoading, formTitle, error }) {
    return (
      <div data-testid="task-form">
        <h2>{formTitle}</h2>
        <div>Loading: {isLoading.toString()}</div>
        {error && <div>Error: {error}</div>}
        <button onClick={() => onSubmit({ name: "Test Task" })}>Submit Form</button>
      </div>
    )
  }
})

// Mock Polaris components and icons
jest.mock("@shopify/polaris-icons", () => ({
  CalendarIcon: "CalendarIcon",
  CheckIcon: "CheckIcon",
  AlertCircleIcon: "AlertCircleIcon",
  ChevronDownIcon: "ChevronDownIcon",
  ChevronUpIcon: "ChevronUpIcon",
  PlusIcon: "PlusIcon",
  EditIcon: "EditIcon",
  DeleteIcon: "DeleteIcon",
  ClockIcon: "ClockIcon",
  SearchIcon: "SearchIcon",
  FilterIcon: "FilterIcon",
  SortAscendingIcon: "SortAscendingIcon",
  SortDescendingIcon: "SortDescendingIcon",
  HomeIcon: "HomeIcon",
}))

describe("CreateTaskPage Component", () => {
  const mockCreateTask = jest.fn()

  const mockContextValue = {
    createTask: mockCreateTask,
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <AppProvider i18n={enTranslations}>
        <MemoryRouter>
          <TaskContext.Provider value={contextValue}>
            <CreateTaskPage />
          </TaskContext.Provider>
        </MemoryRouter>
      </AppProvider>,
    )
  }

  test("renders page title and form", () => {
    renderWithContext()

    // Check page title
    expect(screen.getByText("Create New Task")).toBeInTheDocument()

    // Check form title
    expect(screen.getByText("Task Details")).toBeInTheDocument()
  })

  test("passes loading state to form", () => {
    renderWithContext({
      ...mockContextValue,
      loading: true,
    })

    // Check loading state
    expect(screen.getByText("Loading: true")).toBeInTheDocument()
  })

  test("passes error to form", () => {
    renderWithContext({
      ...mockContextValue,
      error: "Test error message",
    })

    // Check error message
    expect(screen.getByText("Error: Test error message")).toBeInTheDocument()
  })

  test("calls createTask when form is submitted", () => {
    renderWithContext()

    // Submit the form
    screen.getByText("Submit Form").click()

    // Check if createTask was called with the correct data
    expect(mockCreateTask).toHaveBeenCalledWith({ name: "Test Task" })
  })
})
