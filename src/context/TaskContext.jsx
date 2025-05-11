"use client"

import { createContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Toast } from "@shopify/polaris"

// Create context
export const TaskContext = createContext()

// API URL
const API_URL = "https://task-manager-backend-vvrqh.kinsta.app/api"

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastActive, setToastActive] = useState(false)
  const [toastContent, setToastContent] = useState("")
  const [toastError, setToastError] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const navigate = useNavigate()

  // Show toast message
  const showToast = (content, isError = false) => {
    setToastContent(content)
    setToastError(isError)
    setToastActive(true)
  }

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tasks`)

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      setTasks(data.data)

      // Update pagination info
      setTotalItems(data.data.length)
      setTotalPages(Math.ceil(data.data.length / itemsPerPage))

      setError(null)
    } catch (err) {
      setError(err.message)
      showToast(err.message, true)
    } finally {
      setLoading(false)
    }
  }, [itemsPerPage])

  // Create a new task
  const createTask = async (taskData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task")
      }

      showToast("Task created successfully")
      await fetchTasks()
      navigate("/")
    } catch (err) {
      setError(err.message)
      showToast(err.message, true)
    } finally {
      setLoading(false)
    }
  }

  // Get a single task
  const getTask = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tasks/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch task")
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      setError(err.message)
      showToast(err.message, true)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update a task
  const updateTask = async (id, taskData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task")
      }

      showToast("Task updated successfully")
      await fetchTasks()
      navigate("/")
    } catch (err) {
      setError(err.message)
      showToast(err.message, true)
    } finally {
      setLoading(false)
    }
  }

  // Delete a task
  const deleteTask = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete task")
      }

      // Update tasks state after deletion
      setTasks(tasks.filter((task) => task.id !== id))
      showToast("Task deleted successfully")
    } catch (err) {
      setError(err.message)
      showToast(err.message, true)
    } finally {
      setLoading(false)
    }
  }

  // Get paginated tasks
  const getPaginatedTasks = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return tasks.slice(startIndex, endIndex)
  }, [tasks, currentPage, itemsPerPage])

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(Number.parseInt(newItemsPerPage))
    setCurrentPage(1) // Reset to first page when changing items per page
    setTotalPages(Math.ceil(totalItems / Number.parseInt(newItemsPerPage)))
  }

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get pending and completed tasks
  const pendingTasks = filteredTasks.filter((task) => task.status === "Pending")
  const completedTasks = filteredTasks.filter((task) => task.status === "Completed")

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        pendingTasks,
        completedTasks,
        paginatedTasks: getPaginatedTasks(),
        loading,
        error,
        fetchTasks,
        createTask,
        getTask,
        updateTask,
        deleteTask,
        searchQuery,
        setSearchQuery,
        // Pagination
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        handlePageChange,
        handleItemsPerPageChange,
      }}
    >
      {children}
      {toastActive && <Toast content={toastContent} error={toastError} onDismiss={() => setToastActive(false)} />}
    </TaskContext.Provider>
  )
}
