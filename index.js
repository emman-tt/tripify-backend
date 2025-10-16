import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routesFiles from './routes/route.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000;
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app
