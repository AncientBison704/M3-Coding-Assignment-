import React, { useEffect, useState } from "react"
import { auth } from "../firebase/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import DarkModeToggle from "./DarkModeToggle"

const Home = () => {
  const [clickCount, setClickCount] = useState(0)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const forceLogout = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      try {
        const token = await user.getIdToken()
        const res = await fetch(`${API_URL}/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 401) {
          return forceLogout()
        }

        if (!res.ok) throw new Error("Failed to fetch user data")
        const data = await res.json()
        setClickCount(data.buttonClicks || 0)
      } catch (err) {
        console.error(err)
        setError("Could not load user data")
      }
    }

    fetchUserData()
  }, [user])

  const handleClick = async () => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`${API_URL}/increment-click`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (res.status === 401) {
        return forceLogout()
      }

      if (!res.ok) throw new Error("Failed to increment click")
      const data = await res.json()
      setClickCount(data.buttonClicks)
    } catch (err) {
      console.error(err)
      console.log("Backend URL:", import.meta.env.VITE_API_URL);
      setError("Failed to increment")
    }
  }

  const handleLogout = async () => {
    try {
      const token = await user.getIdToken()
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      await signOut(auth)
      localStorage.removeItem("token")
      navigate("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>
  if (!user) return <p className="text-center mt-20">Not logged in</p>

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <DarkModeToggle />

      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user.displayName || user.email}
      </h1>

      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
      >
        Click Me
      </button>

      <p className="mt-4 text-lg">
        You’ve clicked this button <strong>{clickCount}</strong> times.
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
      >
        Logout
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

export default Home
