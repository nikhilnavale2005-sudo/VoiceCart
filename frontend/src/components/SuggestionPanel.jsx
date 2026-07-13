function SuggestionPanel({
  suggestions,
  onAdd,
  title = 'Smart suggestions',
  emptyText = 'Suggestions will appear as you add items.',
  buttonLabel = 'Add',
  }) {
    return (
      <aside className={`suggestion-panel ${className}`.trim()}>
        <h3>{title}</h3>
        {suggestions.length === 0 ? (
          <p style={styles.emptyState}>{emptyText}</p>
        ) : (
          <ul className="suggestion-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id || suggestion.name} className="suggestion-item">
                <div>
                  <div style={styles.itemName}>{suggestion.name}</div>
                  <div className="meta" style={styles.reason}>
                    {suggestion.reason || `${suggestion.category || 'Product'}${suggestion.price ? ` · $${suggestion.price.toFixed(2)}` : ''}`}
                  </div>
                </div>
                <button type="button" onClick={() => onAdd(suggestion.name)} className="btn-primary">
                  {buttonLabel}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    );
}

const styles = {
  panel: {
    background: '#eff6ff',
    borderRadius: '16px',
    padding: '16px',
  },
  title: {
    marginTop: 0,
    marginBottom: '12px',
  },
  emptyState: {
    color: '#64748b',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '10px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '12px',
    padding: '10px 12px',
  },
  itemName: {
    fontWeight: 600,
  },
  reason: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  button: {
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    borderRadius: '999px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
};

export default SuggestionPanel;
