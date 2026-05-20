import { useState } from 'react'
import { FaPlus, FaTimes, FaDesktop, FaSpinner } from 'react-icons/fa'

const API_URL = 'http://localhost:5000'

export default function AddPcModal({ onClose, onAdded }) {
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(1)

  const handleAdd = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/pcs/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      })
      const json = await res.json()
      if (json.data) {
        onAdded(json.data)
      }
    } catch (err) {
      console.error('Gagal tambah PC:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
        <div className="glass-panel rounded-2xl p-6 border-cyan/20 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                <FaDesktop className="text-cyan" />
              </div>
              <div>
                <h3 className="text-white font-bold tracking-wider">Tambah PC Baru</h3>
                <p className="text-[10px] text-gray-500 tracking-wider">ADD NEW TERMINAL UNIT</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <FaTimes size={16} />
            </button>
          </div>

          {/* Input jumlah */}
          <div className="mb-5">
            <label className="text-xs text-gray-400 block mb-2 tracking-wider">JUMLAH PC</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCount(Math.max(1, count - 1))}
                className="w-10 h-10 rounded-xl bg-dark-700 border border-dark-600 text-white font-bold hover:border-cyan/40 transition-colors cursor-pointer text-lg"
              >−</button>
              <input
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 py-3 text-center bg-dark-900 border border-dark-600 rounded-xl text-white font-bold text-lg outline-none focus:border-cyan/50 transition-colors"
              />
              <button
                onClick={() => setCount(Math.min(50, count + 1))}
                className="w-10 h-10 rounded-xl bg-dark-700 border border-dark-600 text-white font-bold hover:border-cyan/40 transition-colors cursor-pointer text-lg"
              >+</button>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 font-bold text-sm tracking-wider hover:text-white transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan to-cyan-dim text-white font-bold text-sm tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              {loading ? 'MENAMBAH...' : `TAMBAH ${count} PC`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
