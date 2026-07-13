import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header aria-label="VoiceCart header">
      <div>
        <h1 style={styles.title}>🛒 VoiceCart</h1>
        <p style={styles.subtitle}>
          A lightweight voice shopping assistant for quick list building.
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#64748b',
  },
};

export default Header;
