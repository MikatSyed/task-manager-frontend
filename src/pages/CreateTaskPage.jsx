import { useContext } from "react"
import { Page, Text } from "@shopify/polaris"
import TaskForm from "../components/TaskForm"
import { TaskContext } from "../context/TaskContext"
import withErrorHandling from "../hoc/withErrorHandling"
import "../styles/fonts.css"

const CreateTaskPage = () => {
  const { createTask, loading, error } = useContext(TaskContext)

  return (
    <Page
      title={
        <Text variant="heading2xl" as="h1" fontWeight="bold" style={{ fontFamily: "var(--font-heading)" }}>
          Create New Task
        </Text>
      }
      subtitle="Add a new task to your task manager"
      breadcrumbs={[{ content: "Tasks", url: "/" }]}
    >
      <TaskForm onSubmit={createTask} isLoading={loading} formTitle="Task Details" error={error} />
    </Page>
  )
}

export default withErrorHandling(CreateTaskPage)