import app from './server.js'
import { connectDB } from './src/Config/db.js'
import { iniciarCronUsuarios } from './src/Cron/actualizarUsuarios.js'
import { PORT } from './src/config.js'


connectDB()
  .then(() => {
    app.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`))
    iniciarCronUsuarios()
  })
  .catch(error => {
    console.error('Initialization error:', error)
    process.exit(1)
  })
