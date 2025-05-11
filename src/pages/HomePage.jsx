"use client"

import React, { useState } from "react"

import { useContext, useCallback, Suspense, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Page,
  Layout,
  Modal,
  TextContainer,
  TextField,
  Stack,
  Card,
  Tabs,
  Icon,
  Text,
  SkeletonBodyText,
  EmptySearchResult,
  Pagination,
  Select,
  Button,
} from "@shopify/polaris"
import {
  SearchIcon,
  PlusIcon,
  SortIcon,
  FilterIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  HomeIcon,
} from "@shopify/polaris-icons"
import { TaskContext } from "../context/TaskContext"
import withErrorHandling from "../hoc/withErrorHandling"
import "../styles/fonts.css"

// Lazy load the TaskTable component
const TaskTable = React.lazy(() => import("../components/TaskTable"))

const HomePage = () => {
  const {
    pendingTasks,
    completedTasks,
    loading,
    error,
    deleteTask,
    searchQuery,
    setSearchQuery,
    tasks,
    // Pagination props
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
  } = useContext(TaskContext)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [selectedTab, setSelectedTab] = useState(0)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const navigate = useNavigate()

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value)
      if (value.trim() !== "") {
        setIsSearchActive(true)
        // Filter tasks based on search query
        const results = tasks.filter(
          (task) =>
            task.name.toLowerCase().includes(value.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(value.toLowerCase())),
        )
        setSearchResults(results)
      } else {
        setIsSearchActive(false)
      }
    },
    [setSearchQuery, tasks],
  )

  const handleDeleteClick = (id) => {
    setTaskToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete)
      setDeleteModalOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setTaskToDelete(null)
  }

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex)
  }, [])

  // Items per page options
  const itemsPerPageOptions = [
    { label: "5 per page", value: "5" },
    { label: "10 per page", value: "10" },
    { label: "25 per page", value: "25" },
    { label: "50 per page", value: "50" },
  ]

  const tabs = [
    {
      id: "all-tasks",
      content: (
        <Stack spacing="tight" alignment="center">
          <Icon source={HomeIcon} />
          <span>All Tasks</span>
          <span className="Polaris-Badge">{tasks.length}</span>
        </Stack>
      ),
      accessibilityLabel: "All tasks",
      panelID: "all-tasks-content",
    },
    {
      id: "pending-tasks",
      content: (
        <Stack spacing="tight" alignment="center">
          <Icon source={AlertCircleIcon} />
          <span>Pending</span>
          <span className="Polaris-Badge">{pendingTasks.length}</span>
        </Stack>
      ),
      accessibilityLabel: "Pending tasks",
      panelID: "pending-tasks-content",
    },
    {
      id: "completed-tasks",
      content: (
        <Stack spacing="tight" alignment="center">
          <Icon source={CheckCircleIcon} />
          <span>Completed</span>
          <span className="Polaris-Badge">{completedTasks.length}</span>
        </Stack>
      ),
      accessibilityLabel: "Completed tasks",
      panelID: "completed-tasks-content",
    },
  ]

  // Animation delay for elements
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in, .slide-up")
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`
    })
  }, [])

  // Get current tasks based on tab selection
  const getCurrentTasks = () => {
    if (isSearchActive) return searchResults

    switch (selectedTab) {
      case 1:
        return pendingTasks
      case 2:
        return completedTasks
      default:
        return tasks
    }
  }

  // Get current tasks with pagination
  const getCurrentPageTasks = () => {
    const currentTasks = getCurrentTasks()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, currentTasks.length)
    return currentTasks.slice(startIndex, endIndex)
  }

  // Get total pages for the current view
  const getCurrentTotalPages = () => {
    return Math.max(1, Math.ceil(getCurrentTasks().length / itemsPerPage))
  }

  return (
    <Page
      title={
        <Text variant="heading2xl" as="h1" fontWeight="bold" style={{ fontFamily: "var(--font-heading)" }}>
          Task Manager
        </Text>
      }
      subtitle="Organize and manage your tasks efficiently"
      primaryAction={{
        content: "Create New Task",
        icon: PlusIcon,
        onAction: () => navigate("/create"),
        style: {
          background: "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
          boxShadow: "var(--shadow-md)",
        },
      }}
     
    >
      <Layout>
        <Layout.Section>
          {/* Search Bar */}
          <div className="fade-in" style={{ marginBottom: "var(--spacing-md)" }}>
            <Card>
              <Card.Section>
                <TextField
                  label="Search tasks"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by name or description"
                  clearButton
                  onClearButtonClick={() => {
                    setSearchQuery("")
                    setIsSearchActive(false)
                  }}
                  prefix={<Icon source={SearchIcon} />}
                  autoComplete="off"
                />
              </Card.Section>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <div className="fade-in" style={{ marginBottom: "var(--spacing-md)" }}>
            <Card>
              <Card.Section>
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} fitted />
              </Card.Section>
            </Card>
          </div>

          {/* Content Section */}
          <div className="content-section">
            {isSearchActive ? (
              <div className="slide-up">
                {searchResults.length > 0 ? (
                  <Suspense
                    fallback={
                      <Card sectioned>
                        <SkeletonBodyText lines={3} />
                      </Card>
                    }
                  >
                    <TaskTable
                      title={`Search Results (${searchResults.length})`}
                      tasks={getCurrentPageTasks()}
                      loading={loading}
                      onDelete={handleDeleteClick}
                      error={error}
                    />
                  </Suspense>
                ) : (
                  <Card sectioned>
                    <EmptySearchResult
                      title="No tasks found"
                      description={`No tasks match the search query "${searchQuery}"`}
                      withIllustration
                    />
                  </Card>
                )}
              </div>
            ) : (
              <div className="slide-up">
                <Suspense
                  fallback={
                    <Card sectioned>
                      <SkeletonBodyText lines={3} />
                    </Card>
                  }
                >
                  <TaskTable
                    title={selectedTab === 0 ? "All Tasks" : selectedTab === 1 ? "Pending Tasks" : "Completed Tasks"}
                    tasks={getCurrentPageTasks()}
                    loading={loading}
                    onDelete={handleDeleteClick}
                    error={error}
                  />
                </Suspense>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {getCurrentTasks().length > 0 && (
            <div className="pagination-section" style={{ 
              marginTop: "var(--spacing-md)", 
              marginBottom: "var(--spacing-lg)" 
            }}
            >
              <Card sectioned>
                <Stack distribution="center" alignment="center" wrap={false}>
                  <Stack.Item>
                    <TextContainer>
                      <Text variant="bodySm" as="p" color="subdued">
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, getCurrentTasks().length)} -{" "}
                        {Math.min(currentPage * itemsPerPage, getCurrentTasks().length)} of {getCurrentTasks().length}{" "}
                        tasks
                      </Text>
                    </TextContainer>
                  </Stack.Item>
                  <Stack.Item fill>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Pagination
                        hasPrevious={currentPage > 1}
                        onPrevious={() => handlePageChange(currentPage - 1)}
                        hasNext={currentPage < getCurrentTotalPages()}
                        onNext={() => handlePageChange(currentPage + 1)}
                        label={`${currentPage} of ${getCurrentTotalPages()}`}
                      />
                    </div>
                  </Stack.Item>
                  <Stack.Item>
                    <Select
                      label="Items per page"
                      labelHidden
                      options={itemsPerPageOptions}
                      value={itemsPerPage.toString()}
                      onChange={handleItemsPerPageChange}
                    />
                  </Stack.Item>
                </Stack>
              </Card>
            </div>
          )}
        </Layout.Section>
      </Layout>

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        title={
          <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Delete Task
          </Text>
        }
        primaryAction={{
          content: "Delete",
          onAction: handleDeleteConfirm,
          destructive: true,
        }}
       
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </Page>
  )
}

export default withErrorHandling(HomePage)
