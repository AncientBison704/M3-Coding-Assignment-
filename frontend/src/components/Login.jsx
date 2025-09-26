import React, { useState } from "react"
import logo from "../assets/logo.png"
import mailLight from "../assets/email.svg"
import mailDark from "../assets/email_dark.svg"
import passwordLight from "../assets/password.svg"
import passwordDark from "../assets/password_dark.svg"
import InputField from "./InputField"
import DarkModeToggle from "./DarkModeToggle"

import { auth } from "../firebase/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await result.user.getIdToken()

      await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      localStorage.setItem("token", idToken)
      setSuccess(" Logged in successfully")
      navigate("/home")
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      localStorage.setItem("token", idToken)
      setSuccess(" Logged in with Google")
      navigate("/home")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative">
      <DarkModeToggle />

      <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
        >
          <img src={logo} alt="Logo" className="w-auto h-10 mb-4" />
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Sign In</h1>

          <InputField
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            iconLight={mailLight}
            iconDark={mailDark}
          />

          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconLight={passwordLight}
            iconDark={passwordDark}
          />

          <button type="submit" className="w-full py-2 mb-4 rounded bg-blue-500 text-white hover:bg-blue-400">
            Sign In
          </button>

          <p class="mt-4 text-center text-gray-600 dark:text-gray-400">or sign in with</p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full px-6 mt-4 py-2 mb-4 border rounded 
                       border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                       text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-6 h-6 mx-2"
            />
            <span>Continue with Google</span>
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="text-center mt-4">
            <a href="/signup" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
              Don’t have an account yet? Sign Up
            </a>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Login
