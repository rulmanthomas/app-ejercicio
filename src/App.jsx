import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import Registro from './Registro'

function App() {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [modo, setModo] = useState('login')
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSesion(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!sesion) {
      setPerfil(null)
      return
    }
    supabase
      .from('profiles')
      .select('alias, objetivo, meta_semanal')
      .eq('id', sesion.user.id)
      .single()
      .then(({ data }) => setPerfil(data))
  }, [sesion])

  if (cargando) return <main className="centro"><p>Cargando...</p></main>

  if (!sesion) {
    return (
      <main className="centro">
        <h1>Mi App de Ejercicio</h1>
        {modo === 'login'
          ? <Login onCambiar={() => setModo('registro')} />
          : <Registro onCambiar={() => setModo('login')} />}
      </main>
    )
  }

  return (
    <main className="centro">
      <div className="tarjeta">
        <h2>¡Hola, {perfil?.alias ?? '...'}! 👋</h2>
        <p>Objetivo: {perfil?.objetivo ?? '...'}</p>
        <p>Meta semanal: {perfil?.meta_semanal ?? '...'} días</p>
        <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
      </div>
    </main>
  )
}

export default App