function VoiceButton({ onClick, isListening }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...styles.button, ...(isListening ? styles.listening : {}) }}
    >
      {isListening ? 'Listening…' : '🎤 Start voice input'}
    </button>
  );
}

const styles = {
  button: {
    border: 'none',
    borderRadius: '999px',
    padding: '10px 16px',
    background: '#0f172a',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  listening: {
    background: '#dc2626',
  },
};

export default VoiceButton;
