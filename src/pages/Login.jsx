// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await loginService(email, password)
      login(response)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '4px', padding: '2.5rem'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem',
          fontWeight: 900, letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '.5rem'
        }}>
          NEXUS<span style={{color:'var(--accent)'}}>.</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '.7rem',
          letterSpacing: '3px', textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: '2rem'
        }}>
          Inicia sesión
        </p>

        {error && (
          <div style={{
            background: 'rgba(255,59,92,0.1)',
            border: '1px solid rgba(255,59,92,0.3)',
            color: 'var(--danger)', padding: '.75rem 1rem',
            borderRadius: '2px', fontSize: '.85rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1.25rem'}}>
            <label style={{
              display: 'block', fontFamily: 'var(--font-mono)',
              fontSize: '.65rem', letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--muted)',
              marginBottom: '.5rem'
            }}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--bg-raised)',
                border: '1px solid var(--border)', color: 'var(--text)',
                padding: '.75rem 1rem', borderRadius: '2px',
                fontFamily: 'var(--font-body)', fontSize: '.9rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{marginBottom: '2rem'}}>
            <label style={{
              display: 'block', fontFamily: 'var(--font-mono)',
              fontSize: '.65rem', letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--muted)',
              marginBottom: '.5rem'
            }}>Contraseña</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--bg-raised)',
                border: '1px solid var(--border)', color: 'var(--text)',
                padding: '.75rem 1rem', borderRadius: '2px',
                fontFamily: 'var(--font-body)', fontSize: '.9rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-solid"
            style={{
              width: '100%', padding: '.875rem',
              fontSize: '.8rem', letterSpacing: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .7 : 1
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '1.5rem',
          fontFamily: 'var(--font-mono)', fontSize: '.7rem',
          color: 'var(--muted)'
        }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{color: 'var(--accent)'}}>
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}