import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? 'var(--ink)' : 'var(--bark)',
  fontWeight: isActive ? 600 : 500,
  textDecoration: 'none',
  fontSize: '0.92rem',
});

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(243,239,228,0.88)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <nav
        className="wrap"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px' }}
      >
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          style={{ fontFamily: 'var(--script)', fontSize: '2rem', color: 'var(--ink)', textDecoration: 'none' }}
        >
          Adorn
        </NavLink>

        <ul className={`nav-links${open ? ' is-open' : ''}`}>
          <li><NavLink to="/" style={linkStyle} onClick={() => setOpen(false)} end>Home</NavLink></li>
          <li><NavLink to="/about" style={linkStyle} onClick={() => setOpen(false)}>About</NavLink></li>
          <li><NavLink to="/portfolio" style={linkStyle} onClick={() => setOpen(false)}>Portfolio</NavLink></li>
          <li><NavLink to="/contact" style={linkStyle} onClick={() => setOpen(false)}>Contact</NavLink></li>
        </ul>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>
    </header>
  );
}
