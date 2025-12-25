import { ref, readonly, onMounted } from 'vue'

export const useTheme = () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
    updateTheme()
  }

  const updateTheme = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  const initTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') {
        isDark.value = true
      } else if (stored === 'light') {
        isDark.value = false
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      updateTheme()
    }
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    initTheme
  }
}