"use client"

import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AppProvider } from "@shopify/polaris"
import enTranslations from "@shopify/polaris/locales/en.json"
import { TaskContext } from "../../context/TaskContext"
import EditTaskPage from "../../pages/EditTaskPage"
import { jest } from "@jest/globals"

// Mock the useParams hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
  MemoryRouter: jest.requireActual("react-router-dom").MemoryRouter,
}))

// Mock the TaskForm component
jest.mock("../../components/TaskForm", () => {
  return function MockTaskForm({ initialValues, onSubmit, isLoading, formTitle, error }) {
    return (
      <div data-testid="task-form">
        <h2>{formTitle}</h2>
        <div>Task Name: {initialValues?.name || "No task"}</div>
        <div>Loading: {isLoading.toString()}</div>
        {error && <div>Error: {error}</div>}
        <button onClick={() => onSubmit({ name: "Updated Task" })}>Submit Form</button>
      </div>
    )
  }
})

// Mock Polaris icons
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

describe("EditTaskPage Component", () => {
  const mockTask = {
    id: 1,
    name: "Test Task",
    description: "Test Description",
    status: "Pending",
  }

  const mockGetTask = jest.fn().mockResolvedValue(mockTask)
  const mockUpdateTask = jest.fn()
  const mockNavigate = jest.fn()

  const mockContextValue = {
    getTask: mockGetTask,
    updateTask: mockUpdateTask,
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate)
  })

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <AppProvider i18n={enTranslations}>
        <MemoryRouter>
          <TaskContext.Provider value={contextValue}>
            <EditTaskPage />
          </TaskContext.Provider>
        </MemoryRouter>
      </AppProvider>,
    )
  }

  test("renders loading state initially", () => {
    renderWithContext()

    // Check loading spinner
    expect(screen.getByText("Loading task details...")).toBeInTheDocument()
  })

  test("fetches task and renders form with task data", async () => {
    renderWithContext()

    // Wait for task to be fetched
    await waitFor(() => {
      expect(screen.getByText("Task Name: Test Task")).toBeInTheDocument()
    })

    // Check if getTask was called with the correct ID
    expect(mockGetTask).toHaveBeenCalledWith("1")
  })

  test("calls updateTask when form is submitted", async () => {
    renderWithContext()

    // Wait for task to be fetched
    await waitFor(() => {
      expect(screen.getByText("Task Name: Test Task")).toBeInTheDocument()
    })

    // Submit the form
    screen.getByText("Submit Form").click()

    // Check if updateTask was called with the correct data
    expect(mockUpdateTask).toHaveBeenCalledWith("1", { name: "Updated Task" })
  })

  test("redirects to home if task is not found", async () => {
    // Mock getTask to return null (task not found)
    const mockGetTaskNull = jest.fn().mockResolvedValue(null)

    renderWithContext({
      ...mockContextValue,
      getTask: mockGetTaskNull,
    })

    // Wait for navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/")
    })
  })

  test("passes error to form", async () => {
    renderWithContext({
      ...mockContextValue,
      error: "Test error message",
    })

    // Wait for task to be fetched
    await waitFor(() => {
      expect(screen.getByText("Task Name: Test Task")).toBeInTheDocument()
    })

    // Check error message
    expect(screen.getByText("Error: Test error message")).toBeInTheDocument()
  })
})
