import React from "react"
import { useTheme } from "./Theme"   

const InputField = ({
  type = "text",
  placeholder,
  iconLight,
  iconDark,
  value,
  onChange,
  className = "",
}) => {
  const { darkMode } = useTheme()   

  return (
    <div className={`relative flex items-center mb-4 ${className}`}>
      <span className="absolute left-3 text-gray-400 dark:text-gray-500">
        <img
          src={darkMode ? iconDark : iconLight}
          alt="icon"
          className="w-5 h-5"
        />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border rounded border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
      />
    </div>
  )
}

export default InputField
