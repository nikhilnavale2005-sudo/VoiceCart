function ShoppingForm({
  command,
  setCommand,
  onSubmit,
  isLoading,
  searchQuery,
  setSearchQuery,
  onSearch,
  onVoiceSearch,
  isVoiceSearchListening,
  language,
  setLanguage,
}) {
  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="command">
          Voice or text command
        </label>
        <input
          id="command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Try: add 2 bottles of water or find toothpaste under $5"
          style={styles.input}
        />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="language">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          style={styles.select}
        >
          <option value="en-US">English</option>
          <option value="es-ES">Español</option>
        </select>
      </div>
      <div style={styles.actions}>
        <button type="submit" style={styles.primaryButton} disabled={isLoading}>
          {isLoading ? 'Working...' : 'Process command'}
        </button>
        <div style={styles.searchBox}>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search current list"
            style={styles.searchInput}
          />
          <button type="button" onClick={onSearch} style={styles.secondaryButton}>
            Search
          </button>
          <button
            type="button"
            onClick={onVoiceSearch}
            style={isVoiceSearchListening ? styles.voiceButtonActive : styles.voiceButton}
          >
            {isVoiceSearchListening ? 'Listening…' : '🎤 Voice'}
          </button>
        </div>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: '12px',
    marginBottom: '16px',
  },
  fieldGroup: {
    display: 'grid',
    gap: '6px',
  },
  label: {
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    border: '1px solid #dbeafe',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    border: '1px solid #dbeafe',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '1rem',
    background: '#fff',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '10px 16px',
    background: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid #cbd5e1',
    borderRadius: '999px',
    padding: '8px 12px',
    background: '#fff',
    cursor: 'pointer',
  },
  voiceButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '8px 12px',
    background: '#0f172a',
    color: '#fff',
    cursor: 'pointer',
  },
  voiceButtonActive: {
    border: 'none',
    borderRadius: '999px',
    padding: '8px 12px',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
  },
  searchBox: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    minWidth: '260px',
  },
  searchInput: {
    flex: 1,
    border: '1px solid #dbeafe',
    borderRadius: '999px',
    padding: '8px 12px',
  },
};

export default ShoppingForm;
