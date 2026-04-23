import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <span className="footer__logo">NEXUS<span>.</span></span>
          <ul className="footer__links">
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Privacidad</a></li>
            <li><a href="#">Términos</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
          <p className="footer__copy">© 2026 NEXUS — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  )
}
