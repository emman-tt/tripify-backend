import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { cert } from 'firebase-admin/app'
import fs from 'fs'

dotenv.config()

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'))

admin.initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
})

const db = admin.database()

export { admin, db }
