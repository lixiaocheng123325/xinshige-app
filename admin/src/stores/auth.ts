import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const admin = ref(JSON.parse(localStorage.getItem('admin_info') || 'null'))

  const setToken = (t: string) => {
    token.value = t
    localStorage.setItem('admin_token', t)
  }

  const setAdmin = (a: any) => {
    admin.value = a
    localStorage.setItem('admin_info', JSON.stringify(a))
  }

  const logout = () => {
    token.value = ''
    admin.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
  }

  return { token, admin, setToken, setAdmin, logout }
})
