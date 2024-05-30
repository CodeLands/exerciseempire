import React, { useState } from "react";

export default function Settings() {
  const [is2FAToggled, setIs2FAToggled] = useState(false);
  const [isDarkModeToggled, setIsDarkModeToggled] = useState(false);

  const handle2FAToggle = () => {
    setIs2FAToggled(!is2FAToggled);
  };

  const handleDarkModeToggle = () => {
    setIsDarkModeToggled(!isDarkModeToggled);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Settings</h2>
      <div className="mb-8">
        <h3 className="text-l font-medium text-gray-600 mb-4">
          Account Settings
        </h3>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={is2FAToggled}
            onChange={handle2FAToggle}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-black">
            Enable Two-factor authentication (2FA)
          </span>
        </label>
      </div>
      <div>
        <h3 className="text-l font-medium text-gray-600 mb-4">
          Theme Settings
        </h3>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDarkModeToggled}
            onChange={handleDarkModeToggle}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-black">
            Enable Dark Mode
          </span>
        </label>
      </div>
    </div>
  );
}
