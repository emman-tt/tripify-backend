import { json } from 'express'
import { db } from '../data/firebase.js'
import admin from 'firebase-admin'
import { error } from 'console'

export async function SaveUserData (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    await db.ref(`users/${uid}/profile`).set({
      user: req.body.user,
      email: req.body.email
    })

    res.status(200).json({ message: 'User profile saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function saveGoogleData (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid
    const userName = decoded.name
    const email = decoded.email

    await db.ref(`users/${uid}/profile`).set({
      user: userName,
      email: email
    })

    res.status(200).json({ message: 'User profile saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function loadUserData (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })
    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    const snapshot = await db.ref(`users/${uid}/profile`).once('value')
    res.status(200).json(snapshot.val() || 'invalid')

    res.status(200).json({ message: 'User profile verified' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function readUsername (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })
    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid
    const snapshot = await db.ref(`users/${uid}/profile`).once('value')
    const userName = snapshot.val().user
    res.status(200).json(userName || 'invalid')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
