import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import API_BASE_URL from '../config/api'
import '../styles/productos/comments.css'

export default function CommentsSection({ productId }) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [replyMap, setReplyMap] = useState({})

  const base = API_BASE_URL

  useEffect(() => {
    if (!productId) return
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  async function fetchComments() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${base}/productos/${productId}/comentarios`)
      if (!res.ok) throw new Error('No se pudieron cargar los comentarios')
      const data = await res.json()
      setComments(data || [])
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  function tokenHeaders() {
    const token = localStorage.getItem('nexus_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function handlePostComment(e) {
    e?.preventDefault()
    if (!newComment.trim()) return
    if (!isAuthenticated) return alert('Debes iniciar sesión para comentar')
    try {
      const res = await fetch(`${base}/productos/${productId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...tokenHeaders() },
        body: JSON.stringify({ content: newComment.trim() }),
      })
      if (!res.ok) throw new Error('Error creando comentario')
      const created = await res.json()
      setComments(prev => [created, ...prev])
      setNewComment('')
    } catch (err) {
      alert(err.message || 'Error')
    }
  }

  async function handlePostReply(parentId) {
    const text = (replyMap[parentId] || '').trim()
    if (!text) return
    if (!isAuthenticated) return alert('Debes iniciar sesión para responder')
    try {
      const res = await fetch(`${base}/productos/${productId}/comentarios/${parentId}/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...tokenHeaders() },
        body: JSON.stringify({ content: text }),
      })
      if (!res.ok) throw new Error('Error creando respuesta')
      const created = await res.json()
      setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...(c.replies||[]), created] } : c))
      setReplyMap(m => ({ ...m, [parentId]: '' }))
    } catch (err) {
      alert(err.message || 'Error')
    }
  }

  function handleReplyChange(id, value) {
    setReplyMap(m => ({ ...m, [id]: value }))
  }

  return (
    <div className="comments-root">
      <div className="comments-header">
        <h3>Comentarios</h3>
        <p className="comments-sub">Comparte tu experiencia con el producto</p>
      </div>

      <form className="comment-form" onSubmit={handlePostComment}>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? 'Escribe tu comentario...' : 'Inicia sesión para comentar'}
          disabled={!isAuthenticated}
          rows={3}
        />
        <div className="comment-form-actions">
          <button type="submit" disabled={!isAuthenticated || !newComment.trim()}>Publicar</button>
        </div>
      </form>

      {loading && <div className="comments-loading">Cargando comentarios...</div>}
      {error && <div className="comments-error">{error}</div>}

      <ul className="comments-list">
        {comments.map(c => (
          <li key={c.id} className="comment-item">
            <div className="comment-meta">
              <strong className="comment-author">{c.author?.nombre ?? c.autor ?? 'Usuario'}</strong>
              <span className="comment-date">{new Date(c.createdAt || c.fecha || Date.now()).toLocaleString()}</span>
            </div>
            <div className="comment-body">{c.content ?? c.contenido}</div>

            <div className="comment-actions">
              <button type="button" onClick={() => handleReplyChange(c.id, (replyMap[c.id] || ''))}>Responder</button>
            </div>

            <div className="comment-reply-box">
              <textarea
                value={replyMap[c.id] || ''}
                onChange={e => handleReplyChange(c.id, e.target.value)}
                placeholder={isAuthenticated ? 'Escribe una respuesta...' : 'Inicia sesión para responder'}
                disabled={!isAuthenticated}
                rows={2}
              />
              <div>
                <button type="button" onClick={() => handlePostReply(c.id)} disabled={!isAuthenticated || !(replyMap[c.id] || '').trim()}>Enviar</button>
              </div>
            </div>

            {(c.replies || []).length > 0 && (
              <ul className="comment-replies">
                {c.replies.map(r => (
                  <li key={r.id} className="comment-reply">
                    <div className="comment-meta">
                      <strong className="comment-author">{r.author?.nombre ?? r.autor ?? 'Usuario'}</strong>
                      <span className="comment-date">{new Date(r.createdAt || r.fecha || Date.now()).toLocaleString()}</span>
                    </div>
                    <div className="comment-body">{r.content ?? r.contenido}</div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
