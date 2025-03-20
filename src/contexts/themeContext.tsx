import { createContext } from "react";

export const ThemeContext = createContext({
  dark: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? true
    : false,
});
