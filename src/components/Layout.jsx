import { FaWifi, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'

export default function Layout({ children, operator, onLogout }) {
  return (
    <div className="min-h-screen bg-dark-900 relative">
      {/* Background Kotak-kotak Hologram */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(var(--color-dark-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-dark-700) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Header (Bagian Atas) */}
      <header className="glass-panel sticky top-0 z-50 border-b-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Kiri */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-dark-800 border border-cyan/40 rounded-xl flex items-center justify-center glow-cyan shadow-[inset_0_0_15px_rgba(0,229,255,0.2)]">
                <FaWifi className="text-cyan text-xl" />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl tracking-[0.15em] drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">WARNET</h1>
                <p className="text-xs text-cyan-dim tracking-[0.4em] uppercase font-semibold -mt-1">Command Center</p>
              </div>
            </div>

            {/* Bagian Kanan (Info Operator & Logout) */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-800 border border-dark-600 shadow-inner">
                <FaUserCircle className="text-purple text-lg" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 tracking-wider uppercase leading-none mb-1">Operator</span>
                  <span className="text-sm font-semibold text-gray-200 leading-none">{operator}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:text-red border border-transparent hover:border-red/40 hover:bg-red/10 transition-all duration-300 cursor-pointer"
              >
                <FaSignOutAlt size={16} />
                <span className="text-sm font-semibold tracking-wider">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Area Konten Utama tempat halaman lain ditampilkan */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
