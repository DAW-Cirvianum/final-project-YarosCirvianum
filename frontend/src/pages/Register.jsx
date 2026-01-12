import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    try {
      const res = await api.post('/register', {
        name,
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })

      console.log('Registro correcte:', res.data)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      // Mostrar tot l'error per la consola
      console.error('Error registre:', err.response?.data)

      if (err.response?.status === 422) {
        // Captura els errors detallats per camp
        setErrors(err.response.data.errors || { general: err.response.data.message })
      } else {
        setErrors({ general: 'Error inesperat' })
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border w-full p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
        </div>

        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border w-full p-2 rounded"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username[0]}</p>}
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border w-full p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border w-full p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
        </div>

        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>

        {errors.general && <p className="text-red-500 mb-3">{errors.general}</p>}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Register
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-500 underline">
            Log In
          </button>
        </p>
      </form>
    </div>
  )
}

export default Register