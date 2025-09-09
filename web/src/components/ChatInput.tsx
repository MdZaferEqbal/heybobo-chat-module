const ChatInput = () => {
  return (
    <div className="inputwrap">
      <div>
        <textarea placeholder="Message…" aria-label="Chat input" />
      </div>
      <div className="controls">
        <input type="file" multiple hidden aria-hidden />
        <button
          className="iconbtn"
          title="Attach Files"
          aria-label="Attach files"
        >
          🧷
        </button>
        <button className="primary" aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
