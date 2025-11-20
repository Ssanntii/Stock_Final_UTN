import { useState } from 'react'
import { Mail, CheckCircle2, X } from 'lucide-react'

const VerificationModal = ({ isOpen, onClose, email, onVerify, loading, error }) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])

  const handleChange = (index, value) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Solo tomar el último dígito

    setCode(newCode)

    // Auto-focus al siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Backspace: ir al input anterior
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }

    // Enter: verificar código
    if (e.key === 'Enter' && code.every(c => c)) {
      handleSubmit()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newCode = [...code]
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i]
    }
    setCode(newCode)

    // Focus en el siguiente input vacío o el último
    const nextEmptyIndex = newCode.findIndex(c => !c)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    const input = document.getElementById(`code-${focusIndex}`)
    if (input) input.focus()
  }

  const handleSubmit = () => {
    const verificationCode = code.join('')
    if (verificationCode.length === 6) {
      onVerify(verificationCode)
    }
  }

  const handleResend = async () => {
    // Aquí puedes agregar la lógica para reenviar el código
    try {
      const response = await fetch('http://localhost:3000/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Error al reenviar código')
      }

      alert('Código reenviado exitosamente')
    } catch (error) {
      console.error('Error al reenviar código:', error)
      alert('Error al reenviar el código')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Verifica tu Email</h3>
            <p className="text-slate-400 text-sm">
              Hemos enviado un código de 6 dígitos a<br />
              <span className="text-blue-400 font-medium">{email}</span>
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Inputs del código */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="off"
                />
              ))}
            </div>

            {/* Botón verificar */}
            <button
              onClick={handleSubmit}
              disabled={loading || code.some(c => !c)}
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verificar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Reenviar código */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              ¿No recibiste el código?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium disabled:opacity-50"
              >
                Reenviar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationModal