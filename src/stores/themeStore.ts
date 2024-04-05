import { defineStore } from "pinia"
import { computed, ref } from "vue"

export type THEME_VALUES = "light" | "dark";

export const useThemeStore = defineStore('themeStore', () => {
    
    const theme = ref<THEME_VALUES>("dark");

    function toggleTheme()
    {
        console.log(theme.value);

        if(theme.value === "dark")
        {
            theme.value = "light"
        }
        else
        {
            theme.value = "dark"
        }

        window.document.getElementsByTagName('body')[0].setAttribute('data-theme', theme.value);


    }

    return { toggleTheme, theme }
  })
  