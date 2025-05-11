

import { useNavigate } from "react-router-dom"
import {
  Card,
  ResourceList,
  ResourceItem,
  Button,
  ButtonGroup,
  Stack,
  Spinner,
  EmptyState,
  Avatar,
  Text,
  Icon,
  Tooltip,
} from "@shopify/polaris"
import { EditIcon, DeleteIcon, CalendarIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from "@shopify/polaris-icons"
import "../styles/fonts.css"

const TaskTable = ({ title, tasks, loading, onDelete }) => {
  const navigate = useNavigate()

  // Get status badge variant
  const getStatusBadge = (status) => {
    let color, icon

    switch (status) {
      case "Completed":
        color = "var(--color-success)"
        icon = CheckCircleIcon
        break
      case "In Progress":
        color = "var(--color-info)"
        icon = ClockIcon
        break
      default:
        color = "var(--color-warning)"
        icon = AlertCircleIcon
    }

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
          backgroundColor: color,
          color: "white",
          fontWeight: "500",
          fontSize: "0.875rem",
          gap: "4px",
        }}
      >
        <Icon source={icon} color="base" />
        {status}
      </div>
    )
  }

  // Get priority badge
  const getPriorityBadge = (priority = "Medium") => {
    let color

    switch (priority) {
      case "Urgent":
        color = "var(--color-danger)"
        break
      case "High":
        color = "var(--color-warning)"
        break
      case "Medium":
        color = "var(--color-info)"
        break
      default:
        color = "var(--color-success)"
    }

    return (
      <div
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "var(--radius-full)",
          backgroundColor: color,
          color: "white",
          fontWeight: "500",
          fontSize: "0.75rem",
        }}
      >
        {priority}
      </div>
    )
  }

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get random color for avatar
  const getAvatarColor = (name) => {
    const colors = ["var(--color-primary)", "var(--color-secondary)", "var(--color-success)", "var(--color-info)"]

    const charCode = name.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  if (loading) {
    return (
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
            <Spinner accessibilityLabel="Loading tasks" size="large" />
            <Text variant="bodyMd" as="p" color="subdued">
              Loading tasks...
            </Text>
          </div>
        </Card.Section>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <Card.Header
          title={
            <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ fontFamily: "var(--font-heading)" }}>
              {title}
            </Text>
          }
        />
        <Card.Section>
          <EmptyState
            heading="No tasks found"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            action={{
              content: "Create new task",
              onAction: () => navigate("/create"),
            }}
          >
            <p>No tasks are currently available with the selected filters.</p>
          </EmptyState>
        </Card.Section>
      </Card>
    )
  }

  return (
    <div className="slide-up">
      <Card>
        <Card.Header
          title={
            <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ fontFamily: "var(--font-heading)" }}>
              {title}
            </Text>
          }
          actions={[
            {
              content: "Create task",
              onAction: () => navigate("/create"),
            },
          ]}
        />

        <ResourceList
          resourceName={{ singular: "task", plural: "tasks" }}
          items={tasks}
          renderItem={(task) => {
            const { id, name, description, status, priority = "Medium", dueDate } = task

            return (
              <ResourceItem
                id={id.toString()}
                accessibilityLabel={`View details for ${name}`}
                media={
                  <Avatar
                    customer
                    size="medium"
                    name={name}
                    initials={getInitials(name)}
                    style={{ backgroundColor: getAvatarColor(name) }}
                  />
                }
              >
                <div className="fade-in" style={{ animationDelay: `${id * 0.1}s` }}>
                  <Stack vertical spacing="tight">
                    <Stack alignment="center" distribution="equalSpacing">
                      <Stack.Item fill>
                        <Text variant="headingMd" as="h3" fontWeight="semibold">
                          {name}
                        </Text>
                      </Stack.Item>
                      <Stack.Item>
                        <Stack spacing="tight">
                          {getPriorityBadge(priority)}
                          {getStatusBadge(status)}
                        </Stack>
                      </Stack.Item>
                    </Stack>

                    <div
                      style={{
                        color: "var(--color-text-light)",
                        fontSize: "0.9rem",
                        marginBottom: "var(--spacing-sm)",
                      }}
                    >
                      {description || "No description provided"}
                    </div>

                    <Stack alignment="center" distribution="equalSpacing">
                      <Stack.Item>
                        {dueDate && (
                          <Stack spacing="extraTight" alignment="center">
                            <Icon source={CalendarIcon} color="subdued" />
                            <Text variant="bodySm" as="span" color="subdued">
                              Due: {new Date(dueDate).toLocaleDateString()}
                            </Text>
                          </Stack>
                        )}
                      </Stack.Item>

                      <Stack.Item>
                        <ButtonGroup>
                          <Tooltip content="Edit task">
                            <Button
                              icon={EditIcon}
                              onClick={() => navigate(`/edit/${id}`)}
                              style={{
                                borderRadius: "var(--radius-md)",
                                boxShadow: "var(--shadow-sm)",
                              }}
                            >
                              Edit
                            </Button>
                          </Tooltip>

                          <Tooltip content="Delete task">
                            <Button
                              icon={DeleteIcon}
                              destructive
                              onClick={() => onDelete(id)}
                              style={{
                                borderRadius: "var(--radius-md)",
                                boxShadow: "var(--shadow-sm)",
                              }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </Stack.Item>
                    </Stack>
                  </Stack>
                </div>
              </ResourceItem>
            )
          }}
        />
      </Card>
    </div>
  )
}

export default TaskTable
