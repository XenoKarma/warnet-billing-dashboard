import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { FaBolt, FaTimes, FaCircle, FaPowerOff } from 'react-icons/fa'

export default function PcSimulator({ totalPcs = 10 }) {
  const [open, setOpen] = useState(false)
  const [simulated, setSimulated] = useState({})
  const socketsRef = useRef({})

  // Cleanup semua socket saat komponen unmount
  useEffect(() => {
    return () => {
      Object.values(socketsRef.current).forEach(s => s.disconnect())
    }
  }, [])

  const togglePc = (pcNumber) => {
    if (simulated[pcNumber]) {
      // Matikan: disconnect socket → server otomatis set status ke offline
      if (socketsRef.current[pcNumber]) {
        socketsRef.current[pcNumber].disconnect()
        delete socketsRef.current[pcNumber]
      }
      setSimulated(prev => ({ ...prev, [pcNumber]: false }))
    } else {
      // Hidupkan: buat koneksi baru + register ke server
      const socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
      })
      socket.on('connect', () => {
        console.log(`🟢 Simulator: ${pcNumber} connected`)
        socket.emit('register-pc', { pc_number: pcNumber })
      })
      socket.on('disconnect', () => {
        console.log(`🔴 Simulator: ${pcNumber} disconnected`)
      })
      socketsRef.current[pcNumber] = socket
      setSimulated(prev => ({ ...prev, [pcNumber]: true }))
    }
  }

  const activateAll = () => {
    for (let i = 1; i <= totalPcs; i++) {
      const num = `PC-${String(i).padStart(2, '0')}`
      if (!simulated[num]) {
        togglePc(num)
      }
    }
  }

  const deactivateAll = () => {
    Object.keys(simulated).forEach(key => {
      if (simulated[key]) {
        togglePc(key)
      }
    })
  }

  const simulatedCount = Object.values(simulated).filter(Boolean).length

  return (
    <>
      {/* Tombol floating SIM */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2.5 rounded-xl
          bg-dark-800 border border-cyan/30 text-cyan text-xs font-bold tracking-wider
          hover:bg-cyan hover:text-dark-900 hover:border-cyan
          transition-all duration-300 cursor-pointer shadow-lg"
      >
        <FaBolt />
        SIM {simulatedCount > 0 && <span className="text-green">({simulatedCount})</span>}
      </button>

      {/* Panel Simulator */}
      {open && (
        <>
          {/* Backdrop klik di luar */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="fixed bottom-4 left-4 z-50 w-72 glass-panel rounded-2xl p-5 border border-cyan/20 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaBolt className="text-cyan text-sm" />
                <h3 className="text-white font-bold tracking-wider text-sm">PC SIMULATOR</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <p className="text-[10px] text-gray-600 mb-3 tracking-wider">
              TOGGLE PC UNTUK SIMULASI ONLINE/OFFLINE
            </p>

            {/* Tombol Activate / Deactivate All */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={activateAll}
                className="flex-1 py-1.5 rounded-lg bg-green/10 border border-green/30 text-green text-[10px] font-bold tracking-wider hover:bg-green/20 transition-all cursor-pointer"
              >
                ALL ONLINE
              </button>
              <button
                onClick={deactivateAll}
                className="flex-1 py-1.5 rounded-lg bg-red/10 border border-red/30 text-red text-[10px] font-bold tracking-wider hover:bg-red/20 transition-all cursor-pointer"
              >
                ALL OFFLINE
              </button>
            </div>

            {/* Daftar PC */}
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {Array.from({ length: totalPcs }, (_, i) => {
                const num = `PC-${String(i + 1).padStart(2, '0')}`
                const isOn = simulated[num]
                return (
                  <div
                    key={num}
                    className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all cursor-pointer ${
                      isOn ? 'bg-green/5' : 'hover:bg-dark-700/50'
                    }`}
                    onClick={() => togglePc(num)}
                  >
                    <div className="flex items-center gap-2.5">
                      <FaCircle className={`text-[6px] ${isOn ? 'text-green' : 'text-gray-600'}`} />
                      <span className={`text-sm font-semibold ${isOn ? 'text-white' : 'text-gray-500'}`}>{num}</span>
                    </div>
                    <div
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        isOn ? 'bg-green' : 'bg-dark-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                          isOn ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-dark-600 flex items-center justify-between text-[10px] text-gray-600">
              <span>{simulatedCount} / {totalPcs} active</span>
              <FaPowerOff className="text-xs" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
