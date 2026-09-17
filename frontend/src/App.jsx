
import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getMessages = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/messages')

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error(error)
      setError('Could not connect to the backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Kubernetes Learning App</h1>

      <div className="backend-message">
        <h2>Message from backend:</h2>
        <p>Hello from Kubernetes!</p>
      </div>

      <button onClick={getMessages} disabled={loading}>
        {loading ? 'Loading...' : 'Get Messages'}
      </button>

      {error && <p className="error">{error}</p>}

      {messages.length > 0 && (
        <div className="messages">
          <h2>Messages from PostgreSQL:</h2>

          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <strong>{message.id}.</strong> {message.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App

