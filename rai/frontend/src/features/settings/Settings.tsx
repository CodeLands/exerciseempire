import React from "react";
import { useDarkMode } from "./DarkModeContext";

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [is2FAToggled, setIs2FAToggled] = React.useState(false);

  const handle2FAToggle = () => {
    setIs2FAToggled(!is2FAToggled);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Settings
      </h2>
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
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
          <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Two-factor authentication (2FA)
          </span>
        </label>
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
          Theme Settings
        </h3>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Dark Mode
          </span>
        </label>
      </div>
    </div>
  );
};

export default Settings;
