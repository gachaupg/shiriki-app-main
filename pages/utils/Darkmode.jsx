import { Context, createContext } from 'react';



const DarkMode =
  createContext({
    isDarkMode: false,
    setIsDarkMode: () => {},
    setUseDeviceSettings: () => {},
    useDeviceSettings: false,
  });

export default DarkMode;