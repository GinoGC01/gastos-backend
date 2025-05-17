import app from './server.js'
import { connectDB } from './src/Config/db.js'

const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(error => {
    console.error('Initialization error:', error)
    process.exit(1)
  })
