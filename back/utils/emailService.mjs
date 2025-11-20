import nodemailer from 'nodemailer'

// ✅ Configurar el transportador con Mailtrap
const transporter = nodemailer.createTransport({
  service: 'gmail',
  //host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  //port: parseInt(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER, // Tu usuario de Mailtrap
    pass: process.env.EMAIL_PASSWORD // Tu contraseña de Mailtrap
  }
})

// Función para enviar email de verificación
export const sendVerificationEmail = async (email, fullName, verificationCode) => {
  try {
    const mailOptions = {
      from: `"GesShop" <${process.env.EMAIL_USER}>`,
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
    console.log('✅ Email enviado:', info.messageId)
    return info

  } catch (error) {
    console.error('❌ Error al enviar email:', error)
    throw new Error('No se pudo enviar el email de verificación')
  }
}

// ✅ NUEVO: Función para enviar confirmación de compra
export const sendPurchaseConfirmation = async (email, fullName, orderDetails) => {
  try {
    const { items, total, orderNumber, date } = orderDetails

    // Construir tabla HTML de productos
    const itemsHTML = items.map(item => `
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 15px; color: #e2e8f0;">${item.name}</td>
        <td style="padding: 15px; text-align: center; color: #94a3b8;">${item.quantity}</td>
        <td style="padding: 15px; text-align: right; color: #10b981;">$${parseFloat(item.price).toFixed(2)}</td>
        <td style="padding: 15px; text-align: right; color: #10b981; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')

    const mailOptions = {
      from: `"GesShop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Confirmación de compra #${orderNumber}`,
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
              max-width: 650px;
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
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .success-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              font-size: 40px;
            }
            h1 {
              color: #ffffff;
              font-size: 28px;
              margin: 0 0 10px 0;
            }
            .order-number {
              color: #10b981;
              font-size: 18px;
              font-weight: bold;
            }
            .info-box {
              background: #0f172a;
              border: 1px solid #334155;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #334155;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: #94a3b8;
              font-size: 14px;
            }
            .info-value {
              color: #e2e8f0;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: #0f172a;
              border-radius: 12px;
              overflow: hidden;
            }
            th {
              background: #1e293b;
              padding: 15px;
              text-align: left;
              color: #e2e8f0;
              font-weight: 600;
              font-size: 14px;
            }
            .total-row {
              background: #1e293b;
              font-weight: bold;
            }
            .total-row td {
              padding: 20px 15px;
              font-size: 18px;
              color: #10b981;
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
              <div class="header">
                <div class="success-icon">✓</div>
                <h1>¡Compra Confirmada!</h1>
                <p class="order-number">Orden #${orderNumber}</p>
              </div>

              <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 20px;">
                Hola <strong>${fullName}</strong>,
              </p>

              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Gracias por tu compra. Hemos recibido tu orden y está siendo procesada. 
                A continuación encontrarás los detalles de tu pedido:
              </p>

              <div class="info-box">
                <div class="info-row">
                  <span class="info-label">Número de orden:</span>
                  <span class="info-value">#${orderNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha:</span>
                  <span class="info-value">${date}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Estado:</span>
                  <span class="info-value" style="color: #10b981;">Confirmado</span>
                </div>
              </div>

              <h2 style="color: #ffffff; font-size: 20px; margin: 30px 0 15px 0;">
                Detalles del Pedido
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL:</td>
                    <td style="text-align: right;">$${parseFloat(total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #6ee7b7; font-size: 13px; margin: 0;">
                  ✓ Tu orden será procesada en las próximas 24-48 horas
                </p>
              </div>

              <div class="footer">
                <p class="footer-text">
                  Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                </p>
                <p class="footer-text">
                  © ${new Date().getFullYear()} GesShop. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email de confirmación enviado:', info.messageId)
    return info

  } catch (error) {
    console.error('❌ Error al enviar email de confirmación:', error)
    throw new Error('No se pudo enviar el email de confirmación')
  }
}

// Verificar la configuración del transportador
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify()
    console.log('✅ Servidor de email listo para enviar mensajes (Mailtrap)')
  } catch (error) {
    console.error('❌ Error en la configuración del email:', error)
  }
}