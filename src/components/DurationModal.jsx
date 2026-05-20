import { useState } from 'react'
import { FaTimes, FaClock, FaMoneyBillWave, FaPlay, FaPlusCircle, FaHourglass, FaStopwatch } from 'react-icons/fa'

const RATE_PER_HOUR = 5000
const QUICK_OPTIONS = [
  { label: '1 Jam', minutes: 60 },
  { label: '2 Jam', minutes: 120 },
  { label: '3 Jam', minutes: 180 },
  { label: '5 Jam', minutes: 300 },
]

export default function DurationModal({ pcNumber, mode = 'start', onClose, onConfirm }) {
  const isAdd = mode === 'add'
  const [selectedMinutes, setSelectedMinutes] = useState(60)
  const [customInput, setCustomInput] = useState('60')
  const [inputMode, setInputMode] = useState('quick')

  const handleQuickSelect = (minutes) => {
    setSelectedMinutes(minutes)
    setCustomInput(String(minutes))
    setInputMode('quick')
  }

  const handleCustomChange = (val) => {
    setCustomInput(val)
    const num = parseInt(val)
    if (num > 0) {
      setSelectedMinutes(num)
      setInputMode('custom')
    }
  }

  const totalPrice = (selectedMinutes / 60) * RATE_PER_HOUR
  const hours = Math.floor(selectedMinutes / 60)
  const mins = selectedMinutes % 60
  const durationLabel = hours > 0
    ? `${hours} Jam${mins > 0 ? ` ${mins} Menit` : ''}`
    : `${mins} Menit`

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
        <div className="glass-panel rounded-2xl p-6 border-cyan/20 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${isAdd ? 'bg-yellow/10 border-yellow/30' : 'bg-cyan/10 border-cyan/30'}`}>
                {isAdd ? <FaStopwatch className="text-yellow" /> : <FaHourglass className="text-cyan" />}
              </div>
              <div>
                <h3 className="text-white font-bold tracking-wider">{isAdd ? 'Tambah Waktu Billing' : 'Pilih Durasi Billing'}</h3>
                <p className="text-[10px] text-gray-500 tracking-wider">PC-{String(pcNumber).padStart(2, '0')}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <FaTimes size={16} />
            </button>
          </div>

          {/* Quick options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {QUICK_OPTIONS.map(opt => (
              <button
                key={opt.minutes}
                onClick={() => handleQuickSelect(opt.minutes)}
                className={`py-3 px-4 rounded-xl border font-bold text-sm tracking-wider transition-all cursor-pointer ${
                  inputMode === 'quick' && selectedMinutes === opt.minutes
                    ? isAdd
                      ? 'bg-yellow/20 border-yellow text-yellow shadow-[0_0_10px_rgba(255,234,0,0.2)]'
                      : 'bg-cyan/20 border-cyan text-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-dark-700 border-dark-600 text-gray-300 hover:border-cyan/40 hover:text-white'
                }`}
              >
                <FaClock className={`inline mr-2 ${inputMode === 'quick' && selectedMinutes === opt.minutes ? (isAdd ? 'text-yellow' : 'text-cyan') : 'text-gray-500'}`} size={11} />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="mb-4">
            <label className="text-xs text-gray-500 block mb-2 tracking-wider">ATAU INPUT MANUAL (MENIT)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="1440"
                value={customInput}
                onChange={(e) => handleCustomChange(e.target.value)}
                className={`flex-1 py-3 px-4 bg-dark-900 border rounded-xl text-white font-bold text-lg outline-none transition-colors ${
                  inputMode === 'custom'
                    ? 'border-cyan/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'border-dark-600 focus:border-cyan/40'
                }`}
              />
              <span className="text-gray-500 text-sm font-semibold tracking-wider">MENIT</span>
            </div>
          </div>

          {/* Price info */}
          <div className={`rounded-xl p-4 border mb-5 ${isAdd ? 'bg-yellow/5 border-yellow/20' : 'bg-dark-900/60 border-dark-600'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Durasi {isAdd ? 'tambahan' : ''}</span>
              <span className="text-sm font-bold text-white">{durationLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <FaMoneyBillWave className="text-green" size={11} />
                Tarif Rp {RATE_PER_HOUR.toLocaleString()} / jam
              </span>
              <span className="text-lg font-bold text-green drop-shadow-[0_0_5px_rgba(0,230,118,0.5)]">
                Rp {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 font-bold text-sm tracking-wider hover:text-white transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              onClick={() => onConfirm(pcNumber, selectedMinutes)}
              className={`flex-1 py-3 rounded-xl text-white font-bold text-sm tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isAdd
                  ? 'bg-gradient-to-r from-yellow to-yellow-dim hover:shadow-[0_0_20px_rgba(255,234,0,0.3)]'
                  : 'bg-gradient-to-r from-cyan to-cyan-dim hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]'
              }`}
            >
              {isAdd ? <FaPlusCircle size={10} /> : <FaPlay size={10} />}
              {isAdd ? 'TAMBAH WAKTU' : 'MULAI SESI'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
