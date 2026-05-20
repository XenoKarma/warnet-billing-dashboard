import { FaDesktop, FaPlay, FaStop, FaCircle } from 'react-icons/fa'
import Timer from './Timer'

export default function PcCard({ pc, onStart, onStop }) {
  // Mengecek status dari PC saat ini
  const isActive = pc.status === 'active'
  const isAvailable = pc.status === 'online' || pc.status === 'available'
  const isOffline = pc.status === 'offline'

  // Menentukan warna kartu (Card) berdasarkan statusnya
  let cardClass = 'bg-dark-800 border-dark-600'
  if (isActive) cardClass = 'bg-dark-800 border-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]'
  if (isAvailable) cardClass = 'bg-dark-800 border-green/40 hover:border-green/80'

  // Menentukan indikator titik warna
  let statusDot = 'text-gray-500'
  if (isActive) statusDot = 'text-cyan animate-pulse'
  if (isAvailable) statusDot = 'text-green'
  if (isOffline) statusDot = 'text-red'

  return (
    <div className={`relative rounded-xl border p-5 transition-all duration-300 overflow-hidden glass-panel ${cardClass}`}>
      
      {/* Efek Garis Berjalan (Hanya saat Aktif) */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-purple to-pink animate-pulse" />
      )}

      {/* Header Kartu: Nama PC dan Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaDesktop className={`text-2xl ${isActive ? 'text-cyan' : isAvailable ? 'text-green' : 'text-gray-500'}`} />
          <div>
            <h3 className="font-bold text-xl text-white tracking-wide">
              PC-{String(pc.pc_number).padStart(2, '0')}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">STATUS: {pc.status.toUpperCase()}</p>
          </div>
        </div>
        <FaCircle className={`text-xs ${statusDot}`} />
      </div>

      {/* Bagian Tengah: Tampilan Waktu (Timer) */}
      <div className="text-center py-4 mb-4 bg-dark-900/60 rounded-xl border border-dark-600">
        {isActive ? (
          <Timer timeLeftSeconds={pc.timeLeftSeconds} durationSeconds={pc.durationSeconds} />
        ) : (
          <span className="text-gray-600 font-mono text-xl tracking-[0.2em] font-bold">--:--:--</span>
        )}
      </div>

      {/* Bagian Bawah: Tombol Aksi */}
      <div className="flex gap-3">
        {isAvailable && (
          <button
            onClick={() => onStart(pc.pc_number)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-700 border border-green/30 text-green font-bold text-sm tracking-wider hover:bg-green hover:text-dark-900 transition-all cursor-pointer"
          >
            <FaPlay size={12} /> INITIALIZE
          </button>
        )}
        
        {isActive && (
          <button
            onClick={() => onStop(pc.pc_number)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-700 border border-red/30 text-red font-bold text-sm tracking-wider hover:bg-red hover:text-dark-900 transition-all cursor-pointer"
          >
            <FaStop size={12} /> TERMINATE
          </button>
        )}

        {isOffline && (
          <button disabled className="flex-1 px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-dark-600 font-bold text-sm tracking-widest cursor-not-allowed">
            OFFLINE
          </button>
        )}
      </div>
    </div>
  )
}
