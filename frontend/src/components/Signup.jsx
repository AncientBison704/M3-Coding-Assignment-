import React, { useState } from "react"
import logo from "../assets/logo.png"
import userLight from "../assets/user.svg"
import userDark from "../assets/user_dark.svg"
import mailLight from "../assets/email.svg"
import mailDark from "../assets/email_dark.svg"
import passwordLight from "../assets/password.svg"
import passwordDark from "../assets/password_dark.svg"
import InputField from "./InputField"
import DarkModeToggle from "./DarkModeToggle"
import { auth } from "../firebase/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")

      setSuccess("Account created successfully")
      localStorage.setItem("token", data.idToken)
      await signInWithEmailAndPassword(auth, email, password)
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
          onSubmit={handleSignup}
          className="w-full max-w-md p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
        >
          <img src={logo} alt="Logo" className="w-auto h-10 mb-4" />
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Sign Up</h1>

          <div className="flex gap-4">
            <InputField
              placeholder="First Name"
              iconLight={userLight}
              iconDark={userDark}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2"
            />
            <InputField
              placeholder="Last Name"
              iconLight={userLight}
              iconDark={userDark}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2"
            />
          </div>

          <InputField
            type="email"
            placeholder="Email Address"
            iconLight={mailLight}
            iconDark={mailDark}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            type="password"
            placeholder="Password"
            iconLight={passwordLight}
            iconDark={passwordDark}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputField
            type="password"
            placeholder="Confirm Password"
            iconLight={passwordLight}
            iconDark={passwordDark}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 mb-4 rounded bg-blue-500 text-white hover:bg-blue-400"
          >
            Sign Up
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="text-center mt-4">
            <a href="/" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
              Already have an account? Log In
            </a>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Signup
