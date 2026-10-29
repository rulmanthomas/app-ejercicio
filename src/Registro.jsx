import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Registro({ onCambiar }) {
  const [f, setF] = useState({
    alias: '', email: '', password: '', sexo: '',
    fecha_nacimiento: '', peso: '', talla: '', objetivo: '',
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (e) => setF({ ...f, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    const { error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        data: {
          alias: f.alias,
          sexo: f.sexo,
          fecha_nacimiento: f.fecha_nacimiento,
          objetivo: f.objetivo,
          peso_inicial: f.peso,
          talla_cm: f.talla,
          zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    })

    setCargando(false)
    if (error) setError(error.message)
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2>Crear cuenta</h2>

      <label>Nombre o alias
        <input name="alias" value={f.alias} onChange={cambiar} required />
      </label>

      <label>Correo electrónico
        <input name="email" type="email" value={f.email} onChange={cambiar} required />
      </label>

      <label>Contraseña (mínimo 8 caracteres)
        <input name="password" type="password" minLength={8}
               value={f.password} onChange={cambiar} required />
      </label>

      <label>Sexo
        <select name="sexo" value={f.sexo} onChange={cambiar} required>
          <option value="">Selecciona...</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
          <option value="prefiero_no_decir">Prefiero no decirlo</option>
        </select>
      </label>

      <label>Fecha de nacimiento (opcional)
        <input name="fecha_nacimiento" type="date"
               value={f.fecha_nacimiento} onChange={cambiar} />
      </label>

      <label>Peso inicial (kg)
        <input name="peso" type="number" step="0.1" min="20" max="400"
               value={f.peso} onChange={cambiar} required />
      </label>

      <label>Talla (cm)
        <input name="talla" type="number" step="0.1" min="100" max="250"
               value={f.talla} onChange={cambiar} required />
      </label>

      <label>Objetivo personal
        <select name="objetivo" value={f.objetivo} onChange={cambiar} required>
          <option value="">Selecciona...</option>
          <option value="fuerza">Fuerza</option>
          <option value="resistencia">Resistencia</option>
          <option value="salud_general">Salud general</option>
          <option value="otro">Otro</option>
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Registrarme'}
      </button>

      <p className="enlace">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="link" onClick={onCambiar}>Inicia sesión</button>
      </p>
    </form>
  )
}