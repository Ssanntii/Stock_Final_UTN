import nodemailer from 'nodemailer'

// Configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar gmail, outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación
  }
})

// Función para enviar email de verificación
export const sendVerificationEmail = async (email, fullName, verificationCode) => {
  try {
    const mailOptions = {
      from: `"Gestock" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifica tu cuenta - Código de verificación',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #0f172a;
              color: #e2e8f0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .card {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              border-radius: 16px;
              padding: 40px;
              border: 1px solid #334155;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo-circle {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              border-radius: 20px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .logo-icon {
              font-size: 40px;
              color: white;
            }
            h1 {
              color: #ffffff;
              font-size: 28px;
              margin: 0 0 10px 0;
              text-align: center;
            }
            .subtitle {
              color: #94a3b8;
              text-align: center;
              margin-bottom: 30px;
              font-size: 16px;
            }
            .greeting {
              color: #e2e8f0;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .code-container {
              background: #0f172a;
              border: 2px solid #3b82f6;
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
            }
            .code-label {
              color: #94a3b8;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .code {
              font-size: 42px;
              font-weight: bold;
              color: #3b82f6;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .info {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin: 20px 0;
            }
            .warning {
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.3);
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            .warning-text {
              color: #fca5a5;
              font-size: 13px;
              margin: 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 30px;
              border-top: 1px solid #334155;
            }
            .footer-text {
              color: #64748b;
              font-size: 13px;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">
                <div class="logo-circle">
                  <span class="logo-icon">📦</span>
                </div>
                <h1>Verifica tu Email</h1>
                <p class="subtitle">Gestión de Productos</p>
              </div>

              <p class="greeting">Hola <strong>${fullName}</strong>,</p>

              <p class="info">
                Gracias por registrarte en nuestra plataforma. Para completar tu registro y comenzar a usar tu cuenta, 
                necesitamos verificar tu dirección de email.
              </p>

              <div class="code-container">
                <p class="code-label">Tu código de verificación es:</p>
                <div class="code">${verificationCode}</div>
              </div>

              <p class="info">
                Ingresa este código en la página de verificación para activar tu cuenta.
              </p>

              <div class="warning">
                <p class="warning-text">
                  ⚠️ Este código expirará en 15 minutos por seguridad. 
                  Si no solicitaste este código, puedes ignorar este email.
                </p>
              </div>

              <div class="footer">
                <p class="footer-text">
                  Si tienes algún problema, no dudes en contactarnos.
                </p>
                <p class="footer-text">
                  © ${new Date().getFullYear()} Gestión de Productos. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email enviado:', info.messageId)
    return info

  } catch (error) {
    console.error('Error al enviar email:', error)
    throw new Error('No se pudo enviar el email de verificación')
  }
}

// Verificar la configuración del transportador
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify()
    console.log('✅ Servidor de email listo para enviar mensajes')
  } catch (error) {
    console.error('❌ Error en la configuración del email:', error)
  }
}