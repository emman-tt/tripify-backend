
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { cert } from 'firebase-admin/app'

dotenv.config()

console.log('=== Firebase Initialization ===')
console.log(
  'FIREBASE_SERVICE_ACCOUNT_KEY exists:',
  !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
)
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)

let db

try {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

  if (!keyPath) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set'
    )
  }

  const serviceAccount = JSON.parse(keyPath)

  admin.initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  })

  db = admin.database()
  console.log(' Firebase initialized successfully')
} catch (error) {
  console.error(' Firebase initialization failed:', error.message)
  console.error('Error details:', error)
}

export { admin, db }
