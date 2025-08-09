import cron from 'node-cron'
import User from '../Models/User.js'

export const iniciarCronUsuarios = () => {
  // Ejecuta cada 5 minutos
  // esta cada 1 para el testeo
  // eslint-disable-next-line space-before-function-paren
  cron.schedule('*/5 * * * *', async () => {
    const ahora = new Date() // objeto Date para comparar con expiresAt (Date)

    console.log(`[CRON] Tick at ${ahora.toISOString()}`)

    try {
      // Buscar usuarios activos cuyo expiresAt ya pasó
      const vencidos = await User.find({
        activo: true,
        expiresAt: { $lte: ahora }
      })

      if (vencidos.length === 0) {
        console.log('[CRON] No hay usuarios vencidos aún.')
        return
      }

      console.log(`[CRON] Usuarios vencidos encontrados: ${vencidos.length}`)
      console.table(
        vencidos.map((u) => ({
          email: u.email,
          activo: u.activo,
          expiresAt: u.expiresAt.toISOString()
        }))
      )

      // Desactivar los usuarios vencidos
      const resultado = await User.updateMany(
        { activo: true, expiresAt: { $lte: ahora } },
        { $set: { activo: false } }
      )

      console.log(`[CRON] Usuarios desactivados automáticamente: ${resultado.modifiedCount}`)
    } catch (error) {
      console.error('[CRON] Error en verificación:', error.message)
    }
  })
}
