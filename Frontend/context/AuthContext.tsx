'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '../lib/api'
interface User { id: number; email: string; name: string; role: string }
const AuthContext = createContext<{ user: User | null; login: (t: string) => void; logout: () => void; loading: boolean }>({ user: null, login: () => { }, logout: () => { }, loading: true })
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const fetchUser = async () => {
    try {
      const { data } = await api.get('/users/me')
      setUser(data)
    } catch {
      setUser(null)
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (localStorage.getItem('accessToken')) fetchUser()
    else setLoading(false)
  }, [])
  const login = (token: string) => {
    localStorage.setItem('accessToken', token)
    fetchUser()
    router.push('/')
  }
  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
    router.push('/auth/login')
  }
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}