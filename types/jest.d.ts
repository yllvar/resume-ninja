/// <reference types="@types/jest" />
import '@testing-library/jest-dom'

// Extend Jest matchers with @testing-library/jest-dom
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(className: string): R
      toHaveStyle(style: string): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveFocus(): R
      toHaveFormValues(values: Record<string, any>): R
      toHaveTextContent(text: string | RegExp): R
      toHaveValue(value: string | number | string[]): R
      toBeEmptyDOMElement(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(html: string): R
      toHaveDescription(text: string | RegExp): R
      toHaveDisplayValue(value: string | number | string[]): R
      toHaveErrorMessage(text: string | RegExp): R
      toHaveRole(role: string): R
      toHaveAccessibleDescription(text: string | RegExp): R
      toHaveAccessibleName(text: string | RegExp): R
      toBePartiallyChecked(): R
      toBeRequired(): R
      toBeInvalid(): R
      toBeValid(): R
    }
  }
}
