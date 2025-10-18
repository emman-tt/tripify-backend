import express, { response } from 'express'
import { db } from '../data/firebase.js'
import admin from 'firebase-admin'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import { error } from 'console'

dotenv.config()

export async function RemoveLikedPlaces (req, res) {
  try {
    const auth = req.headers.authorization
    const token = auth.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'No token here' })
    }

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    const snapshot = await db.ref(`users/${uid}/liked`).once('value')
    if (snapshot.exists()) {
      const promises = []
      snapshot.forEach(item => {
        const data = item.val()
        if (data.name === req.body.name) {
          console.log(data)
          promises.push(item.ref.remove())
        }
      })
      await Promise.all(promises)
      res.status(200).json('done')
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
export async function RemoveSavedTrip (req, res) {
  try {
    const auth = req.headers.authorization
    const token = auth.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'No token here' })
    }

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    const snapshot = await db.ref(`users/${uid}/trips`).once('value')
    if (snapshot.exists()) {
      const promises = []
      snapshot.forEach(item => {
        const data = item.val()
        if (data.destination === req.body.name) {
          console.log(data)
          promises.push(item.ref.remove())
        }
      })
      await Promise.all(promises)
      res.status(200).json('done')
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

export async function SaveLikedPLaces (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'No token here' })
    }

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    let alreadyExist = false
    const snapshot = await db.ref(`users/${uid}/liked`).once('value')
    if (snapshot.exists()) {
      snapshot.forEach(item => {
        const tripData = item.val()
        if (req.body.placeName === tripData.name) {
          alreadyExist = true
          return true
        }
      })
    }

    if (!alreadyExist) {
      const likedTrips = db.ref(`users/${uid}/liked`).push()

      await likedTrips.set({
        name: req.body.placeName,
        image: req.body.placeImage,
        description: req.body.placeDescription,
        liked: true
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function SaveTripData (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    let alreadyExist = false
    const snapshot = await db.ref(`users/${uid}/trips`).once('value')
    if (snapshot.exists()) {
      snapshot.forEach(item => {
        const tripData = item.val()
        if (req.body.destination === tripData.destination) {
          alreadyExist = true
          return true
        }
      })
    }

    if (!alreadyExist) {
      const newTripRef = db.ref(`users/${uid}/trips`).push()
      await newTripRef.set({
        country: req.body.tripCountry,
        arrivalDate: req.body.tripArrival,
        departureDate: req.body.tripDeparture,
        location: req.body.tripLocation,
        destination: req.body.tripDestination,
        people: req.body.tripPeople,
        note: req.body.tripNote,
        createdAt: Date.now()
      })
    }

    res.status(200).json({ id: newTripRef.key, message: 'Trip added' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function GetLikedTrips (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    const snapshot = await db.ref(`users/${uid}/liked`).once('value')
    if (snapshot.exists()) {
      const allTripsData = []
      snapshot.forEach(item => {
        const tripKey = item.key
        const tripData = item.val()

        allTripsData.push({
          id: tripKey,
          body: tripData
        })
      })
      res.status(200).json(allTripsData)
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

export async function ReadAndGetAllData (req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    const snapshot = await db.ref(`users/${uid}/trips`).once('value')

    if (snapshot.exists()) {
      const allTripsData = []
      snapshot.forEach(item => {
        const tripKey = item.key
        const tripData = item.val()

        allTripsData.push({
          id: tripKey,
          body: tripData
        })
      })
      res.status(200).json(allTripsData)
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const placeNames = [
  'Paris',
  'Nice',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Toulouse',
  'Cannes',
  'Strasbourg',
  'Montpellier',
  'Avignon',

  'Rome',
  'Venice',
  'Florence',
  'Milan',
  'Naples',
  'Verona',
  'Pisa',
  'Siena',
  'Amalfi',
  'Capri',

  'Tokyo',
  'Kyoto',
  'Osaka',
  'Sapporo',
  'Nara',
  'Hiroshima',
  'Nagoya',
  'Fukuoka',
  'Kobe',
  'Yokohama',

  'Grand Canyon',
  'New York City',
  'Miami Beach',
  'Yellowstone National Park',
  'San Francisco',
  'Las Vegas',
  'Hawaii (Maui)',
  'Chicago',
  'Los Angeles',
  'Washington, D.C.',

  'Cape Town',
  'Kruger National Park',
  'Durban',
  'Johannesburg',
  'Stellenbosch (Winelands)',
  'Garden Route',
  'Robben Island',
  'Drakensberg Mountains',
  'Hermanus',
  'Pretoria',

  'Taj Mahal (Agra)',
  'Goa',
  'Jaipur',
  'Kerala (Backwaters)',
  'Varanasi',
  'Delhi',
  'Mumbai',
  'Himalayas (Leh-Ladakh)',
  'Rishikesh',
  'Amritsar (Golden Temple)',

  'Moscow (Red Square, Kremlin)',
  'St. Petersburg',
  'Lake Baikal',
  'Sochi',
  'Kazan',
  'Vladivostok',
  'Murmansk (Northern Lights)',
  'Novosibirsk',
  'Yekaterinburg',
  'Kamchatka Peninsula',

  'Christ the Redeemer (Rio de Janeiro)',
  'Amazon Rainforest (Manaus)',
  'Iguazu Falls',
  'Salvador (Bahia)',
  'São Paulo',
  'Pantanal',
  'Fernando de Noronha',
  'Brasília',
  'Florianópolis',
  'Ouro Preto',

  'Cape Coast Castle',
  'Accra',
  'Kakum National Park',
  'Kumasi (Ashanti Region)',
  'Mole National Park',
  'Lake Volta',
  'Elmina Castle',
  'Labadi Beach (Accra)',
  'Wli Waterfalls',
  'Nzulezu Stilt Village',

  'Lagos',
  'Abuja',
  'Yankari National Park',
  'Calabar',
  'Olumo Rock (Abeokuta)',
  'Osun-Osogbo Sacred Grove',
  'Benin City',
  'Ikogosi Warm Springs',
  'Kano',
  'Obudu Mountain Resort',

  'Sagrada Família (Barcelona)',
  'Alhambra (Granada)',
  'Madrid',
  'Ibiza',
  'Seville',
  'Camino de Santiago',
  'Valencia',
  'Picos de Europa',
  'San Sebastián',
  'Toledo',

  'Maasai Mara National Reserve',
  'Nairobi',
  'Diani Beach',
  'Mount Kenya',
  'Lamu Island',
  'Amboseli National Park',
  'Lake Nakuru',
  'Mombasa',
  "Hell's Gate National Park",
  'Tsavo National Parks',

  'London',
  'Edinburgh',
  'Stonehenge',
  'Lake District',
  'Bath',
  'Scottish Highlands',
  'Oxford',
  'Cornwall',
  "Giant's Causeway (Northern Ireland)",
  'York',

  'Banff National Park',
  'Niagara Falls',
  'Toronto',
  'Vancouver',
  'Quebec City',
  'Jasper National Park',
  'Montreal',
  'Churchill (Manitoba)',
  'Whistler',
  'Canadian Rockies',

  'Burj Khalifa (Dubai)',
  'Sheikh Zayed Grand Mosque (Abu Dhabi)',
  'Dubai Mall & Fountain',
  'Desert Safari',
  'Palm Jumeirah',
  'Abu Dhabi Louvre',
  'Hatta',
  'Al Ain Oasis',
  'Dubai Marina',
  'Sharjah Arts District',

  'Great Wall of China',
  'Forbidden City (Beijing)',
  'Shanghai',
  "Terracotta Army (Xi'an)",
  'Li River (Guilin)',
  'Zhangjiajie National Forest Park',
  'Chengdu (Panda Research Base)',
  'Huangshan (Yellow Mountains)',
  'Jiuzhaigou Valley',
  'Hong Kong'
]

console.log(`Total places: ${placeNames.length}`)

export async function Gemini (req, res) {
  try {
    const search = req.body.userInput
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = await admin.auth().verifyIdToken(token)
    const uid = decoded.uid

    const searchesRef = db.ref(`users/${uid}/searches`)
    const snapshot = await searchesRef.once('value')

    const SEARCH_LIMIT = 10

    if (snapshot.exists()) {
      const searches = snapshot.val()

      let totalSearchCount = 0
      for (const data of Object.values(searches)) {
        totalSearchCount += data.numberOfTimes || 0
      }

      if (totalSearchCount >= SEARCH_LIMIT) {
        return res.status(429).json({
          error: 'Search limit reached',
          message: `You've reached the maximum of ${SEARCH_LIMIT} searches.`,
          totalSearches: totalSearchCount,
          limit: SEARCH_LIMIT
        })
      }

      for (const [key, data] of Object.entries(searches)) {
        if (data.search === search) {
          await searchesRef.child(key).update({
            numberOfTimes: (data.numberOfTimes || 0) + 1
          })

          return res.status(200).json({
            results: data.result,
            cached: true
          })
        }
      }
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API })

    const prompt = `
You are an AI travel assistant for an app called Tripify.

The user will describe their dream vacation. 
You are given a list of available travel destinations.
Based on your general knowledge, select only the destinations that best fit the user's description.

Return ONLY the matching destinations as a JSON array like this:
["Place 1", "Place 2", "Place 3"]
Return ONLY a JSON array with no markdown formatting, no code blocks, no explanation. Just pure JSON.
User description:
"${search}"

Available destinations:
${JSON.stringify(placeNames)}
`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    })

    const response = result.text

    try {
      const matches = JSON.parse(response)

      await searchesRef.push({
        search: search,
        result: matches,
        numberOfTimes: 1
      })

      const snapshot2 = await searchesRef.once('value')
      let newTotal = 0
      if (snapshot2.exists()) {
        for (const data of Object.values(snapshot2.val())) {
          newTotal += data.numberOfTimes || 0
        }
      }

      res.status(200).json(matches)
      return
    } catch (parseError) {
      console.error('AI response parse error:', response)
      return res.status(500).json({
        error: 'Failed to parse AI response',
        details: parseError.message
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}
