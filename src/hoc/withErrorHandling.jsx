import { Banner } from "@shopify/polaris"

// Higher-Order Component for error handling
const withErrorHandling = (WrappedComponent) => {
  return function WithErrorHandling(props) {
    const { error, ...restProps } = props

    if (error) {
      return (
        <div>
          <Banner status="critical" title="An error occurred">
            <p>{error}</p>
          </Banner>
          <WrappedComponent {...restProps} />
        </div>
      )
    }

    return <WrappedComponent {...restProps} />
  }
}

export default withErrorHandling
