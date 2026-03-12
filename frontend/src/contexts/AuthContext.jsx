import { createContext, useContext, useState, useEffect } from 'react'
import { setAuthToken, clearAuthToken } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      localStorage.setItem('token', token)
      // fetch current user
      import('../api').then(({ default: api }) => {
        api.get('/api/auth/me')
          .then(r => setUser(r.data))
          .catch(() => {
            // token invalid
            logout()
          })
      })
    } else {
      clearAuthToken()
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = (token, userInfo) => {
    setToken(token)
    setUser(userInfo)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
