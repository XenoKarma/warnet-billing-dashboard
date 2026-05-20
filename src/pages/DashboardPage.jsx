import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketContext'
import PcCard from '../components/PcCard'

// Alamat server backend API kamu
const API_URL = 'http://localhost:5000'

export default function DashboardPage() {
  const { socket, connected } = useSocket()
  const [pcs, setPcs] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Ambil data awal daftar PC dari server saat pertama kali dimuat
  useEffect(() => {
    fetch(`${API_URL}/api/pcs`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setPcs(json.data)
      })
      .catch(err => console.error('Gagal mengambil data PC:', err))
      .finally(() => setLoading(false))
  }, [])

  // 2. Dengarkan perubahan realtime dari Socket.IO
  useEffect(() => {
    if (!socket) return

    // Ketika ada perubahan status PC (misalnya PC mati/hidup/berubah jadi online)
    const handleStatusChange = (data) => {
      setPcs(prev => prev.map(pc =>
        pc.pc_number === data.pc_number ? { ...pc, status: data.status } : pc
      ))
    }

    // Ketika server mengirimkan detak timer terbaru setiap detiknya
    const handleTimerUpdate = (data) => {
      setPcs(prev => prev.map(pc =>
        pc.pc_number === data.pc_number
          ? { ...pc, timeLeftSeconds: data.timeLeftSeconds, durationSeconds: data.durationSeconds }
          : pc
      ))
    }

    socket.on('pc-status-changed', handleStatusChange)
    socket.on('pc-timer-update', handleTimerUpdate)

    // Cleanup: Matikan pendengar saat komponen hilang
    return () => {
      socket.off('pc-status-changed', handleStatusChange)
      socket.off('pc-timer-update', handleTimerUpdate)
    }
  }, [socket])

  // 3. Fungsi untuk mengirim perintah START ke API
  const handleStartSession = async (pcNumber) => {
    try {
      await fetch(`${API_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pc_number: pcNumber, duration_minutes: 60 }), // default main 60 menit
      })
    } catch (err) {
      console.error('Gagal memulai sesi:', err)
    }
  }

  // 4. Fungsi untuk mengirim perintah STOP ke API
  const handleStopSession = async (pcNumber) => {
    try {
      await fetch(`${API_URL}/api/session/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pc_number: pcNumber }),
      })
    } catch (err) {
      console.error('Gagal menghentikan sesi:', err)
    }
  }

  if (loading) {
    return <div className="text-cyan text-center py-20 text-2xl font-bold animate-pulse">LOADING SYSTEM...</div>
  }

  return (
    <div>
      {/* Jika terputus dari Socket, tampilkan peringatan merah */}
      {!connected && (
        <div className="bg-red/20 border border-red text-red px-6 py-3 rounded-xl mb-6 flex items-center justify-center font-bold animate-pulse">
          ⚠️ KONEKSI KE SERVER TERPUTUS! ⚠️
        </div>
      )}

      <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase flex items-center gap-3 mb-6">
        <span className="w-2 h-6 bg-cyan rounded-full glow-cyan inline-block"></span>
        Terminal Units Overview
      </h2>
      
      {/* Tampilan Grid untuk menderetkan kartu-kartu PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pcs.map(pc => (
          <PcCard
            key={pc.pc_number}
            pc={pc}
            onStart={handleStartSession}
            onStop={handleStopSession}
          />
        ))}
      </div>
    </div>
  )
}
