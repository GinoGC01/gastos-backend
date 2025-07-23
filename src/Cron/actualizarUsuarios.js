import cron from 'node-cron'
import User from '../Models/User.js'

export const iniciarCronUsuarios = () => {
  cron.schedule('*/1 * * * *', async () => { // cada 5 minutos
    const ahora = new Date()
    console.log(`[CRON] Tick at ${ahora.toISOString()}`)

    try {
      const vencidos = await User.find({ activo: true, expiresAt: { $lte: ahora } })

      if (vencidos.length === 0) {
        console.log('[CRON] No hay usuarios vencidos aún.')
      } else {
        console.log(`[CRON] Usuarios vencidos encontrados: ${vencidos.length}`)
        console.table(vencidos.map(u => ({
          email: u.email,
          activo: u.activo,
          expiresAt: u.expiresAt.toISOString()
        })))

        const resultado = await User.updateMany(
          { activo: true, expiresAt: { $lte: ahora } },
          { $set: { activo: false } }
        )

        console.log(`[CRON] Usuarios desactivados automáticamente: ${resultado.modifiedCount}`)
      }
    } catch (err) {
      console.error('[CRON] Error en verificación:', err.message)
    }
  })
}

// Cuando el usuario inicia sesión:

// Se activa (activo: true)

// Se le asigna una expiración (expiresAt: Date.now() + 1h)

// Aunque no interactúe más:

// Cada 5 minutos el cron revisa si algún expiresAt venció.

// Si sí → actualiza activo: false.
