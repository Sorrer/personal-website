import { defineStore } from "pinia"
import { ref } from "vue"

export type THEME_VALUES = "light" | "dark";

export const useThemeStore = defineStore('themeStore', () => {

    const theme = ref<THEME_VALUES>("dark");

    function applyTheme() {
        document.body.setAttribute('data-theme', theme.value);
        document.documentElement.classList.toggle('dark', theme.value === 'dark');
    }

    function toggleTheme()
    {
        theme.value = theme.value === "dark" ? "light" : "dark";
        applyTheme();
    }

    // Apply initial theme
    applyTheme();

    return { toggleTheme, theme }
  })
  