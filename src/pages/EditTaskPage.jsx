"use client"

import { useContext, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Page, Spinner, Text, SkeletonBodyText, Card } from "@shopify/polaris"
import TaskForm from "../components/TaskForm"
import { TaskContext } from "../context/TaskContext"
import withErrorHandling from "../hoc/withErrorHandling"
import "../styles/fonts.css"

const EditTaskPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, updateTask, loading, error } = useContext(TaskContext)
  const [task, setTask] = useState(null)
  const [fetchingTask, setFetchingTask] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTask(id)
        if (taskData) {
          setTask(taskData)
        } else {
          navigate("/")
        }
      } catch (err) {
        console.error("Error fetching task:", err)
      } finally {
        setFetchingTask(false)
      }
    }
  
    fetchTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  

  const handleSubmit = (formData) => {
    updateTask(id, formData)
  }

  if (fetchingTask) {
    return (
      <Page title="Edit Task">
        <Card>
          <Card.Section>
            <div
              style={{
                textAlign: "center",
                padding: "var(--spacing-2xl)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-md)",
              }}
            >
              <Spinner accessibilityLabel="Loading task" size="large" />
              <Text variant="bodyMd" as="p" color="subdued">
                Loading task details...
              </Text>
            </div>
          </Card.Section>
        </Card>
      </Page>
    )
  }

  return (
    <Page
      title={
        <Text variant="heading2xl" as="h1" fontWeight="bold" style={{ fontFamily: "var(--font-heading)" }}>
          Edit Task
        </Text>
      }
      subtitle={task?.name}
      breadcrumbs={[{ content: "Tasks", url: "/" }]}
    >
      {task ? (
        <TaskForm
          initialValues={task}
          onSubmit={handleSubmit}
          isLoading={loading}
          formTitle="Edit Task Details"
          error={error}
        />
      ) : (
        <Card sectioned>
          <SkeletonBodyText lines={5} />
        </Card>
      )}
    </Page>
  )
}

export default withErrorHandling(EditTaskPage)
