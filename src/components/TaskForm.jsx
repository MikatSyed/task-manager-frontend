"use client"

import { useState, useEffect } from "react"
import {
  Form,
  FormLayout,
  TextField,
  Select,
  Button,
  Card,
  Stack,
  Banner,
  Icon,
  TextContainer,
  Box,
  Collapsible,
  Text,
  DropZone,
  Thumbnail,
  Caption,
} from "@shopify/polaris"
import {
  CalendarIcon,
  CheckIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@shopify/polaris-icons"
import "../styles/fonts.css"

const TaskForm = ({ initialValues = {}, onSubmit, isLoading, formTitle }) => {
  const [name, setName] = useState(initialValues.name || "")
  const [description, setDescription] = useState(initialValues.description || "")
  const [status, setStatus] = useState(initialValues.status || "Pending")
  const [errors, setErrors] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [priority, setPriority] = useState(initialValues.priority || "Medium")
  const [dueDate, setDueDate] = useState(initialValues.dueDate || "")
  const [files, setFiles] = useState([])

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues.name) setName(initialValues.name)
    if (initialValues.description) setDescription(initialValues.description)
    if (initialValues.status) setStatus(initialValues.status)
    if (initialValues.priority) setPriority(initialValues.priority)
    if (initialValues.dueDate) setDueDate(initialValues.dueDate)
  }, [initialValues])

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ]

  const priorityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Urgent", value: "Urgent" },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Task name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        description,
        status,
        priority,
        dueDate,
      })
    }
  }

  const handleDropZoneDrop = (dropFiles) => {
    setFiles((files) => [...files, ...dropFiles])
  }

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"]

  const fileUpload = !files.length && <DropZone.FileUpload actionHint="or drag files to upload" />

  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : "https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png"
            }
          />
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  )

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
  }

  const getStatusBadgeColor = () => {
    switch (status) {
      case "Completed":
        return "var(--color-success)"
      case "In Progress":
        return "var(--color-info)"
      default:
        return "var(--color-warning)"
    }
  }

  const getPriorityBadgeColor = () => {
    switch (priority) {
      case "Urgent":
        return "var(--color-danger)"
      case "High":
        return "var(--color-warning)"
      case "Medium":
        return "var(--color-info)"
      default:
        return "var(--color-success)"
    }
  }

  return (
    <Card>
      <div className="slide-up">
        <Card.Section>
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <TextContainer>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.75rem",
                  fontWeight: "600",
                  color: "var(--color-primary-dark)",
                }}
              >
                {formTitle}
              </h2>
              <p style={{ color: "var(--color-text-light)" }}>
                {initialValues.id ? "Update your task details below" : "Fill in the details to create a new task"}
              </p>
            </TextContainer>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormLayout>
              {Object.keys(errors).length > 0 && (
                <Banner status="critical" icon={AlertCircleIcon}>
                  <p>Please correct the following errors:</p>
                  <ul>
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Banner>
              )}

              <div className="fade-in" style={{ animationDelay: "0.1s" }}>
                <TextField
                  label="Task Name"
                  value={name}
                  onChange={setName}
                  error={errors.name}
                  autoComplete="off"
                  placeholder="Enter a descriptive task name"
                  required
                  showCharacterCount
                  maxLength={100}
                />
              </div>

              <div className="fade-in" style={{ animationDelay: "0.2s" }}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={setDescription}
                  multiline={4}
                  autoComplete="off"
                  placeholder="Provide details about this task"
                  showCharacterCount
                  maxLength={500}
                />
              </div>

              <div className="fade-in" style={{ animationDelay: "0.3s" }}>
                <Stack distribution="fillEvenly">
                  <Select label="Status" options={statusOptions} value={status} onChange={setStatus} />
                  <div style={{ width: "100%" }}>
                    <Box paddingBlockStart="2" paddingBlockEnd="1">
                      <Text variant="bodyMd" as="p" fontWeight="medium">
                        Current Status
                      </Text>
                    </Box>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: getStatusBadgeColor(),
                        color: "white",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                      }}
                    >
                      {status}
                    </div>
                  </div>
                </Stack>
              </div>

           
              <div className="fade-in" style={{ animationDelay: "0.5s", marginTop: "var(--spacing-lg)" }}>
                <Stack distribution="trailing">
                  <Button onClick={() => window.history.back()}>Cancel</Button>
                  <Button
                    primary
                    submit
                    loading={isLoading}
                    icon={initialValues.id ? CheckIcon : PlusIcon}
                    style={{
                      background: "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    {initialValues.id ? "Update Task" : "Create Task"}
                  </Button>
                </Stack>
              </div>
            </FormLayout>
          </Form>
        </Card.Section>
      </div>
    </Card>
  )
}

export default TaskForm
