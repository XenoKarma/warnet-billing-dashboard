import { useState } from 'react'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  // State untuk menyimpan apakah user sudah login atau belum
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // State untuk menyimpan nama operator yang sedang login
  const [operator, setOperator] = useState('')

  // Fungsi yang dipanggil saat tombol login diklik di LoginPage
  const handleLogin = (usernameInput) => {
    setOperator(usernameInput)
    setIsLoggedIn(true)
  }

  // Fungsi yang dipanggil saat tombol logout diklik di Layout
  const handleLogout = () => {
    setOperator('')
    setIsLoggedIn(false)
  }

  // Jika belum login, tampilkan halaman Login
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Jika sudah login, tampilkan Dashboard di dalam pembungkus Layout
  return (
    <Layout operator={operator} onLogout={handleLogout}>
      <DashboardPage />
    </Layout>
  )
}
