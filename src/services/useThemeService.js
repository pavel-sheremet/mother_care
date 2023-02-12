// import { useSettingsStore } from '@/stores/useSettingsStore'
import { useTheme } from 'vuetify';
import { computed } from 'vue';
import { useLocalStorageService } from '@/services/useLocalStorageService'

export const useThemeService = () => {
    // constants
    const DARK_THEME_NAME = 'dark'
    const LIGHT_THEME_NAME = 'light'

    // use
    const theme = useTheme()
    const localStorage = useLocalStorageService()

    // computed
    const isDarkMode = computed(() => theme.global.current.value.dark)

    // actions
    const toggleTheme = () => {
        theme.global.name.value = isDarkMode.value ? LIGHT_THEME_NAME : DARK_THEME_NAME

        localStorage.set('theme_mode', theme.global.name.value)
    }

    return { DARK_THEME_NAME, LIGHT_THEME_NAME, isDarkMode, toggleTheme }
}