import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routesFiles from './routes/route.js'

dotenv.config()
const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

app.use(express.json())

app.use('/api', routesFiles)

app.get('/', (req, res) => {
  res.json({ message: 'Tripify Backend is running successfully on Vercel!' })
})

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`)
  })
}

export default app
