import '@testing-library/jest-dom'

Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: 'http://mock-api'
    }
  }
})
