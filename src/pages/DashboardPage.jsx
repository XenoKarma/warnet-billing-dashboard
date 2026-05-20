import { useState, useEffect, useCallback } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useSocket } from '../contexts/SocketContext'
import PcCard from '../components/PcCard'
import PcSimulator from '../components/PcSimulator'
import AddPcModal from '../components/AddPcModal'

// Alamat server backend API kamu
const API_URL = 'http://localhost:5000'

export default function DashboardPage() {
  const { socket, connected } = useSocket()
  const [pcs, setPcs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddPc, setShowAddPc] = useState(false)

  // Fungsi fetch data PC (dipanggil saat mount & setelah tambah PC)
  const fetchPcs = useCallback(() => {
    fetch(`${API_URL}/api/pcs`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setPcs(json.data)
      })
      .catch(err => console.error('Gagal mengambil data PC:', err))
      .finally(() => setLoading(false))
  }, [])

  // 1. Ambil data awal daftar PC dari server saat pertama kali dimuat
  useEffect(() => {
    fetchPcs()
  }, [fetchPcs])

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

      {/* Stats Bar — Total PC Online, In Use, Available */}
      {(() => {
        const totalOnline = pcs.filter(p => p.status !== 'offline').length
        const totalActive = pcs.filter(p => p.status === 'active').length
        const totalAvailable = pcs.filter(p => p.status === 'online').length
        return (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-panel rounded-xl p-4 border-green/20">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">Online</p>
              <p className="text-2xl font-bold text-green mt-1">{totalOnline} <span className="text-sm text-gray-600">/ {pcs.length}</span></p>
            </div>
            <div className="glass-panel rounded-xl p-4 border-cyan/20">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">In Use</p>
              <p className="text-2xl font-bold text-cyan mt-1">{totalActive}</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border-green/20">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">Available</p>
              <p className="text-2xl font-bold text-green mt-1">{totalAvailable}</p>
            </div>
          </div>
        )
      })()}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase flex items-center gap-3">
          <span className="w-2 h-6 bg-cyan rounded-full glow-cyan inline-block"></span>
          Terminal Units Overview
        </h2>
        <button
          onClick={() => setShowAddPc(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-cyan/30 text-cyan text-xs font-bold tracking-wider hover:bg-cyan hover:text-dark-900 transition-all cursor-pointer"
        >
          <FaPlus size={12} /> TAMBAH PC
        </button>
      </div>
      
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

      {/* Modal Tambah PC */}
      {showAddPc && (
        <AddPcModal
          onClose={() => setShowAddPc(false)}
          onAdded={(newPcs) => {
            fetchPcs()
            setShowAddPc(false)
          }}
        />
      )}

      {/* PC Simulator — floating button untuk simulasi online/offline */}
      <PcSimulator totalPcs={pcs.length} />
    </div>
  )
}
