function SuggestionPanel({ suggestions, onAdd, title = "Smart suggestions", emptyText = "Suggestions will appear as you add items.", buttonLabel = "Add" }) {
    return (
        <aside style={styles.panel}>
            <h3 style={styles.title}>{title}</h3>
            {suggestions.length === 0 ? (
                <p style={styles.emptyState}>{emptyText}</p>
            ) : (
                <ul style={styles.list}>
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.id || suggestion.name} style={styles.item}>
                            <div>
                                <div style={styles.itemName}>{suggestion.name}</div>
                                <div style={styles.reason}>{suggestion.reason || `${suggestion.category || "Product"}${suggestion.price ? ` · $${suggestion.price.toFixed(2)}` : ""}`}</div>
                            </div>
                            <button type="button" onClick={() => onAdd(suggestion.name)} style={styles.button}>{buttonLabel}</button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}

const styles = {
    panel: {
        background: "#eff6ff",
        borderRadius: "16px",
        padding: "16px"
    },
    title: {
        marginTop: 0,
        marginBottom: "12px"
    },
    emptyState: {
        color: "#64748b"
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: "10px"
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        gap: "8px",
        alignItems: "center",
        background: "#fff",
        borderRadius: "12px",
        padding: "10px 12px"
    },
    itemName: {
        fontWeight: 600
    },
    reason: {
        fontSize: "0.9rem",
        color: "#64748b"
    },
    button: {
        border: "none",
        background: "#4f46e5",
        color: "#fff",
        borderRadius: "999px",
        padding: "8px 12px",
        cursor: "pointer"
    }
};

export default SuggestionPanel;