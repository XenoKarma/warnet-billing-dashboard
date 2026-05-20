import { useState } from 'react'
import { FaUser, FaLock, FaWifi } from 'react-icons/fa'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault() // Mencegah halaman refresh
    if (username && password) {
      onLogin(username) // Kirim username ke App.jsx untuk login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Efek Cahaya Belakang */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-pink/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Judul & Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan/20 to-pink/20 border border-cyan/30 mb-6 glow-cyan">
            <FaWifi className="text-cyan text-4xl" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-[0.15em] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">WARNET</h1>
          <p className="text-cyan-dim text-sm mt-2 tracking-[0.3em] uppercase font-semibold">System Access</p>
        </div>

        {/* Kotak Form */}
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white tracking-wide">Operator Login</h2>
          </div>

          <div className="space-y-4">
            {/* Input Username */}
            <div className="relative flex items-center">
              <FaUser className="absolute left-4 text-cyan" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-dark-900/80 border border-dark-600 rounded-xl text-white outline-none focus:border-cyan transition-colors"
                placeholder="USERNAME"
              />
            </div>

            {/* Input Password */}
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-pink" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-dark-900/80 border border-dark-600 rounded-xl text-white outline-none focus:border-pink transition-colors"
                placeholder="PASSWORD"
              />
            </div>

            {/* Tombol Login */}
            <button type="submit" className="w-full mt-6 py-4 rounded-xl bg-dark-800 border border-cyan text-cyan font-bold tracking-[0.2em] hover:bg-cyan hover:text-dark-900 transition-colors cursor-pointer glow-cyan">
              INITIALIZE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
