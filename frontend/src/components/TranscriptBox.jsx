function TranscriptBox({ transcript, statusMessage, error }) {
  return (
    <div style={styles.box}>
      <div style={styles.label}>Live feedback</div>
      <div style={styles.status}>{statusMessage}</div>
      {transcript ? <div style={styles.transcript}>You said: {transcript}</div> : null}
      {error ? <div style={styles.error}>{error}</div> : null}
    </div>
  );
}

const styles = {
  box: {
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '12px 14px',
    marginBottom: '16px',
    background: '#f8fafc',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748b',
  },
  status: {
    marginTop: '6px',
    color: '#0f172a',
  },
  transcript: {
    marginTop: '6px',
    color: '#4f46e5',
  },
  error: {
    marginTop: '6px',
    color: '#dc2626',
  },
};

export default TranscriptBox;
