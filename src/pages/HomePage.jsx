"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AppProvider } from "@shopify/polaris"
import enTranslations from "@shopify/polaris/locales/en.json"
import { TaskContext } from "../../context/TaskContext"
import HomePage from "../../pages/HomePage"
import { jest } from "@jest/globals"

// Mock the TaskTable component
jest.mock("../../components/TaskTable", () => {
  return function MockTaskTable({ title, tasks, onDelete }) {
    return (
      <div data-testid={`task-table-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <h2>{title}</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.name}
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
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

// Mock the SortDropdown component
jest.mock("react", () => {
  const originalReact = jest.requireActual("react")
  return {
    ...originalReact,
    useState: jest.fn((initial) => [initial, jest.fn()]),
  }
})

describe("HomePage Component", () => {
  const mockPendingTasks = [
    { id: 1, name: "Pending Task 1", status: "Pending" },
    { id: 2, name: "Pending Task 2", status: "Pending" },
  ]

  const mockCompletedTasks = [{ id: 3, name: "Completed Task 1", status: "Completed" }]

  const mockDeleteTask = jest.fn()
  const mockSetSearchQuery = jest.fn()
  const mockHandleSortChange = jest.fn()
  const mockNavigate = jest.fn()

  // Mock context value
  const mockContextValue = {
    pendingTasks: mockPendingTasks,
    completedTasks: mockCompletedTasks,
    tasks: [...mockPendingTasks, ...mockCompletedTasks],
    loading: false,
    error: null,
    deleteTask: mockDeleteTask,
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 3,
    totalPages: 1,
    handlePageChange: jest.fn(),
    handleItemsPerPageChange: jest.fn(),
    sortConfig: { sortBy: "created_at", sortDirection: "desc" },
    handleSortChange: mockHandleSortChange,
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
            <HomePage />
          </TaskContext.Provider>
        </MemoryRouter>
      </AppProvider>,
    )
  }

  test("renders page title and search field", () => {
    renderWithContext()

    // Check page title
    expect(screen.getByText("Task Manager")).toBeInTheDocument()

    // Check search field
    expect(screen.getByLabelText("Search tasks")).toBeInTheDocument()
  })

  test("renders tabs with correct counts", () => {
    renderWithContext()

    // Check tabs
    expect(screen.getByText("All Tasks")).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()

    // Check badge counts
    const badges = screen.getAllByText(/\d+/)
    expect(badges[0]).toHaveTextContent("3") // All tasks
    expect(badges[1]).toHaveTextContent("2") // Pending tasks
    expect(badges[2]).toHaveTextContent("1") // Completed tasks
  })

  test("renders task table with all tasks by default", () => {
    renderWithContext()

    // Check task table
    expect(screen.getByTestId("task-table-all-tasks")).toBeInTheDocument()
    expect(screen.getByText("All Tasks")).toBeInTheDocument()

    // Check task items
    expect(screen.getByText("Pending Task 1")).toBeInTheDocument()
    expect(screen.getByText("Pending Task 2")).toBeInTheDocument()
    expect(screen.getByText("Completed Task 1")).toBeInTheDocument()
  })

  test("handles search query changes", () => {
    renderWithContext()

    // Change search query
    fireEvent.change(screen.getByLabelText("Search tasks"), { target: { value: "test query" } })

    // Check if setSearchQuery was called with the correct value
    expect(mockSetSearchQuery).toHaveBeenCalledWith("test query")
  })

  test("opens delete confirmation modal when delete button is clicked", async () => {
    renderWithContext()

    // Click delete button for the first task
    fireEvent.click(screen.getAllByText("Delete")[0])

    // Check if delete confirmation modal is shown
    await waitFor(() => {
      expect(screen.getByText("Delete Task")).toBeInTheDocument()
      expect(
        screen.getByText("Are you sure you want to delete this task? This action cannot be undone."),
      ).toBeInTheDocument()
    })
  })

  test("calls deleteTask when delete is confirmed", async () => {
    renderWithContext()

    // Click delete button for the first task
    fireEvent.click(screen.getAllByText("Delete")[0])

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText("Delete Task")).toBeInTheDocument()
    })

    // Click confirm delete button
    fireEvent.click(screen.getByRole("button", { name: "Delete" }))

    // Check if deleteTask was called with the correct task ID
    expect(mockDeleteTask).toHaveBeenCalledWith(1)
  })

  test("closes delete confirmation modal when cancel is clicked", async () => {
    renderWithContext()

    // Click delete button for the first task
    fireEvent.click(screen.getAllByText("Delete")[0])

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText("Delete Task")).toBeInTheDocument()
    })

    // Click cancel button
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    // Check if modal is closed
    await waitFor(() => {
      expect(screen.queryByText("Delete Task")).not.toBeInTheDocument()
    })

    // Check that deleteTask was not called
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })

  test("navigates to create page when create button is clicked", () => {
    renderWithContext()

    // Find and click the create button
    const createButton = screen.getByText("Create New Task")
    fireEvent.click(createButton)

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/create")
  })
})
