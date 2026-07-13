function ShoppingList({ items, onDelete, onToggleComplete }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.title}>Shopping list</h3>
        <span style={styles.count}>{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <div style={styles.emptyState}>No items match the current search yet.</div>
      ) : (
        <ul style={styles.list}>
          {items.map((item) => (
            <li key={item._id} style={styles.item}>
              <label style={styles.itemLabel}>
                <input
                  type="checkbox"
                  checked={Boolean(item.completed)}
                  onChange={() => onToggleComplete(item)}
                />
                <div>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.meta}>
                    {item.quantity} {item.unit}
                    {item.brand ? ` · ${item.brand}` : ''}
                    {item.price ? ` · $${item.price.toFixed(2)}` : ''}
                    {item.category ? ` · ${item.category}` : ''}
                  </div>
                </div>
              </label>
              <button onClick={() => onDelete(item._id)} style={styles.deleteButton}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const styles = {
  section: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '16px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    marginTop: 0,
    marginBottom: '0.3rem',
    fontSize: '1.1rem',
  },
  count: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
  emptyState: {
    padding: '20px',
    border: '1px dashed #cbd5e1',
    borderRadius: '12px',
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
    alignItems: 'center',
    padding: '10px 12px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  itemLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  itemName: {
    fontWeight: 600,
  },
  meta: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  deleteButton: {
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    cursor: 'pointer',
  },
};

export default ShoppingList;
