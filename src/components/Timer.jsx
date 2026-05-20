import { useState, useEffect } from 'react'

export default function Timer({ timeLeftSeconds, durationSeconds }) {
  const [seconds, setSeconds] = useState(timeLeftSeconds || 0)

  // Efek ini digunakan untuk menjalankan perhitungan mundur (countdown) setiap detik
  useEffect(() => {
    setSeconds(timeLeftSeconds || 0)
    
    // Jika tidak ada waktu tersisa, jangan jalankan timer
    if (!timeLeftSeconds || timeLeftSeconds <= 0) return

    const intervalId = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalId)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Bersihkan interval ketika komponen dihancurkan (unmount)
    return () => clearInterval(intervalId)
  }, [timeLeftSeconds])

  // Fungsi untuk mengubah format detik menjadi HH:MM:SS
  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return '00:00:00'
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = Math.floor(totalSeconds % 60)
    
    const pad = (num) => String(num).padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  }

  // Menentukan warna timer (merah jika sisa waktu < 5 menit)
  const isWarning = seconds > 0 && seconds <= 300 // 5 menit

  return (
    <div className={`font-mono text-2xl font-bold tracking-[0.2em] ${isWarning ? 'text-red animate-pulse' : 'text-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'}`}>
      {formatTime(seconds)}
    </div>
  )
}
