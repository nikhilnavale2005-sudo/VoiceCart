function VoiceButton({ onClick, isListening }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`voice-button ${isListening ? 'listening' : ''}`}
    >
      {isListening ? 'Listening…' : '🎤 Start voice input'}
    </button>
  );
}

export default VoiceButton;
