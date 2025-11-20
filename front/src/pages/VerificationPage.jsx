import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { verifyEmail, resendVerificationCode } from '../api/apiConfig' // ✅ Usar apiConfig
import logo from '/stock.png'

const VerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = location.state?.email || ''
  const messageFromState = location.state?.message || ''

  const [email] = useState(emailFromState) // ✅ Solo lectura
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [infoMessage, setInfoMessage] = useState(messageFromState)

  // ✅ Función para enmascarar email
  const maskEmail = (email) => {
    if (!email) return ''
    
    const [localPart, domain] = email.split('@')
    if (!domain) return email

    // Mostrar primeros 2 caracteres y últimos 2 del local part
    const visibleStart = localPart.slice(0, 2)
    const visibleEnd = localPart.slice(-2)
    const masked = visibleStart + '****' + visibleEnd

    return `${masked}@${domain}`
  }

  // Auto-focus en el primer input al cargar
  useEffect(() => {
    if (!email) {
      navigate('/auth/register')
      return
    }
    
    const firstInput = document.getElementById('code-0')
    if (firstInput) firstInput.focus()
  }, [email, navigate])

  // Limpiar mensaje de info después de 5 segundos
  useEffect(() => {
    if (infoMessage) {
      const timer = setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [infoMessage])

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
      handleSubmit(e)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      setError('Por favor completa el código de 6 dígitos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // ✅ Usar apiConfig
      await verifyEmail(email, verificationCode)

      // Verificación exitosa
      setSuccess(true)
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/auth', { 
          state: { 
            message: '¡Cuenta verificada! Ya puedes iniciar sesión.' 
          }
        })
      }, 2000)

    } catch (error) {
      console.error("Error al verificar código:", error)
      setError(error.message || "Error al verificar el código")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError(null)

    try {
      // ✅ Usar apiConfig
      await resendVerificationCode(email)

      // Limpiar código y resetear inputs
      setCode(['', '', '', '', '', ''])
      const firstInput = document.getElementById('code-0')
      if (firstInput) firstInput.focus()
      
      // Mostrar mensaje de éxito
      setInfoMessage('Código reenviado exitosamente. Revisa tu email.')

    } catch (error) {
      console.error('Error al reenviar código:', error)
      setError(error.message || 'Error al reenviar el código')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/auth" className="flex items-center gap-3 w-fit group">
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <img src={logo} alt='logo' className="w-10 h-10 shrink-0" />
            <span className="text-lg font-semibold text-white">Verificar Email</span>
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
            
            {/* Icono */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Verifica tu Email</h2>
              <p className="text-slate-400 text-sm">
                Ingresa el código de 6 dígitos enviado a
              </p>
              {/* ✅ Email parcialmente oculto */}
              <p className="text-blue-400 font-medium mt-2">
                {maskEmail(email)}
              </p>
            </div>

            {/* Mensaje informativo */}
            {infoMessage && (
              <div className="mb-6 bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-300 text-sm">{infoMessage}</p>
                </div>
              </div>
            )}

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

            {/* Mensaje de éxito */}
            {success && (
              <div className="mb-6 bg-green-900/30 border border-green-500/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-green-300 text-sm">¡Email verificado! Redirigiendo...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inputs del código */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 text-center">
                  Código de Verificación
                </label>
                
                <div className="flex gap-2 justify-center">
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
                      disabled={loading || success}
                      className="w-12 h-14 text-center text-2xl font-bold bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {/* Botón verificar */}
              <button
                type="submit"
                disabled={loading || success || code.some(c => !c)}
                className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verificando...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verificado</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verificar Código</span>
                  </>
                )}
              </button>
            </form>

            {/* Reenviar código */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                ¿No recibiste el código?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || resending || success}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium disabled:opacity-50"
                >
                  {resending ? 'Reenviando...' : 'Reenviar'}
                </button>
              </p>
            </div>

            {/* Nota de seguridad */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 text-center">
                🔒 Por tu seguridad, el código expira en 15 minutos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VerificationPage