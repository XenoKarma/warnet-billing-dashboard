import { useState } from 'react'
import { FaTimes, FaUserCog, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa'

const API_URL = 'http://localhost:5000'

export default function AccountModal({ currentOperator, token, onClose, onUpdate }) {
  const [newUsername, setNewUsername] = useState(currentOperator)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!oldPassword) {
      setError('Password saat ini wajib diisi')
      return
    }

    if (!newUsername.trim()) {
      setError('Username tidak boleh kosong')
      return
    }

    if (newPassword && newPassword.length < 4) {
      setError('Password baru minimal 4 karakter')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          oldPassword,
          newUsername: newUsername.trim(),
          newPassword: newPassword || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal update akun')
        return
      }

      setSuccess('Akun berhasil diperbarui!')

      setTimeout(() => {
        onUpdate(data.token, data.username)
        onClose()
      }, 1200)
    } catch (err) {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="glass-panel rounded-2xl p-6 border-cyan/20 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple/10 border border-purple/30 flex items-center justify-center">
                <FaUserCog className="text-purple" />
              </div>
              <div>
                <h3 className="text-white font-bold tracking-wider">Account Settings</h3>
                <p className="text-[10px] text-gray-500 tracking-wider">UBAH USERNAME & PASSWORD</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <FaTimes size={16} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red/10 border border-red/30 text-red text-sm font-semibold">
                <FaExclamationCircle /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green/10 border border-green/30 text-green text-sm font-semibold">
                <FaCheckCircle /> {success}
              </div>
            )}

            {/* Username baru */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5 tracking-wider">USERNAME BARU</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => { setNewUsername(e.target.value); setError('') }}
                className="w-full py-3 px-4 bg-dark-900 border border-dark-600 rounded-xl text-white outline-none focus:border-purple/50 transition-colors"
              />
            </div>

            {/* Current password */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5 tracking-wider">PASSWORD SAAT INI</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); setError('') }}
                className="w-full py-3 px-4 bg-dark-900 border border-dark-600 rounded-xl text-white outline-none focus:border-purple/50 transition-colors"
                placeholder="Masukkan password saat ini"
              />
            </div>

            {/* Separator */}
            <div className="border-t border-dark-600 pt-3">
              <p className="text-[10px] text-gray-600 tracking-wider mb-3">KOSONGKAN JIKA TIDAK INGIN MENGGANTI PASSWORD</p>
            </div>

            {/* Password baru */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5 tracking-wider">PASSWORD BARU</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-3 px-4 bg-dark-900 border border-dark-600 rounded-xl text-white outline-none focus:border-purple/50 transition-colors"
                placeholder="Biarkan kosong jika tidak diganti"
              />
            </div>

            {/* Konfirmasi password baru */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5 tracking-wider">KONFIRMASI PASSWORD BARU</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 bg-dark-900 border border-dark-600 rounded-xl text-white outline-none focus:border-purple/50 transition-colors"
                placeholder="Ketik ulang password baru"
              />
            </div>

            {/* Tombol */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 font-bold text-sm tracking-wider hover:text-white transition-all cursor-pointer"
              >
                BATAL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple to-pink text-white font-bold text-sm tracking-wider hover:shadow-[0_0_20px_rgba(176,0,255,0.3)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : null}
                {loading ? 'MENYIMPAN...' : 'SIMPAN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
