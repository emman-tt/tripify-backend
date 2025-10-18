import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routesFiles from './routes/route.js'

dotenv.config()
const app = express()

app.use(cors)

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST']
//   })
// )

app.use(express.json())

app.use('/api', routesFiles)

app.get('/', (req, res) => {
  res.json({ message: 'Tripify Backend is running successfully!' })
})

const PORT = process.env.PORT 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`)
})

export default app
