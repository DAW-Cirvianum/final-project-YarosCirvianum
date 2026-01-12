import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/login', { login, password })
      localStorage.setItem('token', res.data.token)
      navigate('/') // dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error login')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        <div className="mb-3">
          <label>Email / username</label>
          <input
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Log In
        </button>
        <p className="mt-3 text-sm text-center">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-500 underline">
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
