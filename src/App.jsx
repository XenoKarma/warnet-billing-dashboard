import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

const API_URL = 'http://localhost:5000'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [operator, setOperator] = useState('')
  const [token, setToken] = useState(null)
  const [checking, setChecking] = useState(true)

  // Cek token dari localStorage saat pertama render
  useEffect(() => {
    const savedToken = localStorage.getItem('warnet_token')
    if (!savedToken) {
      setChecking(false)
      return
    }

    fetch(`${API_URL}/api/auth/verify`, {
      headers: { Authorization: savedToken },
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setToken(savedToken)
          setOperator(data.username)
          setIsLoggedIn(true)
        } else {
          localStorage.removeItem('warnet_token')
        }
      })
      .catch(() => {
        localStorage.removeItem('warnet_token')
      })
      .finally(() => setChecking(false))
  }, [])

  const handleLogin = (username, newToken) => {
    setOperator(username)
    setToken(newToken)
    setIsLoggedIn(true)
    localStorage.setItem('warnet_token', newToken)
  }

  const handleLogout = () => {
    setOperator('')
    setToken(null)
    setIsLoggedIn(false)
    localStorage.removeItem('warnet_token')
  }

  const handleUpdateAccount = (newToken, newUsername) => {
    setToken(newToken)
    setOperator(newUsername)
    localStorage.setItem('warnet_token', newToken)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-cyan text-lg font-bold tracking-wider animate-pulse">VERIFYING SESSION...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <Layout operator={operator} onLogout={handleLogout} onUpdateAccount={handleUpdateAccount} token={token}>
      <DashboardPage />
    </Layout>
  )
}
