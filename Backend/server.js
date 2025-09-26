import express from "express"
import cors from "cors"
import admin from "firebase-admin"
import dotenv from "dotenv"
import { readFileSync } from "fs"

dotenv.config()

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const app = express()
app.use(cors())
app.use(express.json())

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const idToken = authHeader.split(" ")[1]
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    next()
  } catch (err) {
    console.error("Token verification failed:", err)
    res.status(401).json({ error: "Unauthorized" })
  }
}

app.post("/login", async (req, res) => {
  const { idToken } = req.body
  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    res.json({ message: "Login verified", user: decoded })
  } catch (err) {
    console.error("Login verification failed:", err)
    res.status(401).json({ error: "Invalid token" })
  }
})

app.post("/google-login", async (req, res) => {
  const { idToken } = req.body
  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    res.json({ message: "Google login verified", user: decoded })
  } catch (err) {
    console.error("Google login failed:", err)
    res.status(401).json({ error: "Invalid token" })
  }
})


app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    )

    const data = await response.json()
    if (data.error) return res.status(400).json({ error: data.error.message })

    const userRef = db.collection("users").doc(data.localId)
    await userRef.set({
      firstName,
      lastName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.json({
      message: "Signup successful",
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      userId: data.localId,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Signup failed" })
  }
})


app.get("/home", authenticate, (req, res) => {
  res.json({ message: "Protected route access granted", user: req.user })
})

app.get("/get-user", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid
    const userRef = db.collection("users").doc(uid)
    const snap = await userRef.get()
    if (!snap.exists) {
      await userRef.set({ email: req.user.email, buttonClicks: 0 })
      return res.json({ buttonClicks: 0 })
    }
    res.json(snap.data())
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" })
  }
})

app.post("/increment-click", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid
    const userRef = db.collection("users").doc(uid)
    await userRef.set(
      { email: req.user.email, buttonClicks: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    )
    const snap = await userRef.get()
    res.json(snap.data())
  } catch (err) {
    res.status(500).json({ error: "Failed to increment click" })
  }
})

app.post("/logout", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid
    await admin.auth().revokeRefreshTokens(uid)
    res.json({ message: "User logged out. Tokens revoked." })
  } catch (err) {
    console.error("Logout failed:", err)
    res.status(500).json({ error: "Logout failed" })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
