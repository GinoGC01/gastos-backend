import app from './server.js'
import { connectDB } from './src/Config/db.js'
import { iniciarCronUsuarios } from './src/Cron/actualizarUsuarios.js'

const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    iniciarCronUsuarios()
  })
  .catch(error => {
    console.error('Initialization error:', error)
    process.exit(1)
  })
