import express from 'express'
import { ReadAndGetAllData } from '../controller/data.js'
import { SaveTripData } from '../controller/data.js'
import { SaveUserData } from '../controller/auth.js'
import { loadUserData } from '../controller/auth.js'
import { readUsername } from '../controller/auth.js'
import { saveGoogleData } from '../controller/auth.js'
import { Gemini } from '../controller/data.js'
import { SaveLikedPLaces } from '../controller/data.js'
import { GetLikedTrips } from '../controller/data.js'
import { RemoveLikedPlaces } from '../controller/data.js'
import { RemoveSavedTrip } from '../controller/data.js'
const router = express.Router()


router.post('/RemoveSaved', RemoveSavedTrip)
router.post('/RemoveLiked', RemoveLikedPlaces)
router.post('/trips', SaveTripData)
router.post('/liked', SaveLikedPLaces)
router.get('/liked', GetLikedTrips)
router.get('/trips', ReadAndGetAllData)
router.get('/users', readUsername)
router.post('/users/register', SaveUserData)
router.post('/users/login', loadUserData)
router.post('/users/google', saveGoogleData)
router.post('/gemini', Gemini)

export default router
