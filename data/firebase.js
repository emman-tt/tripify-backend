import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { cert } from 'firebase-admin/app'

dotenv.config()

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
const serviceAccount = JSON.parse(keyPath)
console.log('Starting application...')
console.log('Environment variables loaded:', Object.keys(process.env))
admin.initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
})

const db = admin.database()

export { admin, db }
