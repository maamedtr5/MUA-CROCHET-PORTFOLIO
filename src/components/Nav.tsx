import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? 'var(--ink)' : 'var(--bark)',
  fontWeight: isActive ? 600 : 500,
  textDecoration: 'none',
  fontSize: '0.92rem',
});

export default function Nav() {
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
        <NavLink to="/" style={{ fontFamily: 'var(--script)', fontSize: '2rem', color: 'var(--ink)', textDecoration: 'none' }}>
          Adorn
        </NavLink>
        <ul style={{ display: 'flex', gap: 34, listStyle: 'none', margin: 0, padding: 0 }}>
          <li><NavLink to="/" style={linkStyle} end>Home</NavLink></li>
          <li><NavLink to="/about" style={linkStyle}>About</NavLink></li>
          <li><NavLink to="/portfolio" style={linkStyle}>Portfolio</NavLink></li>
          <li><NavLink to="/contact" style={linkStyle}>Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}
