import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Login({ onCambiar }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setCargando(false)
    if (error) setError('Correo o contraseña incorrectos')
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2>Iniciar sesión</h2>

      <label>Correo electrónico
        <input type="email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label>Contraseña
        <input type="password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="enlace">
        ¿No tienes cuenta?{' '}
        <button type="button" className="link" onClick={onCambiar}>Regístrate</button>
      </p>
    </form>
  )
}