import { FaTimes, FaExclamationTriangle } from 'react-icons/fa'

export default function ConfirmModal({ title, message, confirmText = 'HAPUS', onConfirm, onCancel }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
        <div className="glass-panel rounded-2xl p-6 border-red/20 shadow-[0_0_30px_rgba(255,23,68,0.1)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red/10 border border-red/30 flex items-center justify-center">
                <FaExclamationTriangle className="text-red" />
              </div>
              <div>
                <h3 className="text-white font-bold tracking-wider">{title || 'Konfirmasi'}</h3>
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <FaTimes size={16} />
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 font-bold text-sm tracking-wider hover:text-white transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red to-red-dim text-white font-bold text-sm tracking-wider hover:shadow-[0_0_20px_rgba(255,23,68,0.3)] transition-all cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
