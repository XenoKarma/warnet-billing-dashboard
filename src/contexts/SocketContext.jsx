import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

// Provider ini akan membungkus seluruh aplikasi kita agar Socket bisa diakses di mana saja
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Kita sambungkan ke backend warnet-billing-server yang berjalan di port 5000
    const s = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    })

    s.on('connect', () => {
      console.log('🟢 Terhubung ke server billing')
      setConnected(true)
    })

    s.on('disconnect', () => {
      console.log('🔴 Terputus dari server billing')
      setConnected(false)
    })

    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

// Custom hook agar kita bisa mengambil socket dengan mudah di komponen lain
export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket harus berada di dalam SocketProvider')
  return ctx
}
