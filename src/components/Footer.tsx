export default function Footer() {
  return (
    <footer style={{ background: 'var(--espresso-bold)', padding: '44px 0' }}>
      <div
        className="wrap"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
      >
        <div style={{ fontFamily: 'var(--script)', fontSize: '1.3rem', color: 'var(--daiquiri)' }}>Adorn</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'var(--cream-on-bold)', opacity: 0.75 }}>
          © {new Date().getFullYear()} · Accra, Ghana
        </div>
      </div>
    </footer>
  );
}
